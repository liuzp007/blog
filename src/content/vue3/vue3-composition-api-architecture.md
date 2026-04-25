---
slug: vue3-composition-api-architecture
title: Composition API 不是“更自由”，而是更适合抽象系统
summary: Composition API 的价值不在于“把 this 换成函数”，而在于它把逻辑抽象从组件层解耦为可组合的能力单元。本文从边界、依赖、生命周期与可测试性出发，讨论如何用它构建可维护的系统，而不是制造更隐蔽的耦合。
date: 2026-03-24
tags: [vue3, composition-api, 架构, 工程化]
category: vue3
visualScene: reactivity-field
cover: /blog.png
series: vue3-architecture-core
seriesTitle: Vue 3 架构内核：响应式、组件与工程化
seriesOrder: 3
draft: false
---

如果你把 Composition API 当作“Options API 的替代写法”，那你很难写出真正有收益的代码。因为你仍然会把抽象的单位定义成“组件”，只是把 data/methods/computed 变成了一堆同文件里的函数。这样做最多提升局部可读性，但不会显著降低系统复杂度。

Composition API 更重要的意义在于：它允许你把抽象单位从“组件”转移到“能力（capability）”。组件仍然是渲染与交互的最小单元，但业务系统的复杂度并不来自渲染，而来自状态的演化、规则的组合、副作用的编排与跨边界的协作。把这些复杂度从组件内部移出去，才是它的主战场。

## 组件是渲染单元，不是逻辑单元

在大型应用里，组件承担三类职责：

1. UI 结构与交互：模板、样式、交互事件。
2. 领域状态与规则：例如筛选、权限、流程推进。
3. 系统副作用：请求、缓存、路由同步、资源订阅、可见性等。

Options API 很容易让 2/3 混入 1，因为它鼓励“把与组件有关的东西都写在组件里”。Composition API 则反过来：它默认让你写函数，函数天然更适合抽象、复用与组合，也更容易被测试与拆分。

一个关键判断是：当某段逻辑的变化节奏与 UI 变化节奏不同，它就不应该被绑定在组件里。比如权限规则变化很慢但影响面很大，请求缓存策略变化很快但 UI 可能不变，二者都不应被迫跟着某个组件文件滚动。

## Composable 的本质：把能力做成“可插拔模块”

Composable（useXxx）不是“复用代码片段”，而是“封装能力并暴露稳定接口”。这意味着它应该像模块一样被对待：

1. 明确输入输出：输入是参数与注入依赖，输出是状态与动作。
2. 明确生命周期：创建、激活、暂停、销毁；资源在哪里申请在哪里释放。
3. 明确边界：哪些状态对外可见，哪些是内部实现细节。

你可以用一个简单例子感受差异。下面这个 composable 把“会话态 + 过期策略 + 刷新动作”封装为能力，而不是把一堆 ref 暴露给组件随便改：

```ts
import { computed, ref, shallowRef } from 'vue'

export interface Session {
  token: string
  expiresAt: number
}

export function useSession() {
  const session = shallowRef<Session | null>(null)
  const refreshing = ref(false)
  const isValid = computed(() => {
    const s = session.value
    return !!s && s.expiresAt > Date.now() + 30_000
  })

  async function refresh(fetcher: () => Promise<Session>) {
    if (refreshing.value) return
    refreshing.value = true
    try {
      session.value = await fetcher()
    } finally {
      refreshing.value = false
    }
  }

  function clear() {
    session.value = null
  }

  return { session, isValid, refreshing, refresh, clear }
}
```

这里刻意使用 shallowRef，是为了减少深层依赖收集与无意义更新；同时 refresh 的并发控制也被封装起来，组件不需要每次都自己写一遍“防抖式互斥”。

## 依赖注入：把“依赖”从“导入”变成“契约”

很多团队把 composable 写成“随处 import store / router / api”，结果它看起来复用性很高，实际上耦合更深：你只是把耦合从组件文件搬到了 composable 文件。

Composition API 真正适合的做法是把依赖变成“契约”：

1. 通过参数传入：显式依赖，易测试，调用点更清晰。
2. 通过 provide/inject：适合上下文依赖，例如当前页面的资源、权限域、主题、埋点（你项目禁用埋点）等。
3. 通过工厂函数：在应用启动时绑定具体实现，在业务代码里只依赖接口。

例如，把“请求层”抽象成接口，通过 inject 注入，既能测试也能做多实现：

