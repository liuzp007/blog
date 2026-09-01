---
slug: webpack-hmr-dev-experience
title: HMR 的代价与收益：Webpack 开发体验背后的机制
summary: HMR 不只是"改代码不刷新页面"，它是 Webpack 运行时、模块图与 dev server 协同的一套增量更新协议。本文从机制出发解释 HMR 为什么能快、为什么会不稳定，以及如何用工程化边界把收益变成可持续的开发体验。
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

我之前待过一个项目，代码量大概三十多万行，Webpack 的 HMR 刚开的时候团队都说爽，改个颜色保存就看到效果，不用刷新不用等，状态还在。用了大概两个月吧，群里开始有人问「你们热更新还好使吗」，然后越来越多人跟帖说「我也不行了」「改一下午得手动刷新三四次」「改完之后页面状态越来越诡异，最后只能全刷」。

当时我也没当回事，觉得可能是配置问题，或者某个人写的代码不规范。直到我自己也踩进去了，一个组件改了样式，HMR 报了个错，然后整个页面变成白屏，只能刷新。我盯着那个终端报错看了五分钟，心想这玩意不是号称提升开发体验的吗。

坦率的讲，那之后我才开始认真去了解 HMR 到底在干什么。不是看文档怎么配，而是搞清楚它底层到底在跑什么，为什么会炸，以及有没有办法让它不炸。

这篇文章聊的就是这些。

## HMR 到底是个什么东西

很多同学对 HMR 的理解就是「改代码不刷新页面」，这没毛病，但这个理解太粗糙了。

我先捋一下最朴素的开发流程。你改了源码，触发重新构建，然后浏览器整页刷新，JS 从头执行一遍，之前页面上的状态全没了。这个过程里，构建是全量的，刷新也是全量的，状态丢失是必然的。

HMR 想做的事情不是「完全不重新构建」，那是做不到的。它做的是把构建和刷新都变成增量的。

构建这边，只重新编译受影响的模块和它们的依赖链，不是每次都全量 rebuild。运行时这边，把新的模块代码注入到浏览器里已经跑着的 Webpack 运行时，然后通过一套 accept 和 decline 的规则来决定是局部替换还是回退到整页刷新。

所以 HMR 其实是三个东西在协同工作。

Webpack 编译器负责计算这次变更影响到了哪些模块、哪些 chunk，生成更新清单和更新产物。dev server 负责把更新清单推给浏览器，同时提供更新模块的 HTTP 访问。HMR runtime 在浏览器里负责拉取更新、替换模块、执行 accept 回调，处理错误和回退。

三方协同。只要其中任何一环的边界不清晰，你就会得到「热更新很玄学」的体验。说真的，不是它玄学，是你没看到完整的链路。

## 从模块图的角度看更新传播

我觉得这是 HMR 最值得搞清楚的一个工程事实。

一次源码变更会沿着依赖图向上冒泡，直到遇到一个「愿意接住更新」的边界，也就是 accept boundary。如果一路冒泡上去都没人接，那就只能整页刷新。

什么意思呢，我举个例子。模块 A 变了，依赖 A 的那些父模块会被标记为受影响。如果某个父模块声明了「我接受 A 的更新」，传播就停了，HMR 成功。但如果一路往上都没人接受，传播到了 entry，那就只能刷新。

所以你在项目里遇到的「改了一个小组件结果整页刷新了」，大概率不是 HMR 坏了，而是你的模块图里没有合理的 accept 边界。

React 和 Vue 生态那些热更新插件，它们做的事情你换个角度看就明白了，就是在自动生成更聪明的 accept 边界，并且在边界处做状态保留或者重渲染。

我自己有个感受是，accept boundary 这个东西不是某个配置项，它是一个系统行为。你得从模块图的角度去理解它，哪些模块属于可替换单元，哪些模块一旦替换就会破坏全局状态。这不是靠一个 plugin 就能解决所有问题的。

## runtime 那边到底在忙什么

从浏览器的视角看，HMR runtime 的工作其实挺机械的。先收到更新通知，一般是 websocket 或者 event source。然后拉一份 manifest，告诉你哪些模块变了。再去拉新的模块代码，也就是 hot update chunk。接着把新的模块工厂注册到运行时里。最后对受影响的模块执行 dispose、apply、accept 三步，出错了就回退，通常是整页刷新。

概念上大概长这样。

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

这里面有个东西特别重要，就是 dispose。

热更新不是只替换代码就完事了。旧模块可能留了一堆副作用在那里，事件监听绑了没解、定时器开着没清、单例状态初始化了两遍。如果你没有 dispose 的清理逻辑，这些东西就会累积，你就会得到那种「越热更新越奇怪」的体验。

## 为什么 HMR 会变慢

HMR 的速度来自增量，这没错。但增量不是免费的。

项目小的时候你可能感觉不到，一旦代码量上去了，问题就出来了。依赖图越大，影响分析就越复杂，尤其是你项目里还有一堆 re-export、barrel 文件、动态依赖的时候。loader 和 transform 链路越重，哪怕只更新一个模块也得把整条链路走完。source map、类型检查、lint 这些如果全塞在同一个进程里，也会拖累热更新。chunk 边界策略如果不稳定，更新产物可能越搞越大，甚至接近全量。

