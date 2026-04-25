---
slug: webpack-module-graph-runtime
title: Webpack 模块图与运行时：打包器真正组织代码的方式
summary: 很多人把 Webpack 当成“把文件拼起来的工具”，但真正决定性能、可维护性和可演进性的，是模块图与运行时这两层抽象。本文用工程视角解释它们如何塑造 chunk、缓存与部署策略。
date: 2026-03-24
tags: [webpack, 工程化, 模块图, 运行时, 缓存]
category: webpack
visualScene: module-graph
cover: /blog.png
featured: true
series: webpack-systems-architecture
seriesTitle: Webpack 系统设计：模块图到运行时
seriesOrder: 1
draft: false
---

把 Webpack 讲清楚，最有效的切入点不是“有哪些配置项”，而是“它在组织什么”。我会用两个概念把它钉住：

1. **模块图（Module Graph / Chunk Graph）**：编译时的结构化事实，决定“你到底在构建什么”。
2. **运行时（Runtime）**：产物在浏览器/Node 中如何“把代码拉起来”，决定“它到底如何被使用”。

如果你在大型项目里遇到过这些问题：打包后产物难以解释、缓存命中率忽高忽低、代码分割越做越慢、线上报错无法追溯、升级一个依赖导致全站 chunk 失效，那你八成不是“配置没写对”，而是**没有把模块图与运行时当成设计对象**。

## 模块图不是“依赖列表”，而是一组可执行约束

很多人心智里只有“依赖树”：A import B，B import C。这个模型在小项目里够用，但一旦进入工程规模，它会误导你做出错误决策。Webpack 的模块图更接近一套约束系统：

- 节点不仅是源码文件，还可能是 loader 处理后的虚拟模块、拼出来的容器模块、运行时代码片段。
- 边不仅是 import 语句，还可能包含“异步边”（dynamic import）、“弱依赖”（可选加载）、“上下文依赖”（require.context）等。
- 图的用途不是展示关系，而是服务于**分组（chunking）、去重（dedupe）、副作用控制（sideEffects）、可摇树（tree-shaking）与运行时装配**。

工程上你要的不是“把依赖算出来”，而是：

- 哪些模块必须在同一生命周期内共存？
- 哪些模块必须共享状态（单例）？
- 哪些模块可以延迟或按需？
- 哪些模块必须被拆开以降低变更半径（缓存/发布）？

这些都不是“树”能回答的，它们是图上的约束求解。

## 从 Compilation 到 ModuleGraph：Webpack 真正在“编译什么”

Webpack 的编译过程可以粗略拆成几个阶段（忽略细节与分支）：

1. 入口解析：entry -> 初始依赖集合。
2. 模块工厂（NormalModuleFactory）把资源解析成模块对象（可能交给 loader 链处理）。
3. 依赖解析：扫描 AST/依赖描述，持续扩展图。
4. 图收敛：当依赖闭包完成，形成模块图（以及后续的 chunk 图）。
5. 代码生成与资产输出：把图映射为 bundles 与 runtime。

你真正需要把握的是：**模块图是编译时的“事实来源”，不是运行时的“加载路径”。**运行时加载路径是另一个层面（后文说）。

在大型项目中，一个非常实用的工程动作是：把模块图当成“诊断 API”。你可以用插件在 compilation 阶段观察模块图，而不是靠产物猜测。

下面是一个“观察模块图”的最小插件骨架，它的价值不是功能，而是提醒你：Webpack 的本质对象是 compilation/module，而不是文件字符串。

```js
// webpack.config.js 片段
class PrintModuleGraphPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('PrintModuleGraphPlugin', (compilation) => {
      compilation.hooks.finishModules.tap('PrintModuleGraphPlugin', (modules) => {
        let count = 0
        for (const m of modules) {
          // m.resource 是“原始资源路径”，但并不是所有模块都有
          if (m.resource) count++
        }
        compilation.logger.info(`[graph] modules with resource: ${count}`)
      })
    })
  }
}
```

当你开始这样看 Webpack，你会自然地把“为什么 splitChunks 失控”“为什么某个包被重复打进多个 chunk”这类问题从“配置玄学”转化为“图的约束是否符合预期”。

## ChunkGraph：分包不是切文件，而是对图做划分

模块图解决“有哪些模块以及关系”，但仍无法直接回答“最终输出多少个文件”。这时 chunk 图登场：它是模块到 chunk 的映射，以及 chunk 之间的关系（例如异步 chunk 的父子关系）。

你可以把 chunk 图理解为：**对模块图进行分区（partition）并产生边界**。而边界会直接决定：

- 首屏必须下载哪些 chunk（初始 chunk 集）
- 什么时候触发异步加载（runtime 中的 chunk loading）
- 缓存命中与失效的粒度（chunk 的内容hash）
- 是否出现重复打包（同一模块被放进多个 chunk）

如果你只用“按路由分包”作为指导，那是偏产品/体验的逻辑；工程上还需要补一层：**按变更半径与共享关系分包**。一个模块的“共享程度”越高，把它放到更稳定、更靠近基础设施层的 chunk，缓存收益越大；但共享程度高也意味着它的版本/变更会影响更多页面。

因此 chunk 划分不是“越细越快”，而是一个成本函数：下载成本、解析成本、并发请求成本、缓存失效率、运维复杂度、故障域大小。

## 运行时不是“把 bundle 执行一下”，而是系统的装配工

