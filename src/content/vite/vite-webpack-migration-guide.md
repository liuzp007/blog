---
slug: vite-webpack-migration-guide
title: 从 Webpack 迁移到 Vite：我踩过的坑和学到的策略
summary: 把一个三年 Webpack 项目迁移到 Vite，不是改个配置文件那么简单。环境变量、代码分割、插件生态、构建产物对齐，每一步都可能卡住。这篇文章记录了我迁移的真实过程，包括哪些事值得提前做，哪些坑可以绕开，以及迁移完之后的收益到底有多大。
date: 2026-06-12
tags: [vite, webpack, 迁移, 工程化]
category: vite
visualScene: vite-flow
cover: /blog.png
featured: false
series: vite-deep-dive
seriesTitle: Vite 深度实践：构建、优化与部署
seriesOrder: 2
draft: false
---

去年我们团队决定把主力项目从 Webpack 迁移到 Vite。做这个决定的时候大家都很兴奋，觉得终于不用再等三分钟的热更新了。结果真正动起手来，才发现迁移这事儿远没有想象中那么丝滑。

项目跑了三年，Webpack 配置文件加起来快八百行，自定义 plugin 五个，loader 串联了一长串。搬家的第一周基本上就是在踩坑和填坑之间反复横跳。这篇文章把我整个过程的经验整理出来，希望能帮到正在做同样事情的同学。

## 迁移前的审计清单

坦率的讲，我犯的第一个错误就是上来就改配置。搞了半天发现一堆隐性依赖根本没梳理清楚，改到一半又退回去重头来。

正确的做法是先花一天时间做审计。我自己的感受是，审计做得越细，后面迁移越顺畅。需要重点摸底的内容包括这些。

第一，梳理所有 Webpack plugin 和 loader 的用途。项目里用了哪些 loader，每个 loader 做了什么事，有没有可以用 Vite 原生能力替代的。比如 `babel-loader` 在 Vite 里就不需要了，因为 Vite 默认用 esbuild 做 TypeScript 和 JSX 转换。

第二，清点 `require()` 和 `module.exports` 的使用情况。Vite 的开发模式基于原生 ESM，CommonJS 语法需要全部替换。我当时的做法是跑了一遍脚本扫描。

```bash
# 扫描项目中的 CommonJS 语法使用
grep -rn "require(" src/ --include="*.ts" --include="*.tsx" --include="*.js" > cjs-usage.log
grep -rn "module.exports" src/ --include="*.ts" --include="*.tsx" --include="*.js" >> cjs-usage.log
wc -l cjs-usage.log
```

第三，检查 `process.env` 的使用。Vite 用的是 `import.meta.env`，所有环境变量的访问方式都要改。还有 `.env` 文件的命名规则也不一样，Webpack 时代很多团队直接用 `dotenv-webpack` 随意命名，Vite 对 `.env` 文件有严格的加载优先级。

第四，摸清 `webpack.config.js` 里所有的 alias 和路径解析规则。这个如果漏了，迁移后一堆模块找不到。

## 环境变量迁移

这块需要注意一下，环境变量是迁移过程中最容易出问题的地方之一。

Webpack 项目里通常这么用环境变量。

```javascript
// Webpack 时代的写法
const apiUrl = process.env.REACT_APP_API_URL
const isDev = process.env.NODE_ENV === 'development'
```

Vite 里要改成这样。

```javascript
// Vite 时代的写法
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV
```

有几个要点。

首先，Vite 内置的环境变量前缀是 `VITE_`，不是 Webpack 社区常见的 `REACT_APP_` 之类。如果你之前的变量叫 `REACT_APP_API_URL`，要么改名叫 `VITE_API_URL`，要么在 `vite.config.ts` 里用 `envPrefix` 配置自定义前缀。

```javascript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  envPrefix: ['VITE_', 'REACT_APP_']
})
```

