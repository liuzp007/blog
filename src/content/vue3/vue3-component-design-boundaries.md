---
slug: vue3-component-design-boundaries
title: Vue 3 组件设计的边界感：从可复用到可维护
summary: 组件“可复用”并不等于“可维护”。真正的维护成本来自边界不清：状态谁拥有、变化谁负责、扩展点在哪里、错误谁兜底。本文用 Vue 3 的组件协议（props/emits/slots）与组合能力（composable）讨论如何画出边界，避免把组件库写成隐形业务层。
date: 2026-03-24
tags: [vue3, component-design, 工程实践, 可维护性]
category: vue3
visualScene: reactivity-field
cover: /blog.png
series: vue3-architecture-core
seriesTitle: Vue 3 架构内核：响应式、组件与工程化
seriesOrder: 4
draft: false
---

很多团队做组件库时会陷入一个悖论：越追求“通用”，越难维护。因为通用往往意味着更多配置、更多分支、更多隐藏假设；一旦业务场景扩张，组件内部会逐渐堆满“兼容逻辑”，最后谁都不敢动。

在 Vue 3 语境里，我更建议把组件设计当作“边界设计”。组件是一个协议实体：它通过 props 接收输入，通过 emits 对外产生事件，通过 slots 提供结构扩展。你能否画出清晰边界，决定了组件能否长期演进。可复用只是短期指标，可维护才是长期目标。

本文不讨论“怎么写一个按钮”，而讨论：当你在中大型项目里设计组件时，哪些边界必须明确、哪些扩展点必须克制、哪些诱惑必须拒绝。

## 把组件当作“协议”，不是“UI 片段”

协议意味着你要回答四个问题：

1. 组件输入是什么：哪些 props 是必需的，哪些是可选的，哪些是互斥的？
2. 组件输出是什么：有哪些事件会被触发，payload 结构是什么？
3. 组件扩展点是什么：哪些地方允许插槽替换，插槽能拿到什么上下文？
4. 组件不负责什么：哪些行为属于上层业务或页面编排层？

当你缺少第 4 条，组件会变成“隐形业务层”：它看起来是 UI，但实际上在决定流程、权限、埋点（你项目禁用埋点）、缓存策略等高层规则。短期好用，长期维护会非常痛苦。

## 状态归属：谁拥有状态，谁就承担一致性责任

组件设计里最核心的边界是“状态归属”。你需要明确：状态由父组件控制（controlled），还是由组件内部自持（uncontrolled），或者二者兼容但有明确优先级。

在 Vue 3 中，`v-model`（`modelValue` + `update:modelValue`）是最常见的 controlled 模式。关键不在语法，而在一致性责任：父组件拥有状态，就必须负责状态合法性、持久化与跨域同步；子组件负责展示与交互，不应该偷偷修改“真相”。

一个工程化的写法是同时支持 controlled 与 default，但要明确规则：优先使用 `modelValue`，否则用内部状态；任何变更都通过 emit 暴露，避免“内部偷偷变”。

```ts
type Props = {
  modelValue?: string
  defaultValue?: string
  disabled?: boolean
}

type Emits = {
  (e: 'update:modelValue', v: string): void
  (e: 'change', v: string): void
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: '',
  disabled: false
})
const emit = defineEmits<Emits>()

const inner = ref(props.defaultValue)
const value = computed(() => props.modelValue ?? inner.value)

function setValue(v: string) {
  if (props.modelValue === undefined) inner.value = v
  emit('update:modelValue', v)
  emit('change', v)
}
```

这段代码的边界很清晰：组件永远不直接“写父状态”，只发事件；父组件是否接管状态是显式选择。

## 扩展点策略：slot 不是“万能定制接口”

slot 很强大，但它也是最容易把边界打穿的扩展点。一个常见现象是：组件一开始只有少数 slot，后来为了解决某个业务场景不断加 slot，最后组件成了“模板容器”，内部逻辑却还在承担复杂职责，导致结构与逻辑互相牵制。

我建议用三个规则约束 slot：

1. slot 应该服务于结构扩展，不应该作为数据流的主要通道。
2. slot 的上下文数据（slot props）必须稳定、可文档化，且尽量少。
3. 当你发现 slot 需要把内部状态大量暴露给外部时，通常意味着组件边界画错了，应该拆分职责而不是继续加 slot。

工程上更稳的做法是：把“可替换的结构”做成 slot，把“可配置的行为”做成 props，把“行为变化”做成 emits。让协议的三个面各司其职。

这里还有一个经常被忽略的点：slot 也应该有契约。没有契约的 slot 会变成“任何东西都能塞”，最终你的组件不得不对外部传入结构的副作用负责（布局被破坏、交互不可用、可访问性退化）。在 Vue 3 的工程化语境里，建议把 slot 的“可用上下文”写成显式类型，让使用方知道能拿到什么、不能依赖什么。

```ts
type Slots = {
  // 允许替换标题区域，但只暴露最小上下文：title 文本与一个关闭动作
  header?: (p: { title: string; close: () => void }) => any
  // 列表项结构扩展：只给出 item 与 index，不暴露内部状态机
  item?: (p: { item: { id: string; name: string }; index: number }) => any
  empty?: () => any
}

defineSlots<Slots>()
```