很多团队在讨论 Webpack 时完全忽略运行时，直到线上出现“chunk load error”“主包很小但加载很慢”“升级一个依赖导致所有页面缓存失效”。

这是因为你把运行时误解为“执行入口文件”。实际 Webpack 运行时承担的是：

- 模块缓存（module cache）：同一模块只初始化一次。
- require 实现（__webpack_require__）：模块 ID 到工厂函数映射与调用。
- chunk 加载（JSONP / import()）：按需加载 chunk，并把新模块注册到运行时。
- publicPath 与资产定位：决定 chunk 从哪里被加载（尤其是 CDN、灰度、跨域场景）。
- share scope（Module Federation 场景）：共享模块的解析与版本选择。

最关键的点：**运行时决定了“模块图如何在真实环境里被兑现”。**所以“配置对不对”的终极检验不是 webpack build 输出了文件，而是运行时能否稳定装配。

下面给一个极简的、概念性的 Webpack 运行时模型（伪代码），用来帮助你把问题定位到“模块、chunk、runtime”这三个对象上。

```js
// 概念化的运行时（伪代码），用于理解而非可运行
const __modules__ = {}     // moduleId -> factory(module, exports, require)
const __cache__ = {}       // moduleId -> module.exports

function __webpack_require__(id) {
  if (__cache__[id]) return __cache__[id]
  const module = { exports: {} }
  __cache__[id] = module.exports
  __modules__[id](module, module.exports, __webpack_require__)
  return module.exports
}

// dynamic import: load chunk -> register new factories -> resolve
function __webpack_require__.e(chunkId) {
  return loadScript(publicPath + chunkId + '.js').then(() => {
    // chunk 执行后会把新的 factory 填到 __modules__
  })
}
```

当你能把线上问题翻译成下面这些语句，你基本就摆脱“玄学 webpack”了：

- “这个页面首屏慢，是初始 chunk 集太大，还是 runtime chunk 太重？”
- “这个 chunk load error，是 publicPath 不正确，还是 CDN 缓存与 HTML 版本不一致？”
- “缓存失效，是 module id 不稳定导致的，还是 runtime 变动把所有 contenthash 拖着变了？”

## 模块 ID、chunk ID 与缓存：稳定性来自约束，而不是祈祷

缓存策略里最容易被低估的一点是：**ID 的稳定性**。你可能已经配置了 `contenthash`，但仍发现“改一行业务代码，vendor 全变了”。原因通常不在 hash 算法，而在“内容变化的范围被扩大”，最常见触发器就是 ID 不稳定或 runtime 变动。

工程上你要追求的是：在相同依赖集合、相同编译条件下，尽可能稳定地产生 module/chunk ids。Webpack 近年的默认值已经改进很多，但大型项目里仍建议明确表达意图：

```js
// webpack.config.js 片段
module.exports = {
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    runtimeChunk: 'single',
  },
  output: {
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
  }
}
```

这里的关键不是“照抄配置”，而是理解其后果：

- `runtimeChunk: 'single'` 把 runtime 从各 entry 中抽出来，减少多入口场景下的重复，但也意味着 runtime 变更会影响更多页面（通常是可接受的）。
- deterministic ids 使得“模块位置变化”不必然导致 ID 全面重排，从而避免 hash 级联。

你在设计缓存时，实际上是在设计**变更传播路径**：一次变更应该让哪些资产失效？哪些不该失效？这不是靠默认值祈祷出来的，需要你对模块图与 runtime 都有把握。

## 常见误区：把 Webpack 当成“文件拼接器”会带来系统性坏味道

这一节我会把常见的错误心智模型写清楚，因为它们通常是团队长期痛苦的根源。

### 误区 1：只要分包就一定更快

“更快”是多个瓶颈叠加后的结果：网络、解析、执行、缓存、并发。分包只是在其中某些环节做 tradeoff。如果你不看模块图与 runtime，你无法知道你是在优化哪一个瓶颈，甚至可能把瓶颈从网络转移到解析/调度上。

### 误区 2：运行时是黑盒，不值得管

当你遇到 chunk load error、publicPath、跨域、灰度时，运行时就是第一责任人。忽略它就等于让系统关键路径无人负责。

### 误区 3：把 vendor 当成“永远不变的块”

依赖并不天然稳定，尤其在前端生态：小版本也可能引入依赖树变化。把 vendor 视作永恒稳定，会导致你低估发布风险和缓存失效率。正确做法是：把依赖分层（基础层、框架层、业务共享层），并把变更频率作为分层依据。

## 我的判断：在工程里，把“模块图可解释性”当作第一生产力

我对 Webpack 的核心判断是：**它不是工具链配置题，而是系统建模题**。你要的是一个能解释、能演进、能诊断的构建系统，而不是“把 build 跑通”。

因此我会优先投入在三件事上：

1. **让模块图可观察**：用插件/统计把模块、chunk、共享关系显式化，形成团队共识与回归基线。
2. **让运行时边界清晰**：明确 publicPath、runtimeChunk 策略、chunk loading 模式，避免部署与 CDN 把 runtime 拖入不确定性。
3. **让变更传播可控**：用 deterministic ids、合理的 splitChunks、稳定的共享层划分，把一次改动的影响面限制在“应该影响的地方”。

当你做到这些，“webpack 慢”“缓存差”“分包乱”的问题会变成可量化、可定位、可治理的问题，而不是靠经验拍脑袋的玄学。 
