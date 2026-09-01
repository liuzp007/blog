---
slug: webpack-loader-plugin-boundary
title: Loader 与 Plugin 的边界：Webpack 可扩展架构的深层规律
summary: Loader 与 Plugin 的区别不是"一个处理文件，一个做别的"，而是职责边界：Loader 更像可缓存的纯函数变换，Plugin 则是编译生命周期的调度器。理解边界，才能写出稳定、可诊断、可迁移的工程扩展。
date: 2026-03-24
tags: [webpack, 工程化, loader, plugin, 构建体系]
category: webpack
visualScene: module-graph
cover: /blog.png
series: webpack-systems-architecture
seriesTitle: Webpack 系统设计：模块图到运行时
seriesOrder: 2
draft: false
---

事情是这样的。有次帮一个团队排查构建问题，打开他们的 webpack 配置一看，loader 里发网络请求，plugin 里用正则硬抠源码做 AST 变换，两个东西之间靠一个全局变量传状态。我当时就愣住了。

这玩意跑是能跑，但一开 watch 模式就各种诡异的热更新问题，换个 node 版本构建结果都不一样，升级 webpack 更是想都别想。

坦率的讲，这个问题我自己也踩过。早年写构建工具的时候，loader 和 plugin 之间的边界也是随便画的，反正能编译过去就完事。直到项目大了、团队人多了，才发现这种"随便画"的代价特别高。

今天这篇就专门聊聊这个边界到底该怎么画，以及画错了会怎样。

## 边界不是规范，是成本问题

很多人觉得 loader 和 plugin 的边界是个"代码规范"问题，什么该放 loader 里什么该放 plugin 里，好像只是团队约定的事。

我自己的感受是，这个边界根本不是规范问题，是成本问题。

缓存成本。loader 设计得越纯，输入越明确，webpack 就越容易帮你缓存。plugin 一旦掺杂了不确定性，整个 compilation 的缓存收益都会跟着骤降。你想想看，一个 loader 里面塞了网络请求，它的输出就不是完全由输入决定的了，缓存就废了，这个模块每次都得重新跑。

诊断成本。plugin 操纵的是编译生命周期，出问题的时候你得搞清楚它在哪个阶段修改了什么。loader 操纵的是单个模块，出问题的时候你只需要搞清楚它对这个文件做了什么。这两个东西的诊断路径完全不一样，如果你把它们混在一起，排查问题的时候脑子会很分裂。

升级成本。webpack 核心API 的变化主要集中在 compiler 和 compilation 的 hooks 上面，以及模块工厂相关的接口。如果你把逻辑乱塞，哪天 webpack 升级了，你会发现自己牵一发而动全身。

所以我的建议是，把 loader 和 plugin 的边界当成"工程的稳定接口"来对待，而不是写法偏好。

## Loader 的本质，就是一个可缓存的纯函数

说真的，loader 最简单的心智模型就是，给它 source、map、meta，它吐出 transformedSource。就这么回事。

它围绕"单个模块"做变换，天然处在模块解析的早期阶段。你想想看，从 NormalModuleFactory 到 run loaders，这条路上每个模块都会走一遍 loader 链。

loader 好就好在三件事上。

输入明确，就是资源路径加源码字符串加上游 loader 的产物。输出明确，就是下一步要交给 parser 的代码字符串和 source map。缓存友好，只要 loader 的输出只依赖输入和 options，就可以稳定缓存。

下面是一个合格的 loader 骨架，它明确声明可缓存，只依赖 source 与 options，对 source map 做透明传递。

```js
// loaders/example-transform-loader.js
module.exports = function exampleTransformLoader(source, map, meta) {
  // 只要输出只依赖输入，就应该 cacheable
  this.cacheable && this.cacheable(true)

  const options = this.getOptions ? this.getOptions() : {}
  const banner = options.banner || ''

  // 最小变换示例：为模块顶部插入注释（不要在这里做 IO/网络）
  const out = banner ? `/* ${banner} */\n${source}` : source

  // 返回形式：可以 callback，也可以 return
  this.callback(null, out, map, meta)
}
```

