# 项目架构设计文档

## 概述

这是一个基于 React 18 + TypeScript + Vite 的个人博客/作品集网站，采用混合组件架构（函数组件与类组件并存）。

## 技术栈

### 核心框架

- **React 18**: 使用函数组件优先策略，保留类组件风格（App.tsx）
- **TypeScript 5.x**: 宽松类型配置 (`strict: false`)
- **Vite 5.0**: 现代化构建工具，提供快速的开发体验

### 路由系统

- **React Router DOM v5**: 使用 `BrowserRouter`（非 HashRouter）
- **动态路由发现**: 通过 `import.meta.glob` 自动发现页面组件
- **路由配置收口**: `src/router/router_config.ts` 统一管理路由

### 状态管理

- **主状态**: `src/store/`（RTK 风格 + redux-persist）
- **历史遗留**: `src/redux/OBS/`（仅作示例，非运行时主入口）
- **持久化**: `userPreferences` 模块通过 redux-persist 持久化

### UI 框架

- **Ant Design v4**: 主要 UI 组件库
- **Tailwind CSS v3**: 实用优先的 CSS 框架
- **设计系统**: 语义 token 组件化样式规范

### 3D 与动画

- **Three.js 0.182**: 3D 渲染引擎
- **React Three Fiber**: React 生态中的 Three.js 封装
- **动画库**: animejs, framer-motion, gsap

## 目录结构

```
src/
├── api/                    # API 接口层
├── assets/                 # 静态资源
│   ├── scss/              # SCSS 样式文件
│   └── fonts/             # 字体文件
├── components/             # 公共组件
├── config/                # 配置文件
├── data.ts               # 菜单数据结构
├── hooks/                # 自定义 Hooks
├── pages/                # 页面组件
├── redux/                # 遗留 Redux OBS 示例
├── store/                # 主状态管理
│   ├── index.ts          # Store / persist 配置
│   ├── hooks/            # Typed hooks
│   ├── main/             # 主内容状态
│   ├── navigation/       # 导航状态
│   ├── ui/               # UI 状态
│   └── userPreferences/  # 用户偏好
├── router/               # 路由配置
├── styles/               # 全局样式
│   ├── tokens/           # 基础 token
│   ├── components.css   # 组件样式
│   └── themes/          # 主题样式
├── types/                # TypeScript 类型定义
└── utils/                # 工具函数
```

## 核心架构模式

### 1. 混合组件策略

- **新功能**: 优先使用函数组件 + Hooks
- **核心入口**: 保留类组件风格（App.tsx）
- **内联子组件**: 复杂页面中子组件在文件内部定义

### 2. 路由系统

```typescript
// 动态页面发现
const modules = import.meta.glob('../pages/**/index.{js,jsx,tsx}')

// 路由配置
/src/router/router_config.ts  # 顶层路由注册
/src/data.ts                 # /main/** 内容体系菜单
```

### 3. 状态管理

```typescript
// 主状态收口
src/store/index.ts -> rootReducer
- main: 主布局与主内容状态
- ui: 全局 UI 状态
- navigation: 导航状态
- userPreferences: 主题/动效/偏好（持久化）
```

### 4. 样式分层策略

1. **基础层**: `src/styles/tokens/base.css` (原始设计 token)
2. **语义层**: `src/styles/tokens/semantic.css` (语义 token)
3. **主题层**: `src/styles/themes/*.css` (多主题支持)
4. **组件层**: `src/styles/components.css` (通用组件样式)
5. **页面层**: 页面特定样式 (仅当 Tailwind 无法覆盖时)

## 路径别名配置

```typescript
@/*         → src/*
@store/*    → src/store/*
@router/*   → src/router/*
@page/*     → src/pages/*
moment      → dayjs
```

## 开发规范

### 代码风格

- **缩进**: 2 空格
- **大括号**: 1TBS 风格
- **分号**: 不强制
- **引号**: 字符串使用双引号 JSX / 单引号 JS

### 组件规范

- **命名**: 组件使用 PascalCase，函数/变量使用 camelCase
- **注释**: 简洁为主，关键处点睛
- **导入**: 按功能分组，样式文件最后

### 样式规范

1. 页面布局优先使用 Tailwind 风格
2. 高频 UI 优先复用 `.ui-*` 语义类
3. 颜色/字号/圆角等必须使用 token
4. 只在必要时新增 SCSS 文件

## 性能优化

### 打包优化

- **代码分割**: 手动配置 vendor chunks
- **懒加载**: 页面组件按需加载
- **资源压缩**: gzip 压缩

### 运行时优化

- **React.memo**: 组件性能优化
- **useMemo/useCallback**: 减少不必要的重渲染
- **代码分割**: 动态导入大型依赖

## 测试策略

- **测试框架**: Vitest
- **测试环境**: jsdom
- **测试类型**: 单元测试 + 集成测试
- **测试覆盖**: 关键组件测试

## 部署流程

1. **构建**: `pnpm build`
2. **预览**: `pnpm preview`
3. **部署**: 部署到 Vercel 或其他静态托管服务

## 安全考虑

- **依赖安全**: 定期更新依赖，检查安全漏洞
- **类型安全**: TypeScript 类型检查
- **代码审查**: ESLint + Prettier 代码规范

## 维护指南

### 依赖更新

```bash
# 检查过时依赖
pnpm outdated

# 更新依赖
pnpm update <package-name>

# 安全审计
pnpm audit
```

### 代码质量

```bash
# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 完整质量检查
pnpm ci:check
```

### 测试

```bash
# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage
```

## 已知限制

1. **TypeScript 配置**: `strict: false`，依赖手动类型检查
2. **混合组件**: 类组件与函数组件并存，不强制统一
3. **历史遗留**: OBS 模块保留但非主状态入口
4. **样式分层**: 需要遵循严格的权限模型

## 未来规划

1. **主题切换**: 完善多主题支持
2. **测试覆盖**: 提高测试覆盖率
3. **性能监控**: 添加性能监控工具
4. **CI/CD**: 完善 CI/CD 流程