所以在大型项目里，「HMR 慢」通常不是某个单点的问题，是一条链路上很多小成本叠加出来的。

工程治理要做的事情就两条，把关键路径变短，把非关键工作挪走。

比如把类型检查从主构建进程里剥离出去，这个做法很常见也很有效。

```js
// webpack.config.js 片段：把 TS 类型检查移到独立进程（示意）
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: true, // 不阻塞 HMR
      typescript: { diagnosticOptions: { semantic: true, syntactic: true } }
    })
  ]
}
```

同理，eslint、stylelint、测试这些也应该尽量用异步提醒的方式存在，不要阻塞编译。不然你就是在拿 HMR 省下来的时间，又被工程流程的阻塞给还回去了。不划算。

## HMR 不稳定的根因

几乎总是副作用管理失败。

你可以把副作用分几类来看。全局副作用，比如改 window、document，注册全局事件，改原型链，注入 CSS，写 localStorage。资源副作用，比如 WebSocket 连接、定时器、worker、音视频、WebGL 上下文。还有模块级单例副作用，比如模块顶层初始化的单例、缓存、注册表、依赖注入容器。

这些副作用在整页刷新的时候会被自然清理掉，页面重新来一遍嘛。但在 HMR 下，它们会累积。你每热更新一次，旧的事件监听还在，旧的定时器还在，旧的单例还被占着。多来几次，就开始诡异了。

工程上能做的事情就是让副作用有明确的所有者，然后在所有者那里建立 dispose 和 cleanup。

比如你在模块里注册了一个 resize 监听，你得有对应的解除逻辑。

```js
// 某模块内的副作用：事件监听
function attach() {
  const onResize = () => {
    /* ... */
  }
  window.addEventListener('resize', onResize)

  // 让调用者能释放
  return () => window.removeEventListener('resize', onResize)
}

const detach = attach()

if (module && module.hot) {
  module.hot.dispose(() => detach())
}
```

你会发现，这套做法并不是「为了 HMR」才搞的，它本来就是你该做的事情，资源生命周期管理嘛。只是整页刷新帮你把欠账擦掉了，你看不到而已。HMR 只是把这笔欠账提前暴露出来了。

## 开发体验的关键不是「热更新成功率」

很多团队聊 HMR 的时候，目标都是「尽量不刷新」。怎么说呢，这个方向是有问题的。

因为你很容易滑到一个危险的地方，就是为了让状态不丢，允许系统进入一个你自己都说不清楚的状态。页面上显示的东西到底是新的还是旧的、数据结构变了但引用还指向旧的、某些 handler 闭包里捕获的变量已经过期了。你强行继续 HMR，只会制造更隐蔽的 bug。

工程上更合理的目标我觉得是三个。正常情况下尽量热更新，提升反馈速度。非正常情况下快速、确定地回退到刷新，恢复一致性。失败了要能诊断，让开发者知道是谁导致了无法 accept。

你需要在 HMR 的失败路径上有设计。比如特定错误类型下自动 full reload，并且把错误原因打印得足够明确，别就一个红色的 error 堆在那。

在团队协作里，这种「失败可恢复」比「99% 的热更新成功率」重要得多。因为它决定了开发者信不信 HMR。信任一旦崩了，大家会形成肌肉记忆，保存之后立刻手动刷新。那 HMR 就形同虚设了。

## 几个常见的坑

坦率的讲，都是我自己踩过的。

第一个，模块顶层做不可逆初始化。比如在模块顶层创建 WebSocket 连接、初始化监控 SDK、启动定时器。热更新会导致这些初始化重复执行，除非你显式做了单例保护和 dispose。顶层只做纯定义，副作用尽量放到可控的生命周期里，这是更稳的做法。

第二个，为保状态而忽略一致性。当你发现 UI 状态开始奇怪、数据结构变了但还在用旧数据、某些 handler 引用了旧闭包变量的时候，别硬撑了。有些变更就该触发刷新，让系统回到一致状态。

第三个，把 lint 和 typecheck 放在 HMR 的关键路径上阻塞。这会直接把你的反馈速度拉回到全量构建的水平。正确做法是异步提示，或者放到 CI 和提交前去强制，别在每次保存的时候卡住。

第四个，忽略样式和资源的热替换边界。CSS 注入和抽取的行为、MiniCssExtractPlugin 的 HMR 行为、asset module 的变更传播，都可能让你看到样式热更新失效或者闪烁。这类问题通常不是单纯配置错了，而是你的样式策略没有明确边界。开发态用 style-loader、生产态抽取，CSS 模块化和全局样式分层管理，这些得想清楚。

## 我最后的想法

我对 HMR 的判断是，它更像一面放大镜。

你项目里那些本来就不健康的生命周期管理、本来就不清晰的副作用边界、本来就该做但没做的资源清理，它统统给你放大出来。你当然可以通过重启和刷新绕过去，我以前也这么干。但长期来看，真正决定开发体验的不是 HMR 开不开，而是你的模块有没有清晰的副作用边界和清理机制，变更传播是不是可控，构建链路有没有把非关键工作移出关键路径。

把这几件事做好，HMR 会成为可持续的收益。做不好，它只会把不一致和泄漏一点点累积起来，最后让所有开发者都用「手动刷新」把它废掉。

那你的 HMR，还好使吗。
