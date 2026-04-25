# 样式系统使用指南

## 架构概览

本项目采用分层样式架构，从底层到上层分为：

```
1_tokens/     # 设计令牌（不变层）
2_globals/     # 全局样式（基础层）
3_components/  # 组件样式（组件层）
4_pages/       # 页面样式（页面层）
5_themes/      # 主题系统（主题层）
6_utilities/   # 工具函数
```

## 使用优先级

1. **Tailwind 实用类** - 快速布局和样式
2. **设计令牌** - 使用 CSS 变量
3. **组件类** - 使用 `.ui-*` 类
4. **模块化样式** - CSS Modules 或 styled-components
5. **行内样式** - 最后手段（谨慎使用）

## 设计令牌使用

### 颜色系统

```css
/* 基础颜色 */
--color-white: #ffffff;
--color-black: #000000;

/* 功能颜色 */
--color-accent-cyan: #58a6ff;
--color-success: #3fb950;
--color-warning: #d29922;
--color-error: #f85149;

/* 使用方法 */
.element {
  background: var(--color-accent-cyan);
  color: var(--color-white);
}
```

### 间距系统

```css
/* 固定间距 */
--space-1: 0.25rem; /* 4px */
--space-4: 1rem; /* 16px */
--space-8: 2rem; /* 32px */

/* 使用方法 */
.container {
  padding: var(--space-4);
  margin-bottom: var(--space-8);
}
```

### 字体系统

```css
/* 字体大小 */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */

/* 行高 */
--line-height-normal: 1.5;
--line-height-tight: 1.25;

/* 使用方法 */
.heading {
  font-size: var(--text-xl);
  line-height: var(--line-height-tight);
}
```

## 组件样式规范

### 按钮组件

```css
/* 使用设计令牌 */
.ui-button {
  min-height: var(--button-height-md);
  padding: var(--button-padding-inline-md);
  border-radius: var(--button-radius-md);
  font-size: var(--button-font-size-md);
}

/* 变体 */
.ui-button--primary {
  background: var(--color-accent-cyan);
  color: var(--color-white);
}
```

### 卡片组件

```css
.ui-card {
  background: var(--card-bg);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  gap: var(--card-gap);
}

.ui-card--elevated {
  box-shadow: var(--shadow-lg);
}
```

## Tailwind CSS 集成

### 在组件中使用

```jsx
function MyComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">标题</h1>
      <button className="ui-button ui-button--primary">点击按钮</button>
    </div>
  )
}
```

### 自定义配置

在 `tailwind.config.js` 中扩展颜色和间距：

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'accent-cyan': '#58a6ff',
        success: '#3fb950'
      },
      spacing: {
        18: '4.5rem'
      }
    }
  }
}
```

## 响应式设计

### 使用 Tailwind 断点

```css
/* 小屏幕 */
@media (max-width: 640px) {
  .element {
    font-size: var(--text-sm);
  }
}

/* 中等屏幕 */
@media (max-width: 768px) {
  .element {
    padding: var(--space-2);
  }
}
```

### 使用 Tailwind 响应式类

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">响应式布局</div>
```

## 最佳实践

### 1. 优先使用设计令牌

```css
/* ✅ 推荐 */
.button {
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

/* ❌ 避免 */
.button {
  padding: 16px;
  border-radius: 8px;
}
```

### 2. 遵循 BEM 命名规范

```css
/* ✅ 推荐 */
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
.headerNavLink {
}
.activeNavLink {
}
```

### 3. 避免过度嵌套

```css
/* ✅ 推荐 */
.card {
}
.card-title {
}
.card-content {
}

/* ❌ 避免 */
.card .card__header .card__title {
}
```

### 4. 使用 CSS 变量实现主题切换

```css
:root {
  --primary-color: #58a6ff;
}

[data-theme='dark'] {
  --primary-color: #79c0ff;
}
```

## 迁移指南

### 从旧样式迁移

1. **替换硬编码值**

   ```css
   /* 旧 */
   .button {
     padding: 16px;
   }

   /* 新 */
   .button {
     padding: var(--space-4);
   }
   ```

2. **使用组件类**

   ```css
   /* 旧 */
   .button {
     background: #58a6ff;
     border-radius: 8px;
   }

   /* 新 */
   .button {
     background: var(--color-accent-cyan);
     border-radius: var(--radius-md);
     @extend .ui-button;
   }
   ```

3. **模块化样式**

   ```jsx
   // 使用 CSS Modules
   import styles from './Button.module.css'

   function Button() {
     return <button className={styles.button}>按钮</button>
   }
   ```

## 样式检查清单

- [ ] 使用设计令牌而非硬编码值
- [ ] 遵循 BEM 命名规范
- [ ] 响应式设计已实现
- [ ] 无 CSS 类冲突
- [ ] 无深层嵌套选择器
- [ ] 组件样式隔离