其次，`.env` 文件的加载顺序在 Vite 里是有明确规范的。`.env` → `.env.local` → `.env.[mode]` → `.env.[mode].local`，后面的文件会覆盖前面的同名变量。这个和 Webpack 需要自己用 `dotenv-webpack` 插件来管理的行为不同。

说真的，我们项目当时有二十多个环境变量散落在四个 `.env` 文件里，光是对齐变量名和检查哪些被用到就花了小半天。

## CommonJS 到 ESM 的迁移

这一步是体力活，但没法跳过。Vite 开发服务器基于浏览器原生 ESM，`require()` 调用在开发阶段直接报错。

最常见需要处理的几种情况。

```javascript
// 动态 require 要改成动态 import
// 旧写法
const module = require(`./locales/${lang}.json`)

// 新写法
const module = await import(`./locales/${lang}.json`)
```

```javascript
// module.exports 要改成 export default
// 旧写法
module.exports = { theme: 'dark' }

// 新写法
export default { theme: 'dark' }
```

```javascript
// require.context 是 Webpack 特有 API，Vite 用 import.meta.glob 替代
// 旧写法
const modules = require.context('./modules', false, /\.ts$/)

// 新写法
const modules = import.meta.glob('./modules/*.ts', { eager: true })
```

我自己的感受是，`require.context` 到 `import.meta.glob` 的替换是最容易踩坑的。两者的返回值结构不一样。`require.context` 返回的是一个 webpack `ContextModule`，有 `keys()` 方法。而 `import.meta.glob` 返回的是一个对象，键是文件路径，值是动态 import 函数。如果你之前代码里大量依赖了 `keys()` 来遍历模块，这里需要重写遍历逻辑。

```javascript
// require.context 的遍历方式
const ctx = require.context('./modules', false, /\.ts$/)
ctx.keys().forEach(key => {
  const mod = ctx(key)
  // 处理模块
})

// import.meta.glob 的遍历方式
const modules = import.meta.glob('./modules/*.ts', { eager: true })
for (const path in modules) {
  const mod = modules[path]
  // 处理模块，注意 eager 模式下 mod 是模块对象不是函数
}
```

## Loader 和 Plugin 的映射关系

Webpack 的 loader 链是它的核心概念，Vite 用插件体系替代了这套东西。说真的，映射关系大部分都很直观，但有几个需要特别注意。

| Webpack Loader / Plugin       | Vite 替代方案             |
| ----------------------------- | ------------------------- |
| `babel-loader`                | 内置 esbuild，无需配置    |
| `css-loader` + `style-loader` | 内置支持，直接 import     |
| `sass-loader`                 | `sass` 包 + 内置支持      |
| `postcss-loader`              | 内置 PostCSS 支持         |
| `file-loader` / `url-loader`  | 内置静态资源处理          |
| `mini-css-extract-plugin`     | 内置 CSS 代码分割         |
| `html-webpack-plugin`         | 内置 HTML 处理            |
| `DefinePlugin`                | `define` 配置项           |
| `copy-webpack-plugin`         | `vite-plugin-static-copy` |
| `compression-webpack-plugin`  | `vite-plugin-compression` |

重点说两个。

`DefinePlugin` 到 `define` 的迁移需要小心。Webpack 的 `DefinePlugin` 是做字符串替换，Vite 的 `define` 也是字符串替换，但语法略有差异。

```javascript
// Webpack
new webpack.DefinePlugin({
  'process.env.VERSION': JSON.stringify('1.0.0'),
  __DEV__: JSON.stringify(true)
})

// Vite
export default defineConfig({
  define: {
    'process.env.VERSION': JSON.stringify('1.0.0'),
    __DEV__: JSON.stringify(true)
  }
})
```

看起来几乎一样对吧。但有一个坑。如果你在 Webpack 时代定义了 `process.env.XXX`，迁移到 Vite 后生产构建可能没问题，但开发模式下 Vite 不会注入 `process` 对象。所以要么继续在 `define` 里逐个定义用到的 `process.env.XXX`，要么全局引入一个 `process` polyfill。我个人推荐前者，因为更精确。

