---
slug: vue3-reactivity-core-mental-model
title: Vue 3 响应式核心：effect、track、trigger 背后的设计哲学
summary: Vue 3 的响应式不是“自动更新”这么简单，而是一套围绕依赖关系建模、调度与一致性约束的工程系统。本文从 effect/track/trigger 的职责边界出发，解释它为何能既快又稳，以及你在大型应用里该如何用它。
date: 2026-03-24
tags: [vue3, reactivity, effect, 工程化]
category: vue3
visualScene: reactivity-field
cover: /blog.png
featured: true
series: vue3-architecture-core
seriesTitle: Vue 3 架构内核：响应式、组件与工程化
seriesOrder: 1
draft: false
---

很多人把 Vue 3 响应式理解为“Proxy 让对象变聪明”。这句话不算错，但它会把注意力引向“拦截属性访问”这种实现细节，而忽略了真正决定系统能力上限的部分：依赖关系如何表达、如何合并、如何调度，以及如何在复杂场景里保持一致性与可预测性。

本文不写源码逐行讲解，而是给你一个能用于工程决策的心智模型：你什么时候应该依赖响应式的默认行为，什么时候应该主动切断依赖；你以为是“性能问题”的东西，往往是“依赖关系建模错误”；你以为是“写法问题”的东西，往往是“调度语义不清”。

## 响应式系统的目标不是“自动”，而是“可控的一致性”

响应式系统要解决的核心矛盾是：你希望状态变化能驱动 UI 更新，但你又不希望每次状态变化都把整个 UI 重算一遍。于是你需要在“正确性”和“成本”之间找到一个可控的平衡点。

Vue 3 的选择是把问题抽象为“依赖图”：

1. 读取状态时记录依赖（track）。
2. 状态变更时触发依赖（trigger）。
3. 被触发的依赖不是立刻执行，而是交给调度器（scheduler）在合适的时机批量执行。

这里的关键不是 Proxy，而是“把依赖关系当作一等公民”。当你能稳定地表达依赖关系，你就能做去重、合并、懒执行、优先级、批处理、暂停与恢复等一系列工程能力。

## effect：把“会变的东西”变成可调度的作业

effect 可以理解为“依赖收集单元 + 可执行作业”。它的价值在于把任意一段读取响应式数据的逻辑，变成一个可被系统管理的对象：能收集依赖、能清理旧依赖、能被触发、能被调度、能停止。

把 effect 当作“函数”会造成误解。更准确地说，effect 是“带生命周期的执行上下文”。它至少要处理三件事：

1. 进入 effect 时：把它压入栈，作为当前活跃依赖收集目标。
2. effect 执行时：任何响应式读取都会被 track 到当前 effect。
3. effect 结束时：出栈恢复上一个 active effect，并在必要时做依赖清理。

简化的伪代码如下（注意：这是心智模型，不是源码）：

```ts
type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<PropertyKey, Dep>
const targetMap = new WeakMap<object, KeyToDepMap>()

let activeEffect: ReactiveEffect | null = null
const effectStack: ReactiveEffect[] = []

class ReactiveEffect {
  deps: Dep[] = []
  active = true
  constructor(public fn: () => any, public scheduler?: () => void) {}

  run() {
    if (!this.active) return this.fn()
    cleanupEffect(this)
    try {
      activeEffect = this
      effectStack.push(this)
      return this.fn()
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1] ?? null
    }
  }

  stop() {
    if (!this.active) return
    this.active = false
    cleanupEffect(this)
  }
}
```

当你理解 effect 是“可调度的作业”，很多工程问题会变得清晰：你可以决定它什么时候执行（scheduler）、是否执行（stop）、在哪个作用域里执行（effectScope），以及它的依赖是否应该被收集（pauseTracking / enableTracking）。

## track：依赖记录是“精确绑定”，不是“模糊订阅”

track 做的事情看似简单：把 “target.key” 映射到 “依赖集合 Dep”，把 activeEffect 放进去。但工程上有两个难点：

1. 粒度：依赖应该绑定到“属性级别”而不是“对象级别”。否则任何字段变化都会引起全量重算。
2. 清理：同一个 effect 多次执行时，依赖集合会变化。必须先清掉旧依赖，否则会出现“逻辑已经不读取某字段，但还在被该字段变化触发”的幽灵订阅。

你在业务里最常见的性能坑，不是 Vue “慢”，而是你无意间把依赖粒度从“属性”退化成了“对象”，甚至退化成了“任何变化都触发”。例如：

1. 你在渲染中频繁读取一个大对象的很多字段，导致 effect 依赖集合巨大。
2. 你为了图方便把一堆不相关的状态塞进同一个 reactive 对象，让它们在同一 effect 中被共同收集。
3. 你用 computed 返回一个新对象/新数组，每次都触发下游依赖更新（因为引用变化）。

这些问题的共同点是：依赖关系建模不清，导致系统只能以更粗的粒度“保守触发”。

## trigger：触发不是“立刻执行”，而是“生产更新意图”

trigger 往往被误解为“字段变了就立刻执行 effect”。在 Vue 3 的设计里，trigger 更像是“生产一条更新意图”，真正的执行时机通常由调度器决定。

这样做的收益非常明确：

