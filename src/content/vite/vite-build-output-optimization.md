---
slug: vite-build-output-optimization
title: Vite 构建产物优化实战：从「能跑」到「能上线」
summary: Vite 开发体验很爽，但构建产物如果不做优化，首屏体积可能比 Webpack 还大。这篇文章从 chunk 拆分、tree-shaking、动态导入、产物分析四个维度，用可验证的方式讲清楚如何把 Vite 构建产物从「能跑」优化到「能上线」。
date: 2026-06-12
tags: [vite, 构建优化, tree-shaking, code-splitting]
category: vite
visualScene: vite-flow
cover: /blog.png
featured: false
series: vite-deep-dive
seriesTitle: Vite 深度实践：构建、优化与部署
seriesOrder: 1
draft: false
---

我第一次用 Vite 做生产构建的时候，看了一眼产物体积，差点以为自己还在用 Webpack。

那个项目不大，React 加上几个 UI 组件库，代码量撑死两万行。但 build 完一看，主 chunk 有 1.8MB。我当时还特地检查了一下，确认自己没把 source map 打进去。然后我坐在那想，Vite 不是说快吗，怎么产物比之前用 Webpack 还胖。

后来我才慢慢明白一件事。Vite 开发体验好是好的，但它并不是你用了 Vite 就自动获得优化。开发阶段它利用浏览器原生 ESM 做按需加载，速度快得飞起。但生产构建用的是 Rollup，Rollup 给你的是一组合理的默认值，不是帮你做完了所有事。

坦率的讲，构建产物优化这件事，跟你用什么工具关系不大，跟你有没有方法论关系很大。今天我想把这件事从方法到实操完整地聊一遍。

## 先搞清楚你的产物里有什么

很多人一上来就开始调 manualChunks，这个顺序不太对。你应该先知道问题出在哪，再做针对性的拆分。

rollup-plugin-visualizer 是我每个 Vite 项目都会装的第一个分析插件。它会在构建结束后生成一个可视化的产物组成图，用方块的大小直观告诉你每个依赖占了多少体积。

```bash
pnpm add -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

构建完以后浏览器会自动打开一个 Treemap 页面。你一眼就能看到哪些依赖是大块头，哪些是你自己代码里意料之外的大文件。这一步不解决任何问题，但它告诉你该往哪使劲。

我自己的习惯是，每次做完一轮优化就跑一次 build 看 stats.html，记录前后对比。没有数据支撑的优化就是瞎蒙。

## chunk 拆分不是越碎越好

看完产物组成之后，下一步就是 manualChunks 配置。这是 Vite 构建优化里最常被提到的一件事，但也是最容易做错的一件事。

Vite 默认的拆分策略会把所有 node_modules 打进一个 vendor chunk。对于中小项目这够用了，但当你的依赖里有一些很大的库，或者有些页面用到的库其他页面完全用不到的时候，就需要手工干预。

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 把 React 全家桶单独拆出来，几乎每个页面都用到，缓存命中率高
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // 大型工具库按需拆分，不是每个页面都会用到
          if (id.includes('node_modules/lodash-es')) {
            return 'lodash'
          }
          if (id.includes('node_modules/echarts')) {
            return 'echarts'
          }
          // 剩余的 node_modules 走默认 vendor chunk
        }
      }
    }
  }
})
```

但这里有个非常常见的误区。有人觉得 chunk 拆得越碎越好，恨不得每个依赖一个文件。这个想法的出发点是好的，碎片化之后浏览器可以并行下载，缓存粒度也细。

问题是每多一个 chunk 就多一次 HTTP 请求。在 HTTP/2 环境下请求成本确实低了不少，但仍然存在。而且如果拆得太碎，初始化的时候需要加载大量小 chunk，模块之间的引用关系会导致串行等待，反而比一个大 chunk 更慢。

说真的，我自己的经验法则是三条。变化频率不同的东西不要放在一起，比如业务代码和第三方库。体积特别大的库单独拆出来，比如图表库、编辑器。首屏用不到的东西延迟加载，这个后面会专门聊。

按这个思路配 manualChunks，比无脑碎化效果好得多。

## tree-shaking 为什么有时候不生效

tree-shaking 是 Rollup 的强项，也是 Vite 选 Rollup 作为生产打包器的重要原因。但你会遇到一种让人很沮丧的情况，明明只用了某个库的一个函数，打包结果里却出现了整个库的代码。

这事不能赖 Vite，也不能赖 Rollup。tree-shaking 的前提是模块必须是 ESM，且代码里不能有副作用。很多老牌库还在用 CommonJS 发布，或者虽然提供了 ESM 入口但内部混杂了有副作用的顶层代码。

举个例子。你从 lodash-es 里导入了 debounce，打包后只有 debounce 和它依赖的几个工具函数。但你从 lodash（CommonJS 版本）里导入 debounce，整个 lodash 都会被打进去。这就是 ESM 和 CommonJS 在 tree-shaking 上的差别。

那怎么判断一个库能不能被 tree-shake 呢。看它的 package.json。

```json
{
  "name": "some-library",
  "sideEffects": false
}
```

`sideEffects: false` 是一个非常重要的声明。它告诉打包器，这个包里没有被用到的导出可以安全地移除。如果没有这个字段，或者值为 true，打包器就必须保守处理，宁可多打包也不能漏掉可能存在的副作用。

如果你确认某个依赖其实没有副作用但它的 package.json 没声明，你可以在自己的项目配置里补上。

```json
// package.json
{
  "sideEffects": ["*.css", "*.scss", "node_modules/antd/dist/*"]
}
```

对于确实无法被 tree-shake 的库，动态导入是你最后的武器。

