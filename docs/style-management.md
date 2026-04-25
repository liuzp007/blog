# 样式管理规范

## 当前样式架构

### 样式文件统计

- **SCSS 文件**: 27 个
- **CSS 文件**: 23 个
- **总计**: 50 个样式文件

### 目录结构

```
src/
├── styles/                          # 全局样式
│   ├── tokens/                     # 设计 token
│   │   ├── base.css               # 基础 token
│   │   └── semantic.css           # 语义 token
│   ├── themes/                     # 主题
│   │   ├── dark.css               # 暗色主题
│   │   ├── light.css              # 亮色主题
│   │   ├── accessibility.css      # 无障碍主题
│   │   ├── legacy-shell.css      # 遗留壳样式
│   │   ├── content-features.css   # 内容特性样式
│   │   ├── code-pages.css        # 代码页样式
│   │   ├── legacy-code.css       # 遗留代码页样式
│   │   ├── showcase-pages.css    # 展示页样式
│   │   ├── blog-pages.css        # 博客页样式
│   │   ├── blog-detail-pages.css # 博客详情页样式
│   │   ├── home-pages.css        # 首页样式
│   │   └── footmark-pages.css    # 足迹页样式
│   ├── primitives.css             # 基础样式重置
│   ├── theme.css                  # 主题配置
│   ├── components.css            # 通用组件样式
│   ├── global-ui.css             # 全局 UI 样式
│   ├── antd-overrides.css        # Ant Design 覆盖
│   ├── palettes.css              # 调色板
│   └── global-ui.css             # 全局 UI
├── pages/                         # 页面级样式
│   ├── home/index.scss
│   ├── blog/index.scss
│   ├── blog-detail/index.scss
│   ├── aboutme/index.scss
│   ├── footmark/index.scss
│   └── showcase-*/index.scss
├── components/                     # 组件级样式
│   ├── header/index.scss
│   ├── content-card/index.scss
│   ├── vinyl/index.scss
│   └── ...
└── features/                       # 功能模块样式
    └── content/*.scss
```

## 样式优先级规则

### 1. 优先级排序（从高到低）

1. **页面级样式** (`src/pages/*/index.scss`)
   - 最高优先级
   - 用于页面特定的布局和视觉需求
   - 仅在 Tailwind 无法满足时使用

2. **组件级样式** (`src/components/*/index.scss`)
   - 用于特定组件的私有样式
   - 应避免全局影响

3. **主题样式** (`src/styles/themes/*-pages.css`)
   - 页面主题层样式
   - 按页面类型组织

4. **组件样式** (`src/styles/components.css`)
   - 通用组件样式
   - 应优先复用 `.ui-*` 类

5. **语义 token** (`src/styles/tokens/semantic.css`)
   - 语义化颜色、间距等
   - 优先使用而非直接写值

6. **基础 token** (`src/styles/tokens/base.css`)
   - 设计系统基础 token
   - 核心配置文件

### 2. 使用指南

#### 布局和响应式

```tsx
<div className="flex flex-col md:flex-row gap-4 p-4">{/* 使用 Tailwind 处理布局 */}</div>
```

#### 通用 UI 组件

```tsx
<button className="ui-button ui-button-primary">
  按钮
</button>

<div className="ui-card">
  <h3 className="ui-section-title">标题</h3>
  <p className="ui-body-text">内容</p>
</div>
```

#### 语义颜色和间距

```scss
.page-container {
  padding: var(--space-lg); /* 使用 token */
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}
```

#### 动态效果

```tsx
<div
  style={{
    transform: `translate(${x}px, ${y}px)`
  }}
>
  {/* 内联样式仅用于动态效果 */}
</div>
```

## 样式编写规范

### 1. 文件命名

- 使用 `kebab-case`
- 组件样式: `component-name.scss`
- 页面样式: `index.scss`

### 2. 类名命名

- 使用 `BEM` 或 `kebab-case`
- 组件根类应与组件名匹配
- 避免过于通用的类名

### 3. CSS 变量使用

**允许使用 `:root` 的文件**:

- `src/styles/tokens/base.css`
- `src/styles/tokens/semantic.css`
- `src/styles/themes/dark.css`
- `src/styles/themes/light.css`
- `src/styles/themes/accessibility.css`

**禁止使用 `:root` 的文件**:

- 所有页面样式
- 所有组件样式
- `src/styles/components.css`
- `src/styles/global-ui.css`

### 4. 样式隔离

- 组件样式应尽量私有化
- 使用模块前缀避免污染
- 避免全局选择器

## 迁移计划

### 阶段 1: 立即执行（已完成）

- ✅ 创建样式规范文档
- ✅ 确立样式优先级规则

### 阶段 2: 近期执行（1-2周）

- [ ] 审核所有 SCSS 文件，移除硬编码值
- [ ] 统一使用 token 和语义变量
- [ ] 清理冗余样式
- [ ] 合并相似主题文件

### 阶段 3: 长期优化（1-2月）

- [ ] 考虑迁移到 CSS Modules
- [ ] 评估 Tailwind 配置优化
- [ ] 建立样式自动化检查

## 注意事项

1. **禁止事项**:
   - 禁止在页面/组件中直接手写颜色、字号、圆角等视觉值
   - 禁止绕开 token / 语义类单独定义一套视觉规则
   - 禁止使用 `div` / `span` 充当按钮

2. **推荐做法**:
   - 优先使用 Tailwind 处理布局和响应式
   - 优先复用 `src/styles/components.css` 中的 `.ui-*` 类
   - 必须使用 `src/styles/tokens/semantic.css` 中的 token

3. **特殊情况**:
   - 仅在 Tailwind 无法覆盖且确属页面私有视觉时，才新增 SCSS 文件
   - 仅在必要的动态效果时使用内联样式

## 相关文档

- [样式治理文档](/docs/style-governance.md)
- [设计系统](/docs/design-system.md)
- [主题配置](/docs/theme-configuration.md)
