---
slug: webpack-federation-architecture
title: Module Federation 的正确打开方式：微前端不是共享依赖那么简单
summary: Module Federation 解决的核心不是“共享 node_modules”，而是跨构建边界的装配与版本协商。本文从运行时 share scope、发布模型、故障域与治理成本出发，给出可落地的架构边界与反模式清单。
date: 2026-03-24
tags: [webpack, module-federation, 微前端, 架构, 运行时]
category: webpack
visualScene: module-graph
cover: /blog.png
series: webpack-systems-architecture
seriesTitle: Webpack 系统设计：模块图到运行时
seriesOrder: 5
draft: false
---

Module Federation（下文简称 MF）是近几年微前端领域最容易被误解的一项能力。它经常被描述成“让多个应用共享依赖”“像 npm 一样加载远程模块”，于是很多团队的落地路径也被误导：先把依赖共享开起来，再把页面拆出去，再试图用 MF 替代发布流程。最后通常会得到一个比单体更难维护的系统：线上偶发白屏、依赖版本冲突难以定位、回滚窗口被压缩、调试复杂度指数级上升。

我更愿意用一句话把 MF 的价值钉住：

**Module Federation 的核心是“跨构建边界的运行时装配与版本协商”，而不是“共享依赖”。**

共享依赖只是手段之一，而且是最容易引入系统性风险的手段之一。本文会从工程视角把 MF 的关键问题拆开：

1. MF 的运行时到底在做什么（share scope、remote container、版本选择）。
2. 为什么微前端的难点不是“怎么拆”，而是“怎么发布、怎么治理、怎么回滚”。
3. 如何设计边界：哪些东西应该被联邦化，哪些应该保留为独立部署。
4. 常见误区/反模式：为什么“共享越多越省”常常是灾难。
5. 我的判断：什么时候 MF 值得用，什么时候应该止步。

## 先从现实出发：微前端的目标不是拆，而是降低协作成本

微前端的动机通常来自协作问题：

- 团队规模变大，单体仓库的 CI、发布、代码评审变慢。
- 业务域差异明显，团队希望独立迭代、独立上线。
- 历史包袱与技术栈并存，需要渐进迁移而不是一次重写。

这些问题的本质是“组织与发布系统”问题，不是“技术拆分”问题。MF 能做的，是在某些边界上减少耦合成本，但它同时会引入新的耦合：运行时装配、版本协商、跨仓库兼容、灰度一致性。

所以我建议你把 MF 当成“组织结构的技术映射”，而不是“把页面切成远程模块的技术炫技”。

## MF 的机制：remote container + share scope + runtime 装配

MF 产物里最关键的不是远程模块本身，而是 **remote container**（远程容器）。它本质上是一个运行时可加载的模块注册表，包含：

- `get(module)`：返回某个 exposed 模块的工厂函数。
- `init(shareScope)`：初始化共享作用域，让远程知道宿主提供了哪些共享模块。

宿主侧的 runtime 负责：

1. 加载 remoteEntry（容器脚本）。
2. 初始化 share scope（宿主提供共享依赖的版本信息）。
3. 从 remote container `get` 目标模块并执行工厂，拿到 exports。

你可以把 MF 看成“把模块图的一部分延迟到运行时才装配”。这带来的收益是：独立构建/发布的远程可以被宿主动态加载；带来的代价是：**运行时的不确定性显著增加**。

## “共享依赖”不是福利，而是把一致性责任转移到运行时

共享依赖听起来很美：多个子应用不必重复打包 react/antd 等，体积更小，加载更快。但这句话隐含了一个巨大的前提：共享依赖必须在版本、语义、实例（singleton）层面保持一致，否则你会得到非常难排查的问题：

- React 多实例：hook 规则报错、context 不共享、渲染行为异常。
- UI 组件库版本不一致：样式错乱、主题 token 不一致、运行时错误。
- 状态库多实例：store 分裂、订阅失效、数据不同步。

共享依赖的本质是：你把“依赖一致性”从构建期（lockfile）搬到了运行时（share scope）。而运行时一致性远比构建期一致性难治理，因为它涉及：

- 宿主与远程的版本组合矩阵
- 灰度发布时不同用户拿到的不同组合
- CDN 缓存与回滚窗口
- 线上诊断与追溯（到底加载了哪个版本）

所以共享依赖不是默认选项，而是需要被严格治理的能力。

## 基本配置：Host/Remote 最小可用形态与关键开关

先给一个最小配置，作为后续讨论的参考。重点是“关键开关”，而不是照抄。

```js
// host webpack.config.js（示意）
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // remoteName@url
        marketing: 'marketing@https://cdn.example.com/marketing/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
  ],
}
```

```js
// remote webpack.config.js（示意）
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'marketing',
      filename: 'remoteEntry.js',
      exposes: {
        './Landing': './src/pages/Landing',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
  ],
}
```

这里至少有三点你必须明确：

1. `singleton: true` 不是“优化”，是正确性约束（至少对 React 这类依赖）。
2. `requiredVersion` 不是装饰，它决定了版本协商的边界与失败策略。
3. remoteEntry 的 URL 是发布系统的契约：你如何保证它可用、一致、可回滚，才是系统成败关键。

## 发布模型：remoteEntry 的稳定性比代码分割更重要

MF 最大的工程风险来自“运行时加载远程”，而运行时加载会立刻触发发布模型问题：宿主版本、远程版本、CDN 缓存、灰度策略如何组合？

常见事故路径：

1. 宿主发布了新版本，指向新的 remoteEntry（或新 exposed 模块名）。
2. 远程还未发布/未全量同步，或 CDN 命中旧版本。
3. 用户拿到宿主新版本，加载远程失败，白屏或功能缺失。