1. 去重：一个 effect 在同一个 tick 内可能被触发多次，只需要执行一次。
2. 合并：多个状态变化合并为一次渲染，避免中间态的无意义计算。
3. 顺序：组件更新、watch 回调、computed 重新求值需要有相对顺序，否则会出现“读到旧值”“回调比视图先跑/后跑”的可预测性问题。

在工程语境里，把 trigger 当成“提交更新”更贴切：它不保证立刻生效，但保证会在某个约定的时机生效，并且能与其他更新一起被正确排序。

## 调度器与批处理：系统性能的核心不在 Proxy，而在队列

你可以把 Vue 3 的运行时想成两层队列：

1. 响应式 effect 的调度（包括组件 render effect、watch effect、computed 相关）。
2. 组件更新队列（job queue），做去重与批量 flush。

一个非常现实的结论是：性能优化很少来自“少用 reactive”，更多来自“减少无意义的 job”和“降低 job 的依赖规模”。例如：

1. 把渲染无关的状态放在非响应式容器里（普通变量、shallowRef、markRaw）。
2. 把跨组件共享但变化频繁的状态从“全局 reactive”改为“按域拆分的 store”，减少订阅面。
3. 把昂贵计算放进 computed，并确保 computed 的依赖是可控且稳定的。

你也需要理解 flush 的语义：有些副作用应该在 DOM 更新后跑（例如读取布局），有些应该在 DOM 更新前跑（例如同步派生状态），有些可以异步批处理。

## computed：懒执行不是“偷懒”，是对依赖传播的控制

computed 的价值不是“帮你缓存”，而是“改变依赖传播的方式”。

普通 effect 是“热的”：依赖变了就会被触发（最终进入队列）。computed 更像“冷的”：依赖变了它不会立刻把值重新算出来，而是把自己标记为 dirty，等到有人读取它时才真正求值。这意味着：

1. 你可以减少无意义的计算（没人读就不算）。
2. 你可以把昂贵计算的成本推迟到真正需要的时刻。
3. 你可以通过“是否读取 computed”来控制下游依赖是否建立，从而控制更新传播范围。

一个工程化的写法是：把“派生状态”集中在 computed 中，而不是散落在 watch 回调里。这让状态流更可追踪：值从哪里来、依赖是什么、何时更新，都更直观。

```ts
import { computed, ref } from 'vue'

const raw = ref<string>('')

// 代价高的派生：只在真正渲染/使用时计算
const normalized = computed(() => {
  const s = raw.value.trim().toLowerCase()
  return s.replace(/\s+/g, ' ')
})

const tokens = computed(() => normalized.value.split(' ').filter(Boolean))
```

如果你把这些逻辑写成 watch，然后手动维护多个 ref，你等于把依赖传播交给了自己管理，成本更高且更容易出错。

## watch 的定位：它不是“派生状态工具”，而是“副作用边界”

watch / watchEffect 的定位应该是“副作用”，而不是“派生”。当你用 watch 去维护派生状态时，你实际上在写一个“手工调度系统”，风险包括：

1. 竞态：异步回调返回顺序不一致，旧请求覆盖新请求。
2. 中间态：连续变更时 watch 触发多次，导致 UI 进入短暂错误状态。
3. 依赖漂移：watchEffect 收集依赖是动态的，你以为它只依赖 A，结果因为某个分支读取了 B，它也订阅了 B。

正确的用法是把 watch 用在“与外部世界交互”的地方：请求、埋点（你项目禁用埋点）、本地存储、URL 同步、DOM 读取、WebSocket 订阅等。副作用天然需要“边界”，watch 就是边界。

## 常见误区与反模式：问题往往不是“写法”，而是“依赖关系失真”

1. 反模式：在 computed 中返回新对象/新数组当作最终状态，然后把它传给深层组件做 props 比较。每次求值都产生新引用，会放大下游更新。
2. 反模式：把“全局状态”放进一个巨大 reactive 对象里，任何页面都读取其中很多字段，导致订阅面巨大。最后你觉得“Vue 3 大型项目也会卡”，但根因是状态域没有边界。
3. 反模式：watchEffect 里写复杂分支逻辑，依赖收集随运行路径变化，导致“某些情况下不更新”“某些情况下更新太多”。
4. 误区：把 nextTick 当成“修复时序问题的万能钥匙”。nextTick 只能保证在队列 flush 之后执行，并不会修正错误的依赖建模。
5. 误区：遇到性能问题就把 reactive 改成 ref 或 shallowRef。类型上也许更简单，但如果依赖图本身不合理，换容器只是改变症状。

## 我的判断：把响应式当“依赖图工程”，而不是“语法体验”

我更愿意把 Vue 3 响应式看成一套“依赖图工程能力”，它解决的是：在不牺牲可预测性的前提下，让更新只发生在必要的位置。

当你做大型应用时，最重要的不是记住 API，而是建立两条纪律：

1. 让状态域有边界：不要用一个 reactive 容器承载所有变化。
2. 让派生用 computed、让副作用用 watch：把依赖传播交给系统，把外部交互放在明确边界。

你做对了这两点，effect/track/trigger 就不再是“底层细节”，而是你能用来解释、定位、优化复杂行为的工程语言。