## 代码分割的差异

Webpack 用 `webpackChunkName` 魔法注释来做代码分割和命名。

```javascript
// Webpack 写法
const Dashboard = lazy(
  () =>
    import(
      /* webpackChunkName: "dashboard" */
      './pages/Dashboard'
    )
)
```

Vite 开发模式下基于原生 ESM，生产构建用 Rollup。Rollup 不认 `webpackChunkName`，但会自动根据文件路径生成 chunk 名。

```javascript
// Vite 写法，直接动态 import 就行
const Dashboard = lazy(() => import('./pages/Dashboard'))
```

坦率的讲，如果你的代码分割逻辑比较简单，直接去掉魔法注释就好。但如果你有复杂的分包策略，比如要把某些模块强制打包到特定的 chunk 里，就需要用 Vite 的 `build.rollupOptions.output.manualChunks` 配置。

```javascript
// vite.config.ts 中的分包策略
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd'],
          three: ['three']
        }
      }
    }
  }
})
```

这块需要注意一下，`manualChunks` 配得太细会导致碎文件太多，配置得太粗又起不到分割效果。我自己的经验是按三个维度来分。第一，稳定的大型框架库单独一个 chunk（React 全家桶）。第二，大的业务模块按功能域分（比如编辑器、可视化、表单）。第三，变动频繁的业务代码保持默认行为，让 Rollup 自己决定。

## 路径别名和模块解析

Webpack 的 `resolve.alias` 和 Vite 的 `resolve.alias` 语法基本一致，这是迁移过程中最省心的部分之一。

```javascript
// Webpack
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
  },
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
}

// Vite
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
});
```

但有一个细节容易忽略。如果你同时在用 TypeScript，`tsconfig.json` 里的 `paths` 配置也要同步更新，否则编辑器里类型提示会找不到模块。

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

还有一点，Vite 对路径大小写是敏感的。我们项目里有个模块在 macOS 上跑得好好的，部署到 Linux 后直接报找不到模块。就是因为代码里写的 `@/components/toc`，但实际目录名是 `@/components/TOC`。macOS 文件系统不区分大小写所以本地没问题，Linux 上就炸了。这个和 Vite 无关，但迁移时暴露了这个问题。

## 那些让人头疼的 CommonJS 依赖

很多 npm 包只提供 CommonJS 格式。Vite 在开发模式下会做预构建（pre-bundle），用 esbuild 把这些包转换成 ESM。大部分情况这个转换是无缝的，但偶尔会出问题。

```javascript
// 比如你用了一个只有 CJS 格式的包
import lodash from 'lodash' // esbuild 会自动转换，一般没问题
```

但有些包的导出结构比较奇葩，比如混用 `exports` 和 `module.exports`，或者用 `Object.defineProperty` 做了奇怪的属性定义。遇到这种情况，esbuild 的预构建可能转换失败。

解决办法是在 `vite.config.ts` 里手动配置 `optimizeDeps`。

```javascript
export default defineConfig({
  optimizeDeps: {
    include: ['problematic-package-a', 'problematic-package-b']
  }
})
```

如果预构建实在搞不定某个包，可以用 `vite-plugin-commonjs` 这个插件兜底，或者考虑换一个提供了 ESM 格式的替代库。

## CSS Modules 和静态资源

CSS Modules 在 Vite 里的用法和 Webpack 略有不同。Webpack 需要在 loader 配置里开启 `modules: true`，Vite 是通过文件命名约定来识别的。

```
// Vite 中使用 CSS Modules 的命名规则
Button.module.css     // ✅ 会被当作 CSS Modules 处理
Button.module.scss    // ✅ 同上
Button.css            // ❌ 普通 CSS，不是 CSS Modules
```

使用方式一样。

```javascript
import styles from './Button.module.css'

function Button() {
  return <button className={styles.primary}>Click</button>
}
```

静态资源的处理也有变化。Webpack 用 `file-loader` 或 `url-loader`，Vite 内置处理。

