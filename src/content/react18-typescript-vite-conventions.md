---
slug: react18-typescript-vite-conventions
title: React 18 + TS + Vite 约定实践
summary: 用最小约定构建稳定的页面与数据层，围绕动态路由、别名与 RTK，给出可直接落地的项目实践清单与代码片段。
date: 2026-03-23
tags:
  - 技术
  - React
  - Vite
visualScene: react-lanes
cover: /blog.png
draft: false
---

开场引言  
本项目以 React 18 + TypeScript + Vite 为核心，强调“约定优于配置”。页面使用 `import.meta.glob` 动态发现、路径统一走 `@` 别名、状态管理采用 RTK，确保功能扩展的同时保持认知、一致与速度。

## 页面与动态路由约定

- 页面目录统一放在 `src/pages/**/index.tsx`。  
- 路由遵循“目录名即路由段”原则，详情页通过参数/查询串承载。  
- 借助 Vite 的 `import.meta.glob` 实现页面的构建期发现与懒加载。

```ts
// src/router/autoPages.ts
export const modules = import.meta.glob('@/pages/**/index.{tsx,jsx}', { eager: false });
```

## 路径别名与统一导入

- 以 `@` 指向 `src`，并补充 `@store`、`@router`、`@page`。  
- 保持导入顺序：React → 三方 → 本地 → 样式，减少 diff 噪音。

```ts
// vite.config.js 片段
resolve: {
  alias: {
    '@': '/src',
    '@store': '/src/store',
    '@router': '/src/router',
    '@page': '/src/pages',
    'moment': 'dayjs'
  }
}
```

## RTK 作为首选状态层

- 避免扩展遗留 Redux OBS，新模块一律进 `src/store/**`。  
- 以切片（slice）收敛状态与异步逻辑，方便局部重用与按需加载。

```ts
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import ui from './slices/ui'
export const store = configureStore({ reducer: { ui } })
export type RootState = ReturnType<typeof store.getState>
```

## 代码片段渲染规范

- 教程类文章使用“字符串代码块”显示，示例若需交互，放入 `src/examples/**` 懒加载。  
- 高亮与复制按钮交由 `CodeBlock/BeautifyCode` 统一处理。

```tsx
// 片段：在文章中嵌入代码块的最小示例
export default function Hello(){ return <div>Hello</div> }
```

## 收尾结语

围绕“页面发现—别名—状态”的三件套，新增页面/模块仅需遵守目录与命名约定即可被系统识别。实践表明，这种约束为后续的标签、搜索与 SEO 等扩展提供了稳定地基。

