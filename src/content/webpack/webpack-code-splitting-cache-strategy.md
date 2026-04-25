---
slug: webpack-code-splitting-cache-strategy
title: 代码分割不是越碎越好：Chunk、缓存与部署稳定性
summary: 代码分割的本质是对模块图做分区以控制“下载、解析、缓存失效与故障域”。本文用成本函数视角讲清 chunk 颗粒度的取舍、splitChunks 的真实目标，以及如何把缓存策略与部署稳定性绑成一个可治理的系统。
date: 2026-03-24
tags: [webpack, 代码分割, chunk, 缓存, 部署稳定性]
category: webpack
visualScene: module-graph
cover: /blog.png
series: webpack-systems-architecture
seriesTitle: Webpack 系统设计：模块图到运行时
seriesOrder: 4
draft: false
---

代码分割（code splitting）是前端工程里最容易被“口号化”的能力之一：按路由分包、按组件分包、把 vendor 抽出来、把公共包拆出来。你可以很快把配置写出来，也能很快在构建产物里看到更多的文件，但这并不等于你获得了更快的用户体验、更稳的发布系统、更可控的缓存命中。

我想把话说得更直接一点：**代码分割不是越碎越好，甚至“碎”本身不是目标。目标是控制成本函数。**

这个成本函数至少包含四类成本：

1. **网络成本**：下载体积、请求数、并发/队头阻塞、CDN 命中。
2. **CPU 成本**：解析、编译（JIT）、执行，以及初始化时序。
3. **缓存成本**：命中率、失效半径、hash 级联、版本不一致导致的加载失败。
4. **稳定性成本**：部署过程的一致性、灰度/回滚的可行性、错误定位与追溯成本。

如果你的团队只看第一类成本（“首屏下载多少 KB”），你很可能会做出对稳定性最不友好的切分：chunk 数量爆炸、hash 易级联、上线时更容易出现 chunk load error、回滚变得困难。本文要做的，就是把这些成本放到同一张桌子上，让你能用系统视角做取舍。

## 把 chunk 当成“发布与缓存单元”，而不是“文件切片”

很多人把 chunk 理解为“文件”，把代码分割理解为“把文件切小”。这会导致一种常见的错误：把 chunk 的数量当作优化方向，把“更细”当作成功信号。

更准确的理解是：**chunk 是一个发布单元与缓存单元**。它背后对应的是一组模块的集合（模块图的一个分区），以及由运行时加载/装配的边界。它的价值不是“更小”，而是：

- 让“必须同时出现”的模块在同一个 chunk（减少额外请求与时序复杂度）。
- 让“变化频率不同”的模块分离（减少缓存失效半径）。
- 让“共享程度高”的模块可复用（减少重复下载与重复解析）。
- 让“故障域”可控（某个 chunk 失败不会拖垮全站，或至少可诊断可回滚）。

这也是为什么我会强调“发布与缓存单元”：你不是在切文件，你是在设计系统的变更传播路径。

## 分割的根：模块图分区 + 运行时装配

Webpack 里的代码分割，本质是对模块图做划分并生成 chunk 图。你最终看到的文件，是这种划分的结果。你需要记住一个非常关键的事实：

**分割的收益来自“边界的意义”，分割的代价来自“边界的数量”。**

边界的意义，通常来自两类差异：

1. **生命周期差异**：哪些模块只在某些路由/功能被用到？哪些必须首屏就有？
2. **变更频率差异**：哪些模块几乎不变（框架、基础库）？哪些天天变（业务、活动页）？

边界的数量会引入这些代价：

- 更多的请求与调度（哪怕 HTTP/2 也不是“无限免费”）。
- 更多的 runtime bookkeeping（chunk 映射、加载队列、错误处理）。
- 更复杂的部署一致性问题（HTML/manifest 与 chunk 版本错配更常见）。
- 更难的诊断与回归（哪个 chunk 变大？谁引入了重复？谁导致 hash 级联？）。

所以你不能用“分割=收益”这种线性模型来做决策。你需要在“边界意义”和“边界数量”之间找到稳定的平衡点。

## 缓存策略的核心：控制“失效半径”与“hash 级联”

