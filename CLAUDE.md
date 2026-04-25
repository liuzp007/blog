# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概况

- 个人博客 / 作品集网站
- React 18 + TypeScript + Vite 5
- React Router DOM v5，根路由使用 **`HashRouter`**（见 `src/App.tsx`）
- 状态管理：Redux Toolkit + redux-persist（`src/store/`）
- UI 库：Ant Design v4 + Tailwind CSS v3
- 3D/动画：Three.js 0.182 + React Three Fiber + GSAP + Framer Motion
- 样式：CSS + Tailwind CSS + 语义 token / `.ui-*` 类（SCSS 已迁移完成并移除）
- 类组件（App.tsx 等遗留）与函数组件混合，新代码优先函数组件 + Hooks

## 开发命令

```bash
pnpm dev          # 启动开发服务器（127.0.0.1:8081）
pnpm build        # 生产构建（输出到 build/）
pnpm preview      # 预览构建产物
pnpm ci:check     # 完整质量门禁（type-check → lint → format:check → audit:style → build）
```

单项检查：

```bash
pnpm type-check       # tsc --noEmit
pnpm lint             # ESLint（仅覆盖 src/features/content/** 和 src/pages/blog-detail/**）
pnpm format:check     # Prettier（同上，仅覆盖基线范围）
pnpm audit:style      # 自定义样式审计脚本
```

**重要**：`lint` 和 `format` 当前仅覆盖 `src/features/content/**` 和 `src/pages/blog-detail/**`，不是全仓库。`pre{dev,start,build}` 会自动运行 `scripts/generate-content-meta.mjs` 生成内容元数据。

补充说明：

- 默认开发端口为 `8081`，`strictPort: true`
- 需要看页面实现时，优先复用已运行的 `http://127.0.0.1:8081`

## 路径别名

```
@/*         → src/*
@store/*    → src/store/*
@router/*   → src/router/*
@page/*     → src/pages/*
moment      → dayjs        （兼容性别名）
```

同时在 `tsconfig.json` 和 `vite.config.mjs` 中配置。

## 路由架构

- 路由统一收口在 `src/router/router_config.ts`
- `src/pages/**/index.tsx` 通过 `import.meta.glob` 动态发现，以目录名作为 pageId
- 顶层独立页面在 `src/config/siteNavigation.ts` 的 `SITE_PAGE_ROUTES` 中注册（blog、standard、footmark、aboutme、resume、showcase-\* 等）
- `/main/**` 下的内容型路由由 `src/data.ts` 菜单结构递归派生
- `src/router/router-view.tsx` 负责递归渲染路由树

## 状态管理

- 主状态入口：`src/store/index.ts`
- 模块：`main`、`ui`、`navigation`、`userPreferences`
- `userPreferences` 通过 `redux-persist` 做部分持久化
- 使用 `useAppDispatch` / `useAppSelector` 类型化 hooks

## 内容系统

- `src/features/content/` 包含博客文章卡片组件和内容索引
- `src/features/content/contentMeta.json` 由 `scripts/generate-content-meta.mjs` 自动生成，不要手动编辑
- 内容相关构建脚本：`build:content-meta`、`build:seo`（sitemap + RSS）、`build:search`

## 样式系统

- `src/index.css` — 全局样式唯一入口（分层架构说明见文件头部注释）
- `src/styles/1_tokens/` — 设计 token 主目录（颜色、字号、间距、排版、组件）
- `src/styles/2_globals/` — 全局样式（reset、基础元素）
- `src/styles/3_components/` — 组件样式（ui/ 原子组件、layout/ 布局组件）
- `src/styles/components.css` — `.ui-*` 可复用组件类
- `src/styles/palettes.css` — 调色板
- `src/styles/theme.css` + `src/styles/themes/` — 主题系统
- `src/theme/theme-bridge.tsx` — 主题与 Redux 状态桥接
- `src/styles/tokens/` — **DEPRECATED** 旧版令牌，只读不扩展

新增样式落点规则：

- 新 token → `src/styles/1_tokens/`
- 全局元素样式 → `src/styles/2_globals/`
- 通用组件样式 → `src/styles/3_components/`
- 页面私有样式 → `src/pages/<page>/index.css`（由页面组件导入）
- 页面主题覆盖 → `src/styles/themes/<page>-pages.css`

规则：

- 页面布局、栅格、响应式优先使用 Tailwind 风格类名
- 标题、正文、按钮、卡片、标签、输入框优先复用 `.ui-*` 类
- 颜色、字号、圆角、阴影、边框必须优先使用 token / 语义变量
- 除 token / theme 入口外，不允许在页面或组件样式中新增全局 `:root`
- 页面内高频使用的间距值应定义为页面根类变量（如 `.HomeWrap { --home-gap-card: 14px }`），而非 Tailwind 任意值
- stylelint --fix 或任何自动修复后，必须验证输出中是否有重复属性、残留行和语法错误，不能假设工具产出完全正确
- 大规模样式迁移（4+ 文件）必须拆成小批次执行（每批 3-4 个组件），每批完成后更新进度文件（如 `.claude/migration-progress.md`）并跑 build 验证，避免上下文窗口耗尽导致任务中断