```typescript
// 不好的做法：静态导入整个 echarts
import * as echarts from 'echarts'

// 好的做法：只导入需要的组件
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'

use([BarChart, GridComponent])
```

我自己的感受是，tree-shaking 能解决百分之六七十的问题，剩下那些不能被 tree-shake 的库，要么换一个 ESM 原生的替代品，要么用按需导入的方式手动控制。

## 动态导入才是首屏优化的核心

前面聊的都是怎么拆、怎么减，但有一个思路比拆减更根本。那就是让首屏不加载它不需要的东西。

动态导入用 `import()` 实现，Vite 和 Rollup 对它的支持非常好。你会在路由级别和组件级别两个场景大量用到它。

路由级别的动态拆分是最值得投入的地方。用户打开首页的时候，没必要加载关于页、博客详情页、设置页的代码。

```typescript
// router config
const routes = [
  {
    path: '/',
    component: () => import('@/pages/home/index.tsx')
  },
  {
    path: '/about',
    component: () => import('@/pages/aboutme/index.tsx')
  },
  {
    path: '/blog/:id',
    component: () => import('@/pages/blog-detail/index.tsx')
  }
]
```

这行代码的效果是，每个页面会被拆成独立的 chunk，只有用户访问到对应路由时才会下载。配合 React 的 `Suspense` 和 `lazy` 可以做得很优雅。

```typescript
import { lazy, Suspense } from 'react'

const ChartPanel = lazy(() => import('./components/ChartPanel'))
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor'))

function Dashboard() {
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div>
      <Suspense fallback={<div>加载中...</div>}>
        <ChartPanel />
      </Suspense>
      {showEditor && (
        <Suspense fallback={<div>编辑器加载中...</div>}>
          <MarkdownEditor />
        </Suspense>
      )}
    </div>
  )
}
```

注意那个 `showEditor` 的条件渲染。这是动态导入非常推荐的模式，用户点击之后才开始加载编辑器的 chunk，而不是页面一打开就加载一个巨大的编辑器。

说真的，我见过太多项目的首屏性能问题，最后发现不是框架慢，不是网络慢，而是首屏加载了一堆用户根本看不到的东西。图表、编辑器、大表格、富文本组件，这些重型组件全部用静态导入写在入口文件里。改成动态导入之后首屏体积直接砍半，这比什么优化手段都见效快。

## CSS 产物也别忘了

聊构建产物优化的时候大家注意力都在 JS 上，CSS 经常被忽略。但 CSS 体积过大同样影响性能，尤其是首屏渲染。

Vite 默认会做 CSS 代码分割。每个动态导入的 JS chunk 对应的 CSS 会被提取成独立的 CSS 文件。这意味着路由级别的代码分割会自动作用于 CSS。

但有一个坑。如果你在入口文件里全局导入了一个大型 UI 库的样式，比如 `import 'antd/dist/antd.css'`，那这份 CSS 会完整地出现在首屏产物里，即使用户当前页面只用了两个组件。

```typescript
// 不好的做法：全局导入全部样式
import 'antd/dist/antd.css'

// 好的做法（如果 UI 库支持按需加载）
// 配合 vite-plugin-style-import 或者 babel-plugin-import
// 只打包你实际用到的组件样式
```

Vite 默认会开启 CSS 压缩（cssnano），你不需要额外配置。但如果你想更精细地控制，可以在 `cssMinify` 选项里调整策略。

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 默认就是 true，也可以传 'lightningcss' 使用更快的压缩器
    cssMinify: true
  }
})
```

坦率的讲，CSS 优化在大多数项目里不会是瓶颈。但如果你用的是那种把所有组件样式打包在一起的 UI 库，CSS 体积很容易超过 JS。到时候不要惊讶。

## 一组真实的优化数据

我拿之前优化过的一个中型项目做例子。React 加 TypeScript，业务代码大约三万行，用了 antd、echarts、lodash-es、dayjs、monaco-editor 这些依赖。

优化前的 build 产物情况是这样的。主 vendor chunk 有 2.1MB，gzip 后 680KB。首屏加载了所有路由的 JS 和 CSS，包括那个只在管理后台用到的 monaco-editor。First Contentful Paint 在 3G 网络下超过四秒。

做的改动其实不多。按前面说的思路配置了 manualChunks，把 echarts 和 monaco-editor 单独拆出来。所有路由改成动态导入。monaco-editor 用条件渲染加 lazy 延迟到用户真正需要时才加载。确认了 lodash-es 的 sideEffects 字段正确声明。echarts 改为按需导入组件。

优化后的结果是，首屏需要加载的 JS 从 2.1MB 降到 420KB，gzip 后约 130KB。FCP 在 3G 下降到一点五秒左右。monaco-editor 那个 chunk 大约 1.4MB，但只有管理员点击编辑按钮时才会触发下载。

这不是一个极端案例，算是一个比较典型的中型项目优化结果。你会发现核心手段其实就是那几条，拆分、按需、延迟加载。没有黑魔法。

## 回到方法论

做完这些事情之后回头看，构建产物优化其实就四步。先用 visualizer 看清楚产物组成。然后用 manualChunks 做合理的拆分。接着确保 tree-shaking 能覆盖的尽量覆盖，覆盖不了的用动态导入兜底。最后别忘了 CSS 也需要关注。

说真的，这四步做完已经能覆盖百分之九十的场景了。剩下百分之十涉及 preload 策略、HTTP 缓存头、Service Worker 缓存等更细粒度的话题，可以根据实际情况逐步补充。

有一点我想特别强调。优化的每一步都应该有数据验证。优化前跑一次 build 截图 stats.html，优化后再跑一次对比。不要凭感觉说「好像快了」，要用数字说话。

你现在手上的项目，build 完的主 chunk 有多大？

要不要打开 stats.html 看一眼？
