---
slug: vue3-composition-api-architecture
title: Composition API 不是"更自由"，而是更适合抽象系统
summary: Composition API 的价值不在于"把 this 换成函数"，而在于它把逻辑抽象从组件层解耦为可组合的能力单元。本文从边界、依赖、生命周期与可测试性出发，讨论如何用它构建可维护的系统，而不是制造更隐蔽的耦合。
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

前阵子帮同事review一段Vue 3代码，看到他把Options API里的data、methods、computed全部照搬进了setup函数，变成了十几个ref加一堆普通函数，文件从300行变成了350行。他挺高兴的，跟我说「现在用Composition API了，更自由」。

我当时就愣住了。

这事让我想聊一个其实挺重要但很少有人说清楚的问题，Composition API到底解决了什么。如果你把它理解成「把this换成函数」「写法更灵活」，那你大概率会写出跟Options API一样乱的代码，只是换了个姿势。

## 组件是渲染单元，不是逻辑单元

坦率的讲，在大型应用里组件一直在干三件事。UI结构与交互，模板样式事件这些。领域状态与规则，比如筛选逻辑、权限判断、流程推进。还有系统副作用，请求啊缓存啊路由同步啊资源订阅这些。

Options API有个很微妙的问题，它天然鼓励你把所有跟组件相关的东西都写在同一个组件里。data里放状态，methods里放逻辑，computed里放派生值。写着写着，一个组件文件就变成了一个什么都装的大杂烩。你可能觉得这没什么，改的时候在同一个文件里找就行了嘛。

但问题来了。当某段逻辑的变化节奏跟UI完全不同步的时候，它就不应该被绑在组件里。你想想看，权限规则可能半年才改一次但影响几十个页面，请求缓存策略可能每周都在调但UI纹丝不动。这些东西被迫跟着某个组件文件滚动，你不觉得别扭吗？

Composition API做的事情其实很简单，它默认让你写函数。函数天然更适合抽象、复用与组合，也更容易被测试和拆分。它把抽象的单位从「组件」转移到了「能力」。组件仍然是渲染与交互的最小单元，但系统的复杂度从来不是来自渲染，而是来自状态的演化、规则的组合、副作用的编排。把这些东西从组件内部移出去，才是它真正该待的战场。

## Composable这件事，把能力做成可插拔模块

说真的，很多团队写useXxx的时候，脑子里想的是「复用代码片段」。我自己的感受是，这种想法一开始就跑偏了。

Composable应该是「封装能力并暴露稳定接口」，它得像模块一样被对待。什么意思呢，你的输入输出要明确，参数和注入依赖是输入，状态和动作是输出。你的生命周期要明确，资源在哪里申请就在哪里释放。你的边界也要明确，哪些状态对外可见，哪些是内部实现细节。

我举个例子你感受一下差异。下面这个composable把「会话态加上过期策略加上刷新动作」封装成一个能力，而不是把一堆ref暴露给组件随便改。

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

这里我刻意用了shallowRef，是为了减少深层依赖收集和无意义的更新。同时refresh的并发控制也被封装起来了，组件不需要每次自己写一遍那种防抖式互斥。

你看到了吗，这不是在「复用代码」，而是在「封装一个能力域」。组件拿到的是一个有明确边界的接口，它不需要知道内部怎么判断过期，怎么控制并发，它只需要在合适的时机调refresh和clear就行了。

## 依赖注入，把依赖变成契约

顺着上面的再聊聊依赖这件事。

很多团队写composable的时候特别顺手，直接import store、import router、import api，觉得这样简洁明了。看起来复用性很高，实际上耦合更深了。你只是把耦合从组件文件搬到了composable文件而已。

Composition API真正适合的做法是把依赖变成「契约」，怎么理解呢。

通过参数传入，这是最显式的依赖，容易测试，调用点也更清晰。通过provide和inject，适合上下文依赖，比如当前页面的资源、权限域、主题这些。通过工厂函数，在应用启动时绑定具体实现，业务代码里只依赖接口。

我给你看个例子，把请求层抽象成接口，通过inject注入。这样既能测试也能做多实现。

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

这种写法的收益不是什么「更优雅」，而是你的业务逻辑不再跟具体的axios实现绑死了。换缓存策略的时候不用改业务代码，做mock的时候不用改业务代码，做降级的时候也不用改业务代码。这几件事在大型项目里出现的频率，比你想象的高得多。

## 生命周期与资源，把副作用圈起来

回到副作用这块，这是很多人写Composition API的时候容易踩坑的地方。

在复杂页面里，副作用往往不是执行一次就结束的。订阅WebSocket、监听窗口事件、轮询、曝光可见性，这些东西是持续存在的。Composition API的一个关键能力是把这些副作用装进scope，让scope的生命周期跟着组件或者某个子域走。

