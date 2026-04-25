---
slug: webpack-loader-plugin-boundary
title: Loader 与 Plugin 的边界：Webpack 可扩展架构的深层规律
summary: Loader 与 Plugin 的区别不是“一个处理文件，一个做别的”，而是职责边界：Loader 更像可缓存的纯函数变换，Plugin 则是编译生命周期的调度器。理解边界，才能写出稳定、可诊断、可迁移的工程扩展。
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

在工程里，Loader/Plugin 的边界是一个“越晚理解越吃亏”的知识点。很多团队会在一开始用“经验法则”混着写：loader 里做网络请求、plugin 里改源码 AST、两边互相调用一堆隐式状态。短期可以跑，长期会把构建系统变成一个不可诊断的黑箱：慢、脆、升级难、缓存无效、故障定位成本极高。

本文的目标很明确：给出一个能支撑大型项目的判断标准，帮助你回答三个问题：

1. 这件事应该写成 Loader 还是 Plugin？
2. 如果必须两者协作，边界如何画，状态如何传？
3. 如何避免“看似方便、实际不可维护”的反模式？

## 先把话说重：边界不是规范，是成本函数

Loader/Plugin 的边界不是“语义正确性”的问题，而是成本问题：

- **缓存成本**：loader 设计得越纯、输入越明确，越容易被缓存；plugin 一旦掺杂不确定性，会让整个 compilation 的缓存收益骤降。
- **诊断成本**：plugin 决定生命周期，出问题时你需要知道它在何时修改了什么；loader 决定单模块变换，出问题时你需要知道它对某个资源做了什么。
- **升级成本**：Webpack 的核心 API 变化主要集中在 compiler/compilation hook 与模块工厂；如果你把逻辑乱塞，升级会变成“牵一发而动全身”。

所以我建议你把边界当成“工程的稳定接口”，而不是写法偏好。

## Loader 的本质：可缓存的、面向单模块的变换管线

Loader 最接近的心智模型是：**(source, map, meta) -> transformedSource**。它是围绕“单个模块”进行的变换，且天然处于模块解析的早期阶段（NormalModuleFactory -> run loaders）。

Loader 的好处不在“能写 JS”，而在：

- 输入明确：资源路径 + 源码字符串 + 上游 loader 产物。
- 输出明确：下一步要交给 parser/生成阶段的代码字符串与 source map。
- 缓存友好：只要 loader 的输出只依赖输入与 options，就可以稳定缓存。

下面是一个“合格”的 loader 骨架：它明确声明可缓存、只依赖 source 与 options、并对 source map 做透明传递。

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

这个例子很简单，但它体现了 loader 的工程价值：**可缓存、可预测、局部影响**。当你用 loader 做变换时，你是在让“模块图的节点”以可控方式改变形态。

## Plugin 的本质：编译生命周期的编排与全局一致性

Plugin 的心智模型不是“处理某个文件”，而是“在编译的某个时刻做某种全局性决策”。它通过 compiler/compilation hooks 介入整个流程：从 entry、解析、优化、生成到 emit。

Plugin 更适合做这些事情：

- **跨模块的决策**：比如生成一份 manifest、统计依赖、统一注入 runtime 配置、决定 chunk 边界策略。
- **全局一致性控制**：比如约束某类依赖的版本、阻止某些 import 进入产物、在 emit 阶段修改 asset。
- **与基础设施对接**：比如把 build 产物信息写入内部系统（注意：要把 IO 边界做得可控）。

下面是一个“合格”的 plugin 骨架：它不碰 loader 变换细节，而是在 compilation 结束时读取 assets，生成额外资产并注入输出。

```js
// plugins/build-manifest-plugin.js
class BuildManifestPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('BuildManifestPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'BuildManifestPlugin',
          // 选择合适的阶段，避免和其它插件互相踩
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          const manifest = {}
          for (const filename of Object.keys(compilation.assets)) {
            // 这里做的是“资产级”决策，而不是“源码级”变换
            manifest[filename] = { size: compilation.assets[filename].size() }
          }
          const json = JSON.stringify(manifest, null, 2)
          compilation.emitAsset(
            'manifest.json',
            new compiler.webpack.sources.RawSource(json)
          )
        }
      )
    })
  }
}

module.exports = BuildManifestPlugin
```

这个 plugin 的价值点在于：它依赖的是 compilation 的全局产物，而不是某个模块的源码细节。**当你需要“全局一致性”时，plugin 才是正确工具。**

