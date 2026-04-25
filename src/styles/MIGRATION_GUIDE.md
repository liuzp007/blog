# 样式系统迁移指南

## 概述

本文档将帮助你将项目从当前的混合样式架构迁移到新的分层样式架构。

## 架构对比

### 旧架构（现状）

```
src/styles/
├── theme.css           # 主题入口
├── components.css      # 语义组件
├── global-ui.css       # 全局UI
├── palettes.css        # 调色板
├── primitives.css      # 基础样式
└── themes/             # 主题文件
    ├── dark.css
    ├── light.css
    └── ...

# 组件样式分散在：
src/components/*/index.scss
src/pages/*/index.scss
src/features/*/index.scss
```

### 新架构（目标）

```
src/styles/
├── 1_tokens/           # 设计令牌（不变层）
│   ├── base.css        # 基础变量（颜色、间距、字体）
│   ├── components.css  # 组件尺寸变量
│   ├── typography.css  # 排版变量
│   └── semantic.css    # 语义变量
├── 2_globals/          # 全局样式（基础层）
│   ├── reset.css       # reset/reset
│   ├── base.css        # 全局基础样式
│   ├── typography.css  # 全局排版
│   └── helpers.css     # 工具类
├── 3_components/       # 组件样式（组件层）
│   ├── shared/         # 跨组件共享
│   ├── ui/             # UI基础组件
│   └── layout/         # 布局组件
├── 4_pages/           # 页面样式（页面层）
│   ├── home.css
│   ├── blog.css
│   └── ...
├── 5_themes/          # 主题系统（主题层）
│   ├── light.css
│   ├── dark.css
│   └── themes.css     # 主题入口
└── 6_utilities/       # 工具函数
    ├── mixins.css     # SCSS mixins
    └── functions.css  # CSS函数
```

## 迁移步骤

### 第一步：运行审计工具

```bash
# 检查当前样式使用情况
node scripts/audit-styles.mjs
```

这将生成一个详细的报告，显示需要优化的地方。

### 第二步：使用迁移工具

```bash
# 运行自动化迁移
node scripts/migrate-styles.mjs
```

这个工具会：

1. 扫描所有样式文件
2. 重命名文件到新位置
3. 替换硬编码值为设计令牌
4. 优化选择器

### 第三步：手动优化

迁移后需要手动处理一些特殊情况：

#### 1. 组件样式重构

**迁移前：**

```scss
// src/components/header/index.scss
.header {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;

  .nav {
    margin-top: 16px;

    .nav-item {
      color: #58a6ff;
      &:hover {
        background: #f1f3f5;
      }
    }
  }
}
```

**迁移后：**

```css
/* src/styles/3_components/layout/header.css */
.header {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.header__nav {
  margin-top: var(--space-4);
}

.header__nav-item {
  color: var(--color-accent-cyan);
}

.header__nav-item:hover {
  background: var(--raw-gray-100);
}
```

#### 2. 组件文件更新

**迁移前：**

```tsx
import './index.scss'

function Header() {
  return (
    <div className="header">
      <div className="nav">
        <div className="nav-item">导航项</div>
      </div>
    </div>
  )
}
```

**迁移后：**

```tsx
import styles from './Header.module.css'

function Header() {
  return (
    <div className={styles.header}>
      <nav className={styles.header__nav}>
        <a className={styles.header__navItem}>导航项</a>
      </nav>
    </div>
  )
}
```

### 第四步：使用新样式系统

#### 设计令牌使用

```css
/* 使用基础设计令牌 */
.button {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-accent-cyan);
}

/* 使用组件设计令牌 */
.card {
  padding: var(--card-padding);
  gap: var(--card-gap);
  border-radius: var(--card-radius);
}
```

#### Tailwind CSS + 设计令牌

```jsx
function Component() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold">标题</h1>
      <button className="ui-button ui-button--primary">按钮</button>
    </div>
  )
}
```

## 常见问题

### Q: 为什么要迁移？

A: 新架构提供了以下优势：

1. **可维护性**：清晰的分层，易于理解和修改
2. **一致性**：通过设计令牌确保样式统一
3. **主题切换**：更容易实现暗色/亮色主题
4. **性能**：减少样式重复和冗余
5. **可扩展性**：更容易添加新的组件和页面

### Q: 迁移会影响现有功能吗？

A: 不会。迁移是渐进式的：

1. 保持现有功能不变
2. 逐步替换样式实现
3. 确保样式覆盖面完整

### Q: 如何处理第三方组件？

A: 继续使用原有样式，但可以通过覆盖层进行调整：

```css
/* 第三方组件样式覆盖 */
.ant-button {
  border-radius: var(--radius-md) !important;
  font-size: var(--text-sm) !important;
}
```

## 最佳实践

### 1. 样式优先级

```css
/* ❌ 避免：混合多种样式方法 */
.button {
  padding: 16px; /* 硬编码 */
  background: #58a6ff; /* 硬编码 */
  margin: 1rem; /* 硬编码 */
  border-radius: 8px; /* 硬编码 */
}

/* ✅ 推荐：统一使用设计令牌 */
.button {
  padding: var(--space-4);
  background: var(--color-accent-cyan);
  margin: var(--space-4);
  border-radius: var(--radius-md);
}
```

### 2. 选择器规范

```css
/* ✅ BEM 命名规范 */
.header {
}
.header__nav {
}
.header__nav-item {
}
.header__nav-item--active {
}

/* ❌ 避免 */
.headerNav {
}
.navItem {
}
.activeItem {
}
```

### 3. 响应式设计

```css
/* ✅ 使用媒体查询 */
@media (max-width: 768px) {
  .card {
    padding: var(--space-3);
  }
}

/* ✅ 使用 Tailwind 响应式类 */
<div className="w-full md:w-1/2">
  响应式布局
</div>
```

## 维护新系统

### 1. 添加新的设计令牌

在 `src/styles/1_tokens/` 中添加新的变量：

```css
/* src/styles/1_tokens/base.css */
:root {
  /* 新的颜色 */
  --color-brand-primary: #ff6b6b;

  /* 新的间距 */
  --space-13: 3.25rem;

  /* 新的字体大小 */
  --text-6xl: 3.75rem;
}
```

### 2. 添加新的组件样式

在 `src/styles/3_components/` 中添加：

```css
/* src/styles/3_components/ui/modals.css */
.modal {
  /* 模态框样式 */
}
```

### 3. 定期审计

定期运行审计工具：

```bash
node scripts/audit-styles.mjs
```

## 获取帮助

- 查看 `src/styles/README.md` 了解详细使用指南
- 查看示例 `src/components/header/Header.example.jsx`
- 运行 `node scripts/migrate-styles.mjs` 获取迁移帮助

## 注意事项

1. **渐进式迁移**：不要一次性迁移所有文件，先从简单的组件开始
2. **测试**：每次迁移后测试功能是否正常
3. **备份**：在迁移前备份重要文件
4. **团队协作**：确保团队成员了解新的样式系统