一个特别常见的问题是，当你把可复用逻辑写成composable后，它可能被多个组件多次调用。如果你在composable内部创建了全局监听或者单例资源，就会出现那种特别难发现的重复订阅、重复请求、重复计时器。这种bug排查起来真的让人怀疑人生。

工程上比较稳妥的做法是这样的。默认composable是每次调用每次创建，资源在onScopeDispose里清理。如果确实需要共享，显式做成单例，并且写清楚共享策略，是按路由共享还是按用户共享还是按页面实例共享。

我有时候觉得，在「每次调用每次创建」的模型里，资源泄漏通常就来自两个点。一个是忘了dispose，另一个是dispose的条件和创建的条件不一致。所以你一定要把这两个操作尽量写在同一段代码里，减少认知跨度。别在文件开头创建资源然后在文件末尾清理，中间隔了200行，鬼记得住。

## 可测试性这件事，不是要不要写测试的问题

说真的，可测试性这个词听着挺虚的。但它其实不是「你要不要写测试」的问题，而是「你的代码允不允许被测试」的问题。

Composition API让你更容易做到两件事。把可变点前置，比如把fetcher、clock、storage作为参数传入，而不是内部直接访问。把副作用显式化，副作用以返回的动作函数形式存在，测试可以替换实现或者观测调用。

举个具体的例子。你处理时间相关逻辑的时候，如果直接在代码里访问Date.now，测试的时候你怎么控制时间？你控制不了。但如果你把clock抽象出来，传入一个getNow函数，规则就变成了纯函数，测试的时候想怎么玩就怎么玩。

这个事儿我自己也踩过坑。早期写代码的时候图省事，直接在composable里硬编码了一堆外部依赖。后来要写单测的时候才发现，我根本没法隔离环境。改了三天代码才把依赖全部抽出来。

## 组合不是堆叠，组合需要边界协议

这块需要注意一下。

Composable越写越多的时候，你会碰到一个很危险的状况。useA调useB，useB调useC，最后没人知道状态从哪里来。这不是Composition API的锅，是你缺少边界协议。

我一直觉得有三个规则特别重要。

一个composable只负责一个能力域。会话就是会话，权限就是权限，列表查询就是列表查询，别写那种大而全的usePage，短期看着省事长期全是雷。

输出以动作加派生优先，避免直接暴露可随意写入的内部ref。你把ref暴露出去了，外边随便改，你的invariant根本维持不住。

组合层负责编排，底层负责能力。编排层可以看作应用服务层，允许更贴近具体页面。

当你用这些规则管理组合之后，你会发现一个很有意思的变化。Composable越来越像「库代码」，组件越来越像「胶水代码」。这时候系统的复杂度就开始可控了。这才是Composition API真正能给你带来的收益。

## 几个我见过的典型反模式

反正我觉得有几个坑是很多人都会踩的，我直接列出来你感受一下。

在composable内部直接import router或者store或者api。看起来简洁，结果逻辑根本没法测试，没法迁移，想换实现的时候发现依赖链到处都是。

把UI状态写进通用composable。比如弹窗开关、hover状态这种东西，写进composable之后，所谓的「复用」就变成了「强制统一」。所有页面都被同一个抽象绑死了，你想在一个页面改个弹窗行为，发现改不动。

useXxx返回大量ref并且允许外部任意写入。你以为这是「灵活」，其实是把约束的责任甩给了调用者。调用者一不小心改了个值，你的内部状态就崩了，排查的时候还得翻调用方的代码。

为了少写代码把多个能力域合成一个composable。短期确实舒服，代码少了一大截。但不出三个月就会出现「改A影响B」的耦合爆炸，那种酸爽，经历过的人都懂。

把副作用写在computed里，或者在computed getter里发请求。computed的语义是派生，你混入副作用进去，时序就变得完全不可预测了。这种bug出现的时候你是完全无法复现的，因为时序每次都不一样。

## 说到底，这是从组件中心到能力中心的转变

怎么说呢，在Vue 3里你当然可以继续用组件组织UI，这没问题。但不要再用组件承载系统复杂度了。

Composition API最适合用在哪呢，两个地方。一个是抽象能力，把可重复的业务规则、副作用策略、状态机封装成模块，形成稳定接口。另一个是编排能力，在页面层用少量glue代码组合各种能力，让页面职责清晰、可替换、可演进。

如果你只把它当成更自由的写法，你会得到更自由的混乱。如果你把它当成更适合抽象系统的工具，你会得到结构化的增长空间。

这是我在几个大型项目里踩了无数坑之后，最确定的一个结论。

你觉得呢？