```javascript
// Webpack 可能需要配置 loader
import logoUrl from './logo.png' // 需要 file-loader

// Vite 直接用
import logoUrl from './logo.png' // 内置支持，返回 URL 字符串
```

如果你需要获取静态资源的公开路径，Vite 提供了 `import.meta.env.BASE_URL`，对应 Webpack 的 `__webpack_public_path__` 或 `process.env.PUBLIC_URL`。

## 构建产物对齐

迁移完成后最重要的一件事是验证构建产物和之前一致。我当时的做法是跑了两个构建，然后对比输出。

```bash
# 旧构建（Webpack）
npx webpack --mode production

# 新构建（Vite）
npx vite build

# 对比产物结构
diff -rq build-webpack/ build-vite/
```

重点关注这几个维度。

JS chunk 的数量和大小是否合理。如果有某个 chunk 突然变得特别大，可能是分包策略需要调整。

CSS 是否都正确提取了。Vite 默认会把 CSS 提取到单独文件，如果你之前依赖了 `style-loader` 在运行时注入 CSS，需要确认页面加载顺序不会导致闪烁。

静态资源是否都正确复制了。之前用 `copy-webpack-plugin` 复制的文件，需要确认在 Vite 里用 `public` 目录或者 `vite-plugin-static-copy` 覆盖了。

## 性能对比

说真的，迁移完之后的性能提升是肉眼可见的。以下是我们项目的真实数据。

开发服务器启动时间。Webpack 大约 35 秒，Vite 大约 1.2 秒。差距将近三十倍，这个体感非常明显。

热更新速度。Webpack 改一个组件文件大约 3 到 5 秒才能看到变化，Vite 基本是毫秒级，保存即刷新。项目越大这个差距越夸张，因为 Vite 不需要重新打包整个模块图。

生产构建时间。Webpack 大约 45 秒，Vite 大约 18 秒。快了两倍多，但差距没有开发阶段那么悬殊。这是因为生产构建用的是 Rollup，做了完整的 tree-shaking 和代码压缩。

产物体积。基本持平，某些场景下 Rollup 的 tree-shaking 比 Webpack 更激进一点，产物会略小。但这个差距通常在百分之五以内，不会是迁移的主要收益。

坦率的讲，迁移最大的收益就是开发体验的提升。等待时间从分钟级降到秒级甚至毫秒级，对开发效率的提升是实打实的。至于构建速度和产物体积，有改善但不是决定性的。

## 最后几点建议

第一，不要试图一次性迁移完所有东西。我们的策略是先建一个最小的 Vite 配置让项目跑起来，然后逐步对齐细节。先把开发环境跑通，确认核心功能正常，再处理构建产物的差异。

第二，保留旧的 Webpack 配置一段时间。我们并行维护了两套构建大约三周，确认 Vite 构建在生产环境没有问题后才移除了 Webpack 配置。这期间 CI 跑两套构建，虽然慢一点但安全。

第三，迁移过程中顺手做了几件事让项目更健康。清除了不再使用的依赖和配置，统一了代码风格（全部改为 ESM），规范化了环境变量的管理。这些改动不是迁移必需的，但既然动了就顺手做了，算是一种投资。

第四，团队需要适应 Vite 的一些心智模型变化。比如 Vite 的预构建机制，第一次启动时会慢一些因为要预构建依赖，之后会缓存起来。如果依赖变了需要清缓存重启，用 `--force` 参数就行。还有 Vite 的插件系统虽然兼容大部分 Rollup 插件，但开发模式和生产模式的处理管线不完全一样，有些问题只在生产构建时出现。

```bash
# 清除预构建缓存并重启
npx vite --force

# 或者手动删除缓存
rm -rf node_modules/.vite
```

迁移不是目的，更好的开发体验才是。如果当前 Webpack 配置已经够用，项目也不大，没必要为了迁移而迁移。但当项目膨胀到每次热更新都要等好几秒的时候，你就会发现 Vite 带来的时间节省是值得这份迁移工作量的。