## 组合与组件：composable 负责能力，组件负责协议

Vue 3 的 composable 容易让人上头：逻辑抽象变简单了，于是有人把组件做得很薄，把所有东西塞进 composable，最后组件只剩模板与几行 glue。这个方向不是错，但必须有边界：**composable 负责能力，组件负责协议**。

能力是可组合的状态机与副作用策略；协议是对外契约。一个健康的结构通常是：

1. composable 里不依赖具体 UI（不 import 组件，不依赖 DOM 结构）。
2. composable 暴露的是“动作 + 派生”，而不是随意可写的内部状态。
3. 组件在顶层声明 props/emits/slots，把它们映射到 composable 的输入输出。

当你把协议层与能力层分离，你会得到更稳的重构路径：协议不变时可以重写能力实现；能力复用时可以产出多个不同协议的组件。

## 失败语义与降级：组件要声明“失败时会发生什么”

“可维护”很大一部分来自失败语义是否清晰：请求失败怎么办、校验失败怎么办、外部依赖缺失怎么办。如果组件把失败吞掉（只 `console.error` 或静默不显示），问题会在上层以更难定位的方式出现；如果组件把失败放大（直接 `throw` 或强耦合弹窗），它又把业务规则绑死在组件内部。

更推荐的方式是把失败当作协议的一部分：用 emits 把失败与重试意图抛给上层，由上层决定展示策略与兜底方式。组件内部只做最小默认展示与可恢复动作，不擅自决定“应该怎么提示用户”。

```ts
type Emits = {
  (e: 'error', payload: { code: string; message: string; cause?: unknown }): void
  (e: 'retry'): void
}

const emit = defineEmits<Emits>()

async function load() {
  try {
    // ... fetch
  } catch (cause) {
    emit('error', { code: 'LOAD_FAILED', message: '加载失败', cause })
  }
}

function retry() {
  emit('retry')
  void load()
}
```

## 组件的“不可变部分”：把不变量写进类型与约束

组件可维护性的来源之一是“不变量明确”。例如：

1. 某个表单控件必须有 `name` 或 `id` 才能被可访问性工具识别。
2. 某个列表必须保证 key 稳定，否则更新会抖动。
3. 某个异步操作必须具备取消语义，否则竞态会回写旧值。

这些不变量如果只写在注释里，最终会被遗忘；如果你能把它们部分写进类型、写进 runtime 校验、写进默认行为，维护成本会显著降低。

Vue 3 时代你至少可以做到：用 props 类型表达互斥/必需关系，用 emits 签名表达事件 payload，不要让“组件能不能用对”只能靠 code review。

## 复杂度预算：组件不是越通用越好，而是越“可预测”越好

通用性的代价往往是分支爆炸。你可以把组件复杂度看成一个预算：

1. 每加一个 prop/slot，都会增加组合空间。
2. 组合空间增大后，测试与理解成本非线性上升。
3. 当复杂度超过阈值，组件会从“可复用资产”变成“不可触碰遗产”。

因此更合理的策略通常是“分层通用”：

1. 基础组件：协议稳定、组合空间可控、几乎不包含业务语义。
2. 领域组件：承载领域语义，但扩展点更少，面向固定业务域。
3. 页面编排：把变化最快的逻辑留在页面层，用组合把领域组件拼起来。

很多团队失败在于把 2 写成 1：把领域语义塞进基础组件，最后基础组件被业务绑架。

## 常见误区与反模式：可复用变成不可维护的路径

1. 反模式：组件内部直接访问全局 store/router/api，把协议与实现绑定死。短期少写代码，长期任何重构都会牵一发动全身。
2. 反模式：为了“兼容所有场景”不断加 boolean prop（`showX`、`enableY`、`useZ`）。这会制造大量隐式组合，最后谁都不确定某个组合是否被支持。
3. 反模式：滥用 slot，把内部状态与行为通过 slot props 暴露给外部，形成强耦合模板依赖。你以为外部更灵活，实际上外部开始依赖你的内部实现。
4. 误区：把组件当作“业务规则容器”，例如在组件内部做权限判断、流程跳转、缓存策略。组件应当表达 UI 协议，规则应该在上层编排。
5. 误区：认为“写成 composable 就等于解耦”。composable 也可能是耦合放大器，关键在它是否依赖具体上下文、是否暴露了可维护的不变量。

## 我的判断：边界感决定组件寿命，协议清晰决定团队速度

我认为 Vue 3 组件设计最重要的不是“抽象能力”，而是“控制抽象半径”。组件越通用、扩展点越多、内部规则越复杂，越需要你用协议把边界钉死；钉不住，就不要硬做通用。

更具体的结论是：

1. 状态归属必须明确，避免双写与幽灵状态。
2. 扩展点要克制，slot 服务结构而不是承载数据流。
3. 能力与协议分离，用 composable 承载能力，用组件承载契约。

做到这三点，组件库不会变成隐形业务层；团队也不会在“改一个组件影响十个页面”的不确定性里消耗速度。这就是我理解的“从可复用到可维护”的边界感。