这个例子很简单对吧。但它体现了 loader 的工程价值，可缓存、可预测、局部影响。当你用 loader 做变换的时候，你是在让模块图的节点以可控的方式改变形态，而且只改变它自己。

## Plugin 的本质，是编译生命周期的编排

回到 plugin 这块。

plugin 的心智模型不是"处理某个文件"，而是"在编译的某个时刻做某种全局性决策"。它通过 compiler 和 compilation 的 hooks 介入整个流程，从 entry 到解析到优化到生成到 emit，哪个阶段都能插手。

plugin 更适合做这些事情。

跨模块的决策，比如生成一份 manifest、统计依赖关系、统一注入 runtime 配置、决定 chunk 边界策略。全局一致性控制，比如约束某类依赖的版本、阻止某些 import 进入产物、在 emit 阶段修改 asset。与基础设施对接，比如把 build 产物信息写入内部系统。

下面是一个合格的 plugin 骨架，它不碰 loader 变换细节，而是在 compilation 结束时读取 assets，生成额外资产并注入输出。

```js
// plugins/build-manifest-plugin.js
class BuildManifestPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('BuildManifestPlugin', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'BuildManifestPlugin',
          // 选择合适的阶段，避免和其它插件互相踩
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        },
        () => {
          const manifest = {}
          for (const filename of Object.keys(compilation.assets)) {
            // 这里做的是"资产级"决策，而不是"源码级"变换
            manifest[filename] = { size: compilation.assets[filename].size() }
          }
          const json = JSON.stringify(manifest, null, 2)
          compilation.emitAsset('manifest.json', new compiler.webpack.sources.RawSource(json))
        }
      )
    })
  }
}

module.exports = BuildManifestPlugin
```

注意看这个 plugin 依赖的是什么，是 compilation 的全局产物，不是某个模块的源码细节。当你需要"全局一致性"的时候，plugin 才是正确的工具选择。

## 两者协作怎么办

顺着上面的再聊聊。

大型项目里总会有 loader 和 plugin 需要协作的场景。比如 loader 负责把某种 DSL 编译成 JS，但 plugin 需要收集这些模块的元信息来生成路由表或者国际化 key。又比如 loader 负责注入某些标记，plugin 负责在 chunk 或 asset 级别做统一处理。

这时候最危险的写法是什么，是"隐式共享状态"。loader 把数据塞到一个全局变量里，plugin 再去读。或者 plugin 在 loader 的 this 上面挂临时字段。短期能跑，长期在 watch 模式和 HMR 下，在并发编译下，在多 compiler 场景下，一定会出问题。

数据串台、内存泄漏、热更新后旧状态残留，各种诡异问题都会冒出来。

一个更稳的方式是，通过 compilation 作为"单次编译的上下文"来存储数据。这相当于把状态限定在"这次 compilation"里，生命周期清晰，不会跨编译污染。

```js
// loader: 把收集到的信息挂到 compilation 上（单次编译隔离）
module.exports = function collectMetaLoader(source) {
  this.cacheable && this.cacheable(true)
  const compilation = this._compilation
  const storeKey = 'collectMeta'
  const store = compilation[storeKey] || (compilation[storeKey] = [])

  store.push({
    resource: this.resourcePath,
    // 这里只示例：真实场景不要用正则硬抠复杂语法
    hasMagicComment: /webpackChunkName/.test(source)
  })

  return source
}
```

```js
// plugin: 在合适阶段读取 compilation 上的数据并产出资产
class CollectMetaPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('CollectMetaPlugin', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'CollectMetaPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        },
        () => {
          const list = compilation.collectMeta || []
          const json = JSON.stringify({ items: list }, null, 2)
          compilation.emitAsset('collect-meta.json', new compiler.webpack.sources.RawSource(json))
        }
      )
    })
  }
}
```

