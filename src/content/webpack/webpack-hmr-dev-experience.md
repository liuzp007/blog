---
slug: webpack-hmr-dev-experience
title: HMR 的代价与收益：Webpack 开发体验背后的机制
summary: HMR 不只是“改代码不刷新页面”，它是 Webpack 运行时、模块图与 dev server 协同的一套增量更新协议。本文从机制出发解释 HMR 为什么能快、为什么会不稳定，以及如何用工程化边界把收益变成可持续的开发体验。
date: 2026-03-24
tags: [webpack, hmr, 开发体验, 运行时, 工程化]
category: webpack
visualScene: module-graph
cover: /blog.png
series: webpack-systems-architecture
seriesTitle: Webpack 系统设计：模块图到运行时
seriesOrder: 3
draft: false
---

HMR（Hot Module Replacement）是很多团队选择 Webpack 作为开发构建的核心理由之一：保存即看到变化、状态尽量不丢、刷新代价极低。但 HMR 也是最容易被“神话化”的能力：你以为它只要打开开关就能稳定提速，结果却遇到热更新失效、页面状态错乱、内存飙升、偶发报错只能刷新解决，甚至出现“热更新越用越慢”的逆向体验。

这篇文章想做的不是讲如何开启 HMR，而是讲清三件事：

1. **HMR 的机制到底是什么**：它如何在“模块图 + 运行时”上实现增量替换。
2. **HMR 的成本在哪里**：为什么它会变慢、会不稳定、会制造隐性 bug。
3. **工程上如何把 HMR 变成可持续收益**：边界、约束、工具化与团队约定。

如果你把 HMR 当成“更快的刷新”，你会在大型项目里撞墙；如果你把 HMR 当成“增量更新协议”，你才能用系统思维治理它。

## HMR 的本质：一套“增量更新协议”，不是魔法

Web 开发中，最朴素的变更路径是：

1. 源码变化
2. 重新构建
3. 浏览器整页刷新
4. JS 重新执行，状态丢失

HMR 的目标不是“完全不重新构建”，而是把第 2 步和第 3 步变成增量的：

- 构建层面：只重新编译受影响的模块与依赖链，而不是全量 rebuild。
- 运行时层面：把新的模块工厂注入到运行时，并通过 accept/decline 规则选择“替换”还是“回退到刷新”。

因此 HMR 其实是三方协同：

- **Webpack 编译器**：计算这次变更影响到哪些模块、哪些 chunk、生成更新清单与更新产物。
- **dev server（webpack-dev-server / middleware）**：把更新清单推送给浏览器，并提供更新模块的 HTTP 访问。
- **HMR runtime**：在浏览器中拉取更新、替换模块、执行 accept 回调、处理错误与回退。

只要其中任意一环的边界不清晰，你就会得到“热更新很玄学”的体验。

## 从模块图看 HMR：更新传播路径决定了“替换范围”

HMR 最关键的工程事实是：**一次源码变更会沿着依赖边向上冒泡**，直到遇到一个“愿意接住更新”的边界（accept boundary），否则就会升级为整页刷新（或失败）。

你可以把它理解为：

- 模块 A 变更
- 依赖 A 的父模块们会被标记为“受影响”
- 如果父模块声明“我接受 A 的更新”，传播停止，HMR 成功
- 如果一路往上都没人接受，传播到 entry，最终需要刷新

所以你在工程里看到的“改了一个组件导致整页刷新”，不一定是 HMR 坏了，而是**没有合理的 accept 边界**。React/ Vue 生态的“热更新插件/运行时”本质上就是：自动生成更聪明的 accept 边界，并在边界处做状态保留或重渲染。

更重要的是：accept 边界是“系统行为”，不是某个配置项。你需要从模块图的角度理解它：哪些模块属于可替换单元？哪些模块替换会破坏全局状态？

## HMR runtime 在做什么：注入新模块并驱动 accept 回调

从浏览器角度看，HMR runtime 的工作可以概括为：

1. 收到更新通知（websocket / event stream）
2. 拉取 manifest（告诉你哪些模块变了）
3. 拉取新的模块代码（hot update chunk）
4. 把新的模块工厂注册到运行时
5. 对受影响模块执行 dispose -> apply -> accept
6. 出错时回退（通常是整页刷新）

概念化伪代码如下（用于理解逻辑，不是可运行实现）：

```js
// 概念化 HMR 过程（伪代码）
async function onUpdate(hash) {
  const manifest = await fetch(`/__webpack_hmr?hash=${hash}`).then(r => r.json())
  const updatedModules = await loadHotUpdateChunk(manifest.hotUpdateChunk)

  // 1) dispose: 让旧模块释放资源并保存可迁移状态
  for (const id of manifest.updatedModuleIds) {
    const mod = __webpack_require__.c[id]
    if (mod && mod.hot && mod.hot._disposeHandlers) {
      const data = {}
      mod.hot._disposeHandlers.forEach(fn => fn(data))
      mod.hot.data = data
    }
  }

  // 2) apply: 替换模块工厂
  Object.assign(__webpack_require__.m, updatedModules)

  // 3) accept: 通知边界模块重新执行依赖逻辑
  for (const id of manifest.acceptedBoundaryIds) {
    const mod = __webpack_require__.c[id]
    mod && mod.hot && mod.hot._acceptHandlers.forEach(fn => fn())
  }
}
```

这里面最重要的工程点是 dispose：**热更新不是只替换代码，还必须处理“旧模块留下的副作用”**。否则你会遇到事件监听重复绑定、定时器泄漏、单例状态重复初始化等问题。