## Loader 与 Plugin 的协作：用“显式契约”替代“隐式共享状态”

大型项目里不可避免会出现 loader 与 plugin 需要协作的场景。例如：

- loader 负责把某种 DSL 编译成 JS，但 plugin 需要收集这些模块的元信息（比如路由表、国际化 key）。
- loader 负责注入某些标记，plugin 负责在 chunk/asset 级别做统一处理。

这时最危险的写法是“隐式共享状态”：loader 把数据塞到全局变量里，plugin 再去读；或者 plugin 在 loader 的 this 上挂临时字段。短期能跑，长期会在 watch/HMR、并发编译、多 compiler 场景下爆炸。

一个更稳的方式是：**通过 compilation 作为“单次编译的上下文”存储数据**。这相当于把状态限定在“这次 compilation”里，生命周期清晰。

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
    hasMagicComment: /webpackChunkName/.test(source),
  })

  return source
}
```

```js
// plugin: 在合适阶段读取 compilation 上的数据并产出资产
class CollectMetaPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('CollectMetaPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'CollectMetaPlugin', stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE },
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

这个方案的要点是：状态归属清晰、watch 下不会跨编译污染、并发编译时不互相踩。

## 关键边界：源码级变换 vs 编译级决策

我建议用一句话做分界：

- **Loader：把“某个模块的输入”变成“某个模块的输出”。**
- **Plugin：把“这次编译的事实”变成“这次编译的决策或资产”。**

你可以用三条检查题来决定：

1. 逻辑是否必须看见多个模块才能成立？如果是，倾向 plugin。
2. 逻辑是否应该被缓存为“输入确定 -> 输出确定”？如果是，倾向 loader。
3. 逻辑是否依赖编译生命周期（阶段/顺序/优化）？如果是，倾向 plugin。

## 常见误区与反模式：把构建系统写成“脚本合集”

### 反模式 1：在 Loader 里做 IO/网络请求

loader 运行在模块解析阶段，属于高频路径：模块越多，调用次数越多。把 IO 放进 loader 会导致：

- watch 变慢，且性能不可预测（网络抖动、磁盘竞争）。
- 缓存收益下降（输出依赖外部状态）。
- 构建可复现性变差（同样输入产出不同）。

如果你必须做 IO，把它放到 plugin，并把 IO 输出转化为“构建输入”或“构建产物”，让依赖关系显式化。

### 反模式 2：在 Plugin 里做源码 AST 变换

不是说绝对不行，而是代价很高：plugin 的源码变换往往发生在更晚阶段，且很容易和其他优化（tree-shaking、minify）互相干扰。更致命的是：你会把“模块级变换”变成“全局变换”，失去可缓存与可定位的优势。

如果变换是“每个模块都要做”，优先考虑 loader；plugin 更适合做“编译层策略”。

### 反模式 3：用全局变量在 Loader 与 Plugin 间传状态

watch、multi-compiler、并行构建下会出诡异问题：数据串台、内存泄漏、热更新后旧状态残留。把状态挂到 compilation 上，或者显式写到 asset 里，是更可靠的工程做法。

### 反模式 4：滥用 `pitch`/`this.async()` 造“可控并发”

loader 的异步并不会天然带来收益，尤其在磁盘/CPU 已经饱和时，只会带来更多不确定性。除非你明确知道你在隐藏什么等待（比如纯计算拆分），否则优先保持 loader 同步、纯、可缓存。

## 我的判断：把 Loader/Plugin 当成“产品级 API”，并为可演进性负责

在大型项目里，我更愿意把 Webpack 扩展视作“内部平台能力”。这意味着你要像做产品一样做约束：

- Loader 的输入/输出必须可解释、可缓存、可测试；一旦它依赖外部状态，你等于在构建链路里埋了随机数。
- Plugin 必须在生命周期上“站得住脚”：明确阶段、明确与其他插件的交互方式、明确它修改的对象（assets、chunks、moduleGraph）。
- Loader 与 Plugin 的协作必须通过显式契约完成：优先使用 compilation 作为上下文，必要时产出中间资产让依赖关系显式化。

当你用这个标准去设计扩展时，团队会明显感受到两个收益：构建问题更容易定位、升级更容易推进。反过来，如果你把 loader/plugin 当成“能塞逻辑的地方”，你最终会得到一个只能靠少数人维护的脆弱系统。 