## 测试规范

- 页面/组件 smoke 测试 → `tests/pages/`、`tests/components/`
- Store 测试 → `tests/store/`
- 工具函数单元测试 → `src/utils/__tests__/`
- Hook 单元测试 → `src/hooks/__tests__/`
- 测试 setup（matchMedia / IntersectionObserver mock）→ `tests/setup.ts`
- 运行：`pnpm test -- --run`

## Hooks

- `src/hooks/usePerformanceTier.ts` — 设备性能分层（low/medium/high）
- `src/hooks/useIdleMount.ts` — 空闲阶段挂载（requestIdleCallback 封装）
- `src/hooks/useMediaQuery.ts` — 媒体查询响应式 hook
- `src/hooks/useWindowEvent.ts` — 窗口事件绑定 hook
- `src/hooks/useRafLoop.ts` — requestAnimationFrame 循环 hook
- `src/hooks/useDeviceType.ts` — 设备类型检测
- `src/hooks/useIntersection.ts` — IntersectionObserver 封装
- `src/hooks/useAdvancedInteractions.ts` — 鼠标追踪、视差、粒子跟随、磁场效果
- `src/hooks/useErrorHandler.ts` — 异步操作状态管理

## TypeScript 配置

- `strict: false`，但 `noImplicitAny: true`、`noImplicitThis: true`
- `strictNullChecks: false`
- `allowJs: true`、`checkJs: false`
- 项目允许显式 `any`，但不允许继续扩散隐式 `any`

## 质量门禁

默认质量门禁链为：`type-check` → `lint` → `format:check` → `audit:style` → `build`

页面验收默认使用 Chrome MCP；当前仓库不把 Playwright 作为默认质量门禁前提。

## 错误经验记录

### 启用 noUnusedLocals / noUnusedParameters 后修复 121 个错误

- **问题描述**：启用 `noUnusedLocals: true` 和 `noUnusedParameters: true` 后，type-check 报出 121 个错误
- **解决方法**：
  - 32 个未使用的 `React` 默认导入：`jsx: "react-jsx"` 模式下不需要显式 import React，直接移除
  - 13 个未使用的 `BeautifyCode` 导入：从 import 语句中移除
  - 未使用的函数参数：加 `_` 前缀（如 `_event`、`_delta`），**注意** `noUnusedLocals` 不识别下划线前缀，只有 `noUnusedParameters` 才会，所以未使用的局部变量必须直接删除
  - 未使用的 import（useEffect, useState, THREE 等）：从 import 语句中移除
  - 未使用的解构变量（如 `const [hovered, setHover]` 中 hovered 未使用）：改为 `const [_hovered, setHover]` 或整个移除
- **关键发现**：项目配置了 PostToolUse Edit hook（可能是 eslint-plugin-react 的自动修复），会在 Edit 后自动格式化文件，会重新添加被移除的 `React` 导入。解决方案：对被 formatter 反复修改的文件，使用 Write 工具整体写入文件内容
- **相关文件**：64 个 src/ 目录下的文件被修改，主要分布在 `src/pages/code/react/`、`src/pages/aboutme/`、`src/components/`、`src/pages/home/`、`src/pages/footmark/` 等
- **注意事项**：
  - `noUnusedLocals` 不支持通过 `_` 前缀来忽略未使用的局部变量，只有 `noUnusedParameters` 支持此约定
  - `.d.ts` 类型声明文件中的参数不受影响
  - `src/pages/code/vue/` 目录已被 tsconfig exclude 排除，无需处理
  - 修改大文件时优先使用 Write 而非 Edit，避免 formatter 导致的匹配失败

### 样式系统优化与迁移

- **问题描述**：项目使用 SCSS、CSS、Tailwind、行内样式等多种样式方式混合，导致样式维护困难
- **解决方法**：
  - 创建分层样式架构：1_tokens（设计令牌）、2_globals（全局样式）、3_components（组件样式）、4_pages（页面样式）、5_themes（主题系统）、6_utilities（工具函数）
  - 建立设计令牌系统：颜色、间距、字体、圆角等统一使用 CSS 变量
  - 提供自动化工具：audit-styles.mjs（样式审计）、migrate-styles.mjs（样式迁移）
  - 创建迁移指南：MIGRATION_GUIDE.md 详细说明了迁移步骤和最佳实践
- **相关文件**：src/styles/、scripts/audit-styles.mjs、scripts/migrate-styles.mjs
- **注意事项**：
  - 迁移是渐进式的，不要一次性迁移所有文件
  - 先从简单组件开始，测试功能正常后再继续
  - 定期运行 `node scripts/audit-styles.mjs` 检查样式质量

### 依赖管理问题修复