## 为什么 HMR 会变慢：增量编译的“管理成本”会随项目规模增长

HMR 的速度来自“增量”，但增量并不是免费的。项目越大，HMR 的管理成本越突出：

- 依赖图越大，影响分析越复杂（尤其是大量 re-export、barrel 文件、动态依赖）。
- loader/transform 越重，哪怕只更新一个模块也要走完整链路。
- source map、类型检查、lint 等如果混在同一进程，会拖累热更新。
- chunk 边界策略不稳定会导致更新产物更大（甚至接近全量）。

因此在大型项目中，“HMR 慢”通常不是单点问题，而是**一条链路上的多个小成本叠加**。工程治理要做的是：把 HMR 的关键路径变短、把非关键工作挪走或并行。

例如，把类型检查从主构建进程里剥离是常见且有效的做法：

```js
// webpack.config.js 片段：把 TS 类型检查移到独立进程（示意）
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: true, // 不阻塞 HMR
      typescript: { diagnosticOptions: { semantic: true, syntactic: true } },
    }),
  ],
}
```

同理，eslint、stylelint、测试等也应尽量以“异步提醒”而不是“阻塞编译”的方式存在，否则你是在把 HMR 的收益用工程流程的阻塞抵消掉。

## HMR 不稳定的根因：副作用边界不清晰 + 状态迁移不可控

HMR 的不稳定几乎总是“副作用管理失败”。你可以把副作用分成三类：

1. **全局副作用**：修改 window/document、注册全局事件、改原型链、注入 CSS、写 localStorage。
2. **资源副作用**：WebSocket 连接、定时器、worker、音视频、WebGL 上下文。
3. **模块级单例副作用**：模块顶层初始化的单例、缓存、注册表、依赖注入容器。

这些副作用在整页刷新时会被“自然清理”，但在 HMR 下它们会累积。如果你没有 dispose 清理逻辑，你会得到“越热更新越奇怪”的体验。

工程上可执行的建议是：**让副作用有明确的所有者**，并在所有者处建立 dispose/cleanup。

例如，在模块里注册事件监听，必须对应解除：

```js
// 某模块内的副作用：事件监听
function attach() {
  const onResize = () => {/* ... */}
  window.addEventListener('resize', onResize)

  // 让调用者能释放
  return () => window.removeEventListener('resize', onResize)
}

const detach = attach()

if (module && module.hot) {
  module.hot.dispose(() => detach())
}
```

你会发现：这套做法并不是“为了 HMR”，而是为了更清晰的资源生命周期。HMR 只是把这个工程欠账提前暴露出来。

## 开发体验不是“热更新成功率”，而是“失败时的可恢复性”

很多团队讨论 HMR，会把目标设为“尽量不刷新”。这很容易把你带到一个危险方向：为了保状态，允许系统进入不可预测状态。工程上更合理的目标是：

- 正常情况下尽量热更新（提升反馈速度）
- 非正常情况下快速、确定地回退到刷新（恢复一致性）
- 失败要可诊断（能知道是谁导致了无法 accept）

这就要求你对 HMR 的失败路径有设计：例如在特定错误类型下自动 full reload，并把错误原因打印得足够明确，让开发者知道“为什么热更新没生效”。

在团队协作里，这类“失败可恢复”比“99% 的热更新成功率”更重要，因为它决定了开发者是否会信任 HMR。信任一旦崩溃，大家会形成肌肉记忆：保存后立刻手动刷新，HMR 形同虚设。

## 常见误区/反模式：把 HMR 当成“免费午餐”

### 反模式 1：模块顶层做不可逆初始化

比如在模块顶层创建 WebSocket 连接、初始化监控 SDK、启动定时器。热更新会导致这些初始化重复执行，除非你显式做了单例保护与 dispose。顶层只做纯定义，副作用尽量放到可控的生命周期里，是更稳的做法。

### 反模式 2：为保状态而忽略一致性

当你看到 UI 状态奇怪、数据结构变更后仍沿用旧数据、某些 handler 引用旧闭包变量时，强行继续 HMR 只会制造更隐蔽的 bug。某些类型变更就应该触发刷新，让系统回到一致状态。

### 反模式 3：把 lint/typecheck 放在 HMR 关键路径阻塞

这会直接把开发反馈速度拉回到“全量构建”级别。正确做法是异步提示，或在 CI/提交前强制，而不是在每次保存阻塞。

### 反模式 4：忽略样式与资源的热替换边界

CSS 注入/抽取、MiniCssExtractPlugin 的 HMR 行为、asset module 的变更传播，都可能让你看到“样式热更新失效/闪烁”。这类问题通常不是单纯配置错误，而是你在样式策略上没有明确边界：开发态用 style-loader、生产态抽取，或者对 CSS 模块化与全局样式分层管理。

## 我的判断：把 HMR 当成“工程纪律的放大镜”，而不是性能开关

我对 HMR 的判断是：它更像一面放大镜，把你项目里那些本来就不健康的生命周期与副作用问题放大出来。你当然可以通过重启/刷新绕过去，但长期来看，真正决定开发体验的不是 HMR 是否开启，而是：

1. 模块是否具备清晰的副作用边界与清理机制（dispose/cleanup）。
2. 变更传播是否可控（accept boundary 合理，失败可回退）。
3. 构建链路是否把非关键工作移出关键路径（类型检查、lint、重型转换并行化）。

当你把这三点做好，HMR 会成为可持续的收益；当你忽略它们，HMR 只会把不一致与泄漏累积起来，最后让开发者用“手动刷新”把它废掉。 
