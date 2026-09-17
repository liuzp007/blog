---
title: Webpack 模块打包器
slug: webpack-module-bundler
category: Webpack
tags: [Webpack]
summary: 现代前端工程的基石
date: 2026-04-26
---

## 概述

Webpack 是一个现代 JavaScript 应用程序的静态模块打包器（bundler）。它将项目中的所有资源（JavaScript、CSS、图片等）视为模块，并根据依赖关系图进行打包。

核心概念：

- **Entry（入口）**：指示 Webpack 从哪个模块开始构建依赖图
- **Output（输出）**：告诉 Webpack 在哪里输出打包后的 bundle
- **Loader（加载器）**：让 Webpack 能够处理非 JavaScript 文件（如 TypeScript、SASS）
- **Plugin（插件）**：用于执行范围更广的任务，如打包优化、环境变量注入等

Webpack 的优势：

- 代码拆分：实现按需加载，优化首屏加载速度
- 模块化：支持 ES Modules、CommonJS、AMD 等模块格式
- 资源处理：统一处理各种类型的资源文件
- 优化功能：代码压缩、Tree Shaking、Source Map 等

## 基本配置

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

## 核心工作流程

1. 从入口文件开始，递归解析所有 `import` / `require`
2. 构建依赖关系图（Dependency Graph）
3. 使用 Loader 转换各种非 JS 资源
4. 通过 Plugin 进行优化和生成最终文件
5. 输出到 Output 指定的目录

## 常用 Loader

| Loader | 用途 |
| --- | --- |
| `babel-loader` | 转换 ES6+ 代码 |
| `css-loader / style-loader` | 处理 CSS 文件 |
| `file-loader / url-loader` | 处理图片、字体等文件 |
| `ts-loader` | 处理 TypeScript 文件 |

## 性能优化技巧

- **代码分割**：使用 `splitChunks` 提取公共代码
- **懒加载**：使用 `import()` 动态导入
- **Tree Shaking**：移除未使用的代码（使用 ES Module）
- **压缩**：使用 TerserPlugin 压缩代码
- **缓存**：使用 `contenthash` 文件名优化缓存

## Vite vs Webpack

| 特性 | Webpack | Vite |
| --- | --- | --- |
| 开发服务器启动 | 较慢 | 极快（使用 esbuild） |
| 热更新速度 | 一般 | 即时（原生 ESM） |
| 配置复杂度 | 复杂 | 简单（约定大于配置） |
| 生态成熟度 | 非常成熟 | 快速发展中 |

## 现代替代方案

随着工具链的发展，Webpack 之外的打包工具也在兴起：

- Vite：更快的开发服务器，使用原生 ESM
- esbuild：使用 Go 编写，打包速度极快
- Rollup：专注于库的打包，输出更小
- Turbopack：基于 Rust，由 Webpack 团队开发