- **问题描述**：需要将 .env.development 添加到 .gitignore，降级 @types/react 到 v18 系列，修复 antd/icons 版本不兼容，将 @testing-library/react 和 @types/three 移到 devDependencies
- **解决方法**：
  - .env.development 已存在于 .gitignore 中（第 10 行）
  - @types/react 已是 v18.3.12，无需降级
  - 将 @ant-design/icons 从 ^4.8.3 降级到 ^4.7.0 以保持与 antd v4.24.16 的兼容性
  - @testing-library/react 和 @types/three 已在 devDependencies 中，无需移动
- **相关文件**：package.json
- **注意事项**：使用 pnpm install 验证依赖兼容性，没有版本冲突问题

### CSS 文件中残留 SCSS 语法导致 PostCSS 构建失败

- **问题描述**：`src/styles/3_components/` 和 `src/styles/themes/` 下的 .css 文件是从 .scss 文件复制过来的，残留了 SCSS 语法（`//` 单行注释、`&` 嵌套、`@import .scss`、`@apply ui-*`、Tailwind arbitrary property 语法等），导致 `pnpm build` 失败
- **解决方法**：
  - `//` 单行注释：直接删除或改为 `/* */` 块注释
  - `&` 嵌套选择器：展开为完整的 CSS 选择器（如 `.code-block &__header` → `.code-block__header`）
  - `@import` 引用 `.scss` 文件：删除，如果导入的变量是局部变量则用 CSS 变量 fallback 替代（如 `var(--ui-code-size, 13px)`）
  - `@apply ui-*` 引用自定义 `.ui-*` 类：移除 `@apply` 行，因为这些 `.ui-*` 类已在 `components.css` 中定义且通过类名复用，`@apply` 只需移除即可
  - `@apply` 中的 Tailwind 工具类（如 `@apply relative flex`）：展开为对应的标准 CSS 属性
  - Tailwind arbitrary property 语法（如 `max-md:padding:`）：改为标准 `@media` 查询
- **相关文件**：
  - `src/styles/3_components/ui/not-found.css` — 删除 `//` 注释
  - `src/styles/3_components/ui/code-block.css` — 删除 `@import`、`//` 注释、展开 `&` 嵌套
  - `src/styles/3_components/ui/three-error-boundary.css` — 删除 `@import .scss`、`//` 注释、展开嵌套
  - `src/styles/3_components/ui/media-card.css` — 展开 `&` 嵌套
  - `src/styles/3_components/ui/beautify-code.css` — 展开 `&` 嵌套
  - `src/styles/3_components/ui/animated-content-transition.css` — 将 `@apply` 展开为 CSS 属性
  - `src/styles/themes/home-pages.css` — 移除 `@apply ui-*`、展开 `&` 嵌套
  - `src/styles/themes/about-pages.css` — 移除 `@apply ui-*`，展开 `.ui-*` 类的核心样式
  - `src/components/header/Header.module.css` — 将 `max-md:padding:` 改为 `@media` 查询
- **注意事项**：
  - `.css` 文件不能通过 `@import` 导入 `.scss` 文件，PostCSS 不支持
  - `@apply` 只能引用 Tailwind 内置类，自定义 `.ui-*` 类不在 Tailwind 的 `@layer` 中，`@apply` 会报错
  - 修改大文件时优先使用 Write 而非 Edit，避免 formatter hook 导致的匹配失败

### 首页 CSS 样式丢失 — 页面样式文件导入遗漏

- **问题描述**：将 `src/index.css` 从原始 61 行 CSS reset 改写为单体 `@import` 入口后，首页（HomeWrap）高度异常（1677 万像素），页面布局完全混乱。同时 aboutme 页面也有同样问题
- **根本原因**：迁移过程中，首页组件 `src/pages/home/index.tsx` 将原始的 `import './index.scss'`（1773 行布局+组件样式）替换为 `import '@/styles/themes/home-pages.css'`（仅 200 行 CSS 变量和少量样式），导致首页所有布局样式丢失。`home-pages.css` 只是 palette/变量层，不是完整样式。aboutme 页面同样遗漏了 `import './index.scss'`
- **解决方法**：
  - 在 `src/pages/home/index.tsx` 中**追加** `import './index.scss'`（保留 `home-pages.css` 导入）
  - 在 `src/pages/aboutme/index.tsx` 中**追加** `import './index.scss'`（保留 `about-pages.css` 导入）
  - `index.css` 当前作为全局样式入口（tokens、globals、components、themes、tailwind、antd-overrides）保持不变，因为原始的 `reset_style/index.scss` 已被新架构的 `2_globals/reset.css` 替代
- **相关文件**：`src/pages/home/index.tsx`、`src/pages/aboutme/index.tsx`
- **注意事项**：
  - `themes/home-pages.css` 和 `themes/about-pages.css` 只包含 CSS 变量（palette），不包含页面布局样式
  - 页面的实际布局样式仍在 `pages/<page>/index.scss` 中（使用 SCSS 语法），需要由页面组件自行导入
  - 迁移页面时，**不能删除**原有的 `import './index.scss'`，只能追加新的主题变量导入