你会发现，这和传统的 chunk load error 非常像，但更难，因为 remote 是另一个团队/仓库/发布节奏。

因此我建议你把 MF 的发布模型当成“版本化装配系统”，至少满足：

- remoteEntry 必须版本化（buildId 或 contenthash 目录）。
- 宿主与远程要有兼容窗口（旧 remoteEntry 保留时间覆盖回滚与长尾用户）。
- 灰度必须按“组合”灰度：宿主版本与远程版本的组合要么一致，要么可控。

一种更可控的方式是让宿主不直接写死 remoteEntry URL，而是通过一个“远程清单”（manifest）来解析，并且把 manifest 作为可灰度、可回滚的配置资产：

```js
// 伪代码：host 运行时根据 manifest 决定 remoteEntry
async function loadRemote(remoteName) {
  const manifest = await fetch('/mf-manifest.json').then(r => r.json())
  const url = manifest.remotes[remoteName]
  await loadScript(url) // 加载 remoteEntry.js
  // 之后 init share scope + container.get(...)
}
```

这不是必须的实现方式，但它体现了工程方向：**把“远程地址”当成发布配置，而不是构建常量**。

## 边界设计：联邦化的应该是“能力”，不是“页面碎片”

微前端落地中最常见的错误是：先按页面拆，把每个页面都变成 remote exposed module。这样做会让系统边界变得极度细碎，宿主成了一个复杂的装配器，远程成了大量小模块的集合，最终你会得到：

- 远程数量多、加载链路长、失败概率高
- 共享依赖协商更复杂，组合矩阵爆炸
- 远程之间缺少明确的领域边界，演进困难

我更推荐的策略是：把联邦化对象设计为“能力边界”，比如：

- 一个业务域的“完整子应用壳”或“路由分支”
- 一个可独立演进的复杂能力（例如编辑器、可视化搭建器、支付流程）
- 一个具有明确 API/契约的组件集（但前提是版本治理成熟）

这样你能把 MF 的风险控制在少数关键边界上，而不是把整个站点变成动态拼装。

## 故障域与降级：远程失败必须是“可预期事件”

当你引入 MF，你必须接受一个事实：远程加载失败不是“极端情况”，而是系统必然会发生的事件（网络、缓存、发布、兼容都有可能触发）。因此你必须在架构上回答：

- 远程失败时，页面是否还能工作？
- 是功能降级，还是整页不可用？
- 用户是否能得到明确反馈？
- 你如何在监控/日志里追溯“加载了哪个 remoteEntry、哪个共享版本”？

工程上最基本的要求是：把远程加载包装成显式的错误边界，并对关键路径提供 fallback：

```js
// 伪代码：远程加载加错误边界与降级
async function safeImportRemote(moduleKey) {
  try {
    return await import(moduleKey) // 实际是 container.get(...) 的封装
  } catch (e) {
    // 记录 remoteName/url/版本信息，便于追溯
    reportFederationError(e)
    return { default: FallbackComponent }
  }
}
```

你不需要在每个页面都写一遍，但你必须在平台层提供这类能力，否则远程失败会以“偶发白屏”的形态出现，几乎无法在团队间协作定位。

## 常见误区/反模式：把 MF 当成“共享依赖工具”

### 反模式 1：把 shared 开成“全共享”

把所有 node_modules 都 shared，会让版本协商变成噩梦。很多库并不适合共享：它们可能依赖运行时全局、可能版本跨度大、可能有多实例副作用。共享越多，不确定性越大。共享应该是白名单，并且优先只共享正确性强约束的依赖（如 react）。

### 反模式 2：忽视 singleton 的正确性约束

React、路由、状态管理这类库通常要求单例语义。多实例会导致极难理解的行为差异。没有明确 singleton 策略的 MF 系统，通常会在规模变大后崩溃。

### 反模式 3：宿主与远程发布节奏无兼容约束

“各自独立发布”如果没有兼容窗口与契约测试，只会把集成测试从 CI 搬到线上。你需要对 exposed 模块的 API 做版本化，至少保证宿主新版本能在一段时间内兼容远程旧版本，或反之。

### 反模式 4：把页面拆成大量 remote modules，导致装配链路过长

装配链路越长，失败概率越高，调试成本越大。MF 更适合少数“重能力”的装配，而不是把整个 UI 切成碎片。

### 反模式 5：没有可观测性与追溯，出了问题只能“猜”

MF 的问题往往是组合问题：宿主版本 X + 远程版本 Y + 共享版本 Z + CDN 缓存状态。没有统一的日志字段与错误上报，你很难复现。把 remoteEntry url、share 版本选择、加载耗时纳入日志，是最低要求。

## 我的判断：MF 适合“强边界组织”，不适合“弱边界拼装”

我对 Module Federation 的总体判断是偏克制的：它非常强大，但它把“集成成本”从构建期搬到了运行时，只有当你的组织与平台能力足以治理这种成本时，它才会带来净收益。

我会在满足以下条件时考虑 MF：

1. 团队之间有清晰的领域边界与发布责任，远程不是“谁都能改的公共区”。
2. 有发布模型保障一致性：版本化目录、兼容窗口、灰度按组合推进、可回滚。
3. 有可观测性：能追溯远程地址、共享版本选择、加载失败原因与影响面。
4. 联邦化对象是“能力边界”，而不是页面碎片。

反过来，如果你的目标只是“减少重复打包体积”，MF 很可能不是最优解；更简单的做法通常是改善代码分割、依赖分层与缓存策略，成本更低、确定性更高。

MF 真正的价值不在共享依赖，而在让“跨团队、跨仓库、跨发布节奏”的系统仍然能在运行时被装配起来。要用好它，你需要把它当成架构系统来设计，而不是当成构建优化开关。 