```ts
import { inject } from 'vue'

export interface ApiClient {
  get<T>(url: string, params?: Record<string, any>): Promise<T>
  post<T>(url: string, body?: any): Promise<T>
}

export const ApiKey = Symbol('ApiClient')

export function useApi(): ApiClient {
  const api = inject<ApiClient>(ApiKey)
  if (!api) throw new Error('ApiClient not provided')
  return api
}
```

这样写的收益不是“更优雅”，而是：你的业务逻辑不再与具体 axios 实现绑定，换缓存策略、做 mock、做降级都更自然。

## 生命周期与资源：effectScope 是把副作用“圈起来”的工具

在复杂页面里，副作用往往不是“执行一次就结束”，而是持续存在：订阅 WebSocket、监听窗口事件、轮询、曝光可见性等。Composition API 的一个关键能力是把这些副作用装进 scope，并让 scope 的生命周期跟随组件或某个子域。

一个常见的问题是：当你把可复用逻辑写成 composable 后，它可能被多个组件多次调用。如果你在 composable 内部创建了全局监听或单例资源，就会出现难以发现的重复订阅、重复请求、重复计时器。

工程上更稳妥的做法是：

1. 默认 composable 是“每次调用每次创建”，资源在 onScopeDispose 清理。
2. 如果需要共享，显式做成单例，并写清楚共享策略（按路由、按用户、按页面实例等）。

在“每次调用每次创建”的模型里，资源泄漏通常来自两个点：忘记 dispose，或者 dispose 的条件与创建条件不一致。你需要把二者尽量写在同一段代码里，减少认知跨度。

## 可测试性：把可变点前置，把副作用显式化

可测试性不是“要不要写测试”的问题，而是“你的代码是否允许被测试”。Composition API 让你更容易做到两件事：

1. 把可变点前置：例如把 fetcher、clock、storage 作为参数传入，而不是内部直接访问。
2. 把副作用显式化：副作用以返回的动作函数形式存在，测试可以替换实现或观测调用。

举例来说，处理时间相关逻辑时，直接访问 Date.now 会让测试变难。把 clock 抽象出来后，规则就变成纯函数，副作用也更明确。

## 组合不是“堆叠”，组合需要“边界协议”

组合的危险在于：当 composable 越写越多，你可能会出现“useA 调 useB 调 useC，最后没人知道状态从哪里来”。这不是 Composition API 的锅，而是你缺少边界协议。

我建议用三个规则约束组合：

1. 一个 composable 只负责一个能力域：例如“会话”“权限”“列表查询”“编辑器状态”，不要写“大而全的 usePage”。
2. 输出以“动作 + 派生”优先，避免直接暴露可随意写入的内部 ref。
3. 组合层要负责“编排”，底层要负责“能力”。编排层可以看作应用服务层，允许更贴近具体页面。

当你用这些规则管理组合，你会发现 composable 更像“库代码”，而组件更像“胶水代码”。这时系统复杂度开始可控。

## 常见误区与反模式：看似复用，实际上扩大耦合

1. 反模式：在 composable 内部直接 import router/store/api，导致逻辑难以测试、难以迁移、难以替换实现。
2. 反模式：把 UI 状态（如弹窗开关、hover 状态）写进通用 composable，导致“复用”变成“强制统一”，最后所有页面都被同一个抽象束缚。
3. 反模式：useXxx 返回大量 ref 并允许外部任意写入，导致 invariant 无法维持。你以为是“灵活”，实际上是把约束交给调用者背锅。
4. 误区：为了“少写代码”把多个能力域合成一个 composable。短期舒服，长期会出现“改 A 影响 B”的耦合爆炸。
5. 误区：把副作用写在 computed 里（或在 computed getter 中发请求）。computed 的语义是派生，混入副作用会把时序变得不可预测。

## 我的判断：Composition API 让架构从“组件中心”转向“能力中心”

在 Vue 3 里，你可以继续用组件组织 UI，但不要再用组件承载系统复杂度。Composition API 最适合用在两类地方：

1. 抽象能力：把可重复的业务规则、副作用策略、状态机封装成模块，形成稳定接口。
2. 编排能力：在页面层用少量 glue 代码组合能力，让页面职责清晰、可替换、可演进。

如果你只把它当作“更自由的写法”，你会得到更自由的混乱；如果你把它当作“更适合抽象系统的工具”，你会得到结构化的增长空间。这是我在大型项目里最确定的结论。