缓存策略里最重要的不是“我用了 contenthash”，而是“我能否控制一次变更会让哪些资源失效”。在 Webpack 场景中，hash 级联的常见触发器包括：

- 模块/chunk id 不稳定导致的重排。
- runtime 被嵌入到多个 entry 中导致的重复与联动变化。
- vendor 与业务混在一起导致的“业务一改，vendor 也变”。
- splitChunks 规则不稳定（例如按体积阈值边界频繁跳变）。

一个更可控的基础配置通常长这样（重点是意图，而不是具体值）：

```js
// webpack.config.js 片段：让 hash 级联可控，降低缓存失效率
module.exports = {
  output: {
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    // publicPath 必须与部署策略一致（CDN/灰度/多环境）
    publicPath: '/assets/',
  },
  optimization: {
    // 把运行时抽出来，避免每个 entry 都携带一份 runtime
    runtimeChunk: 'single',
    // 尽量稳定 id，减少“模块位置变了 -> id 全重排 -> hash 全变”
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  }
}
```

这不是“性能优化秘籍”，而是“稳定性设计”：让你的缓存系统在持续迭代下仍可预期。

缓存层面我建议你明确一套分层模型，而不是只用“vendor”这个粗粒度概念：

- **基础层**：框架与基础设施（react/react-dom、runtime、polyfill、核心工具）。
- **生态层**：变化较慢但会升级的库（UI、状态、可视化）。
- **业务共享层**：项目内稳定的共享模块（设计系统、业务组件库、公共逻辑）。
- **业务层**：路由/功能/页面本身。

分层的价值是：你能把“变化频率”作为第一维度，把“共享程度”作为第二维度，来定义 chunk 边界。这样你的缓存失效更接近“应该失效的部分失效”，而不是“什么都失效”。

## splitChunks 的真实目标：减少重复与控制共享，而不是制造更多文件

splitChunks 常被误用成“拆得更细”的开关。正确理解是：它是一套**共享策略**，目标是控制：

- 哪些模块被提取为共享 chunk（避免被多个入口重复打包）。
- 共享 chunk 的命名与稳定性（避免边界抖动导致缓存失效）。
- 在性能与稳定性之间做权衡（并不是共享越多越好）。

一个更接近工程实践的 splitChunks 配置，通常会显式表达“分层”，而不是只写默认配置：

```js
// webpack.config.js 片段：用 cacheGroups 表达“层”
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      // 避免在小改动下频繁触发边界重算（导致 chunk 变来变去）
      minSize: 30 * 1024,
      maxAsyncRequests: 20,
      maxInitialRequests: 20,
      cacheGroups: {
        // 框架层：尽量稳定
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'framework',
          priority: 40,
          enforce: true,
        },
        // 生态层：UI/工具等，按你项目实际拆分
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: 'libs',
          priority: 20,
          reuseExistingChunk: true,
        },
        // 业务共享层：你自己的稳定公共模块
        commons: {
          test: /[\\/]src[\\/]shared[\\/]/,
          name: 'commons',
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
```

这里的核心不是“framework/libs/commons 这几个名字”，而是三条工程原则：

1. **分层优先**：不要把所有 node_modules 统统塞到一个 vendor，因为它的变更频率与共享模式并不一致。
2. **稳定优先**：对关键层（framework）用 `enforce`/高优先级保证边界稳定，避免边界抖动。
3. **共享有界**：共享不是越多越好，过度共享会增加初始化时必须下载的东西，反而拖慢首屏。

## 部署稳定性：把“构建产物”与“发布动作”当成一个系统

很多团队把代码分割只当作构建问题，但线上事故往往发生在部署系统：HTML 指向的 chunk 与 CDN 上实际存在的 chunk 不一致，导致动态加载失败。你可能见过报错：

- `Loading chunk xxx failed`
- `ChunkLoadError`
- `Failed to fetch dynamically imported module`（在 ESM dev server/某些构建形态下）

这类问题的根因通常不是“代码写错”，而是“发布不是原子操作”。典型场景：

1. 你发布了新 HTML（或新入口 JS），它引用了新版本 chunk。
2. CDN/静态站点的 chunk 还没完全同步，或旧版本 chunk 被清理。
3. 用户拿到新 HTML，但请求到的是旧 chunk 目录或不存在的 chunk，加载失败。