这个方案的要点是状态归属清晰，watch 下不会跨编译污染，并发编译时不互相踩。你想想看，compilation 就是一次编译的沙箱，把数据放在这个沙箱里，天然就是隔离的。

## 怎么判断一件事该写在哪

我建议用一句话做分界。

loader 就是把某个模块的输入变成某个模块的输出。plugin 就是把这次编译的事实变成这次编译的决策或资产。

你可以用三个问题来检查自己。

逻辑是否必须看见多个模块才能成立？如果是，倾向 plugin。逻辑是否应该被缓存为输入确定输出确定？如果是，倾向 loader。逻辑是否依赖编译生命周期，比如阶段、顺序、优化？如果是，倾向 plugin。

不是什么复杂的判断框架，就这三个问题，想清楚就行。

## 几个我见过的反模式

这块需要注意一下，这些反模式都是我真切地在项目里见过的，不是编的。

在 loader 里做 IO 和网络请求。loader 运行在模块解析阶段，属于高频路径，模块越多调用次数越多。把 IO 放进 loader 会导致 watch 变慢且性能不可预测，网络抖动磁盘竞争都会影响构建时间，缓存收益也会因为输出依赖外部状态而下降，构建的可复现性也变差了。如果你必须做 IO，把它放到 plugin 里，把 IO 输出转化为构建输入或构建产物，让依赖关系显式化。

在 plugin 里做源码 AST 变换。不是说绝对不行，而是代价很高。plugin 的源码变换往往发生在更晚的阶段，很容易和其他优化比如 tree-shaking 和 minify 互相干扰。更致命的是你会把模块级变换变成全局变换，失去可缓存与可定位的优势。如果变换是每个模块都要做的，优先考虑 loader，plugin 更适合做编译层策略。

用全局变量在 loader 和 plugin 之间传状态。watch 模式、multi-compiler、并行构建下都会出诡异问题。数据串台、内存泄漏、热更新后旧状态残留。把状态挂到 compilation 上，或者显式写到 asset 里，是更可靠的工程做法。

滥用 pitch 和 this.async 造所谓可控并发。loader 的异步并不会天然带来收益，尤其在磁盘和 CPU 已经饱和的时候，只会带来更多不确定性。除非你明确知道你在隐藏什么等待，否则优先保持 loader 同步、纯、可缓存。

## 把 Loader 和 Plugin 当成产品级 API 来设计

说到这个，我一直觉得在大型项目里，webpack 的扩展就应该被当成内部平台能力来对待。

所以呢，你要像做产品一样做约束。

loader 的输入输出必须可解释、可缓存、可测试。一旦它依赖外部状态，你等于在构建链路里埋了随机数。plugin 必须在生命周期上站得住脚，明确阶段、明确与其他插件的交互方式、明确它修改的对象是 assets 还是 chunks 还是 moduleGraph。loader 和 plugin 的协作必须通过显式契约完成，优先使用 compilation 作为上下文，必要时产出中间资产让依赖关系显式化。

说真的，当你用这个标准去设计扩展的时候，团队会明显感受到两个变化。构建问题更容易定位了，因为每个东西的职责边界是清晰的。升级更容易推进了，因为你的扩展不是到处耦合的。

反过来呢，如果你把 loader 和 plugin 当成"能塞逻辑的地方"，你最终会得到一个只有少数人敢动的脆弱系统。

其实写构建工具的扩展跟写业务代码没什么区别，好的架构都是让每个模块只做一件事，做好一件事，然后通过清晰的接口协作。loader 和 plugin 的边界就是这么回事，它不是一个规范问题，是一个你愿不愿意为未来的自己减少痛苦的选择。

你现在回过头看看自己项目里的 webpack 配置，有没有混着写的地方？