所以部署稳定性是缓存策略的一部分：你必须保证“引用关系”的一致性。工程上常见的做法是：

- **版本化目录**：每次构建产物输出到 `/assets/<buildId>/...`，HTML 只引用这次 buildId 下的资源。
- **原子切换**：HTML 的发布与资源目录的可用性要么同时生效，要么都不生效。
- **旧版本保留窗口**：允许旧 buildId 资源保留一段时间，覆盖长尾用户与回滚窗口。

用伪配置表达这种策略：

```js
// 构建侧：把所有资源输出到带 buildId 的目录
module.exports = {
  output: {
    publicPath: `/assets/${process.env.BUILD_ID}/`,
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
  }
}
```

```nginx
# 部署侧（示意）：对带 hash 的静态资源使用长期缓存，对 HTML 使用短缓存或不缓存
location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
location / {
  add_header Cache-Control "no-cache";
}
```

注意：这不是“必须这样做”，而是告诉你：**部署稳定性必须与代码分割一起设计**。否则你拆得越细，线上不一致的概率越高。

## 如何衡量“拆得好”：可观测性与回归基线

代码分割的复杂度在于：它会随着业务增长、依赖升级、团队协作不断变化。你需要一套可观测体系，避免“悄悄变坏”。我建议至少把这些指标纳入回归：

- 初始 chunk 集的总下载体积（gzip/brotli 与原始体积都要看）。
- 初始 chunk 集的数量与并发请求峰值。
- framework/libs/commons/business 各层的体积与变更频率（谁在变大，为什么）。
- 同一模块是否被重复打进多个 chunk（重复体积）。
- contenthash 级联程度（改一行业务，哪些 chunk 受影响）。

在工程里，你需要的是“边界可解释性”，而不是“某一次构建看起来不错”。可解释性通常来自：

- 命名清晰的 cacheGroups（分层可见）。
- 统计输出（stats）以及固定的预算（budgets）。
- 对关键入口建立性能基线（比如首屏 TTI、加载瀑布图）。

## 常见误区/反模式：把“拆分”当成银弹

### 反模式 1：无差别动态 import，导致 chunk 数量爆炸

把每个组件都 dynamic import，会让请求数与调度成本快速上升。更糟的是，边界过细会让“共享抽取”变得更复杂，最终你会得到大量小 chunk，网络和 CPU 都不友好。正确做法是：只把生命周期差异显著的模块拆出去（路由级、重型依赖、低频功能）。

### 反模式 2：splitChunks 边界抖动，导致缓存失效半径变大

常见触发器是过于激进的阈值与默认组：模块体积稍有变化，chunk 归属就改变，导致多个 chunk 的 hash 同时变化。你会误以为“contenthash 不稳定”，实际上是“边界不稳定”。用分层的 cacheGroups、提高稳定层优先级，能显著降低抖动。

### 反模式 3：把所有依赖塞进一个 vendor，掩盖真实变化频率

一个大 vendor 看起来“缓存友好”，但它会把变化频率差异巨大的依赖混在一起。一次 UI 库升级可能导致 vendor 大改，造成全站缓存失效。分层拆分才能把失效控制在“应该失效的层”。

### 反模式 4：忽略部署一致性，导致 chunk load error 成为常态

当你做了大量异步 chunk，而部署不具备原子性，线上事故只是时间问题。拆分越多，引用关系越多，不一致的概率越高。先把发布模型想清楚，再谈分割收益。

## 我的判断：把代码分割当作“长期治理”，而不是一次性优化

我对代码分割的判断是：它更像一项治理能力，而不是一次性性能优化。真正可持续的策略通常具备三个特征：

1. **以模块图为依据**：边界来源于生命周期与变更频率差异，而不是“大家都这么拆”。
2. **以缓存与部署为约束**：稳定性优先于极限性能，能回滚、可诊断、可预测，比“某次首屏少 20KB”更值钱。
3. **以可观测为抓手**：用统计与预算把边界固定下来，让系统在团队规模增长时仍然可控。

当你把 chunk 当成发布/缓存单元，把 splitChunks 当成共享策略，把部署当成引用一致性系统，你会发现：代码分割不再是玄学配置，而是一套可以持续迭代的工程设计。 
