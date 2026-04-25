# 样式治理规范

## 目标

这套规范用于把项目从“颜色值收口”推进到“可执行的设计系统”。

核心目标：

- 业务代码不直接写原始颜色、字号、圆角、阴影。
- 页面和组件优先消费语义 token，而不是消费原始 token。
- 为后续主题切换预留能力，但当前不强制上线主题切换 UI。
- 样式问题可以通过脚本审计，而不是依赖人工搜索。

## 当前结构

主题层已经拆成 5 层：

1. `src/styles/tokens/base.css`
原始设计 token，只放基础色板、透明度、字号、字重、圆角、阴影、间距、动效。

2. `src/styles/tokens/semantic.css`
语义 token 和组件 token。
例如：`--color-page-bg`、`--button-primary-bg`、`--card-radius`、`--heading-1-size`。

3. `src/styles/themes/dark.css`
默认暗色主题和 `cyberpunk / dark / minimal / vibrant` 主题覆盖。

4. `src/styles/themes/light.css`
浅色主题覆盖。

5. `src/styles/themes/accessibility.css`
高对比和减少动效覆盖。

全局入口文件：

- `src/styles/theme.css`
- `src/styles/palettes.css`
- `src/styles/primitives.css`
- `src/styles/components.css`
- `src/styles/global-ui.css`
- `src/styles/antd-overrides.css`

主题桥接文件：

- `src/theme/theme-bridge.tsx`

## 变量定义权限模型

这是当前项目后续必须遵守的硬边界，优先级高于“页面自己看着方便”。

### `:root` 权限

只有下面这些核心入口文件允许出现 `:root`：

- `src/styles/tokens/base.css`
- `src/styles/tokens/semantic.css`
- `src/styles/themes/dark.css`
- `src/styles/themes/light.css`
- `src/styles/themes/accessibility.css`

其他任何文件一律禁止出现 `:root`，包括但不限于：

- `src/pages/**/*.scss`
- `src/components/**/*.scss`
- `src/styles/components.css`
- `src/styles/global-ui.css`
- `src/styles/primitives.css`
- `src/styles/theme.css`
- `src/styles/palettes.css`
- `src/styles/themes/*-pages.css`
- `src/styles/themes/content-features.css`
- `src/styles/themes/code-pages.css`
- `src/styles/themes/legacy-code.css`
- `src/styles/themes/legacy-shell.css`

### 全局 token 权限

全局 token 只能在 token 层和 theme 层定义，不得散落到页面和组件里。

- `base.css` 只允许定义原始值层，例如 `--raw-*`
- `semantic.css` 只允许定义语义 token、组件 token 与兼容别名
- `dark.css` / `light.css` / `accessibility.css` 只允许覆盖 token 的值，不允许发明新的业务结构类
- `src/styles/themes/*-pages.css`、`content-features.css`、`code-pages.css`、`legacy-code.css`、`legacy-shell.css` 不属于全局主题入口，只能当作模块局部 palette 文件使用

页面和组件层禁止新增或重新定义以下前缀的全局 token：

- `--raw-*`
- `--white-alpha-*`
- `--black-alpha-*`
- `--font-*`
- `--space-*`
- `--radius-*`
- `--control-*`
- `--motion-*`
- `--easing-*`
- `--color-*`
- `--text-*`
- `--heading-*`
- `--button-*`
- `--card-*`
- `--tag-*`
- `--input-*`
- `--bg-*`
- `--accent-*`
- `--surface-*`
- `--brand-*`
- `--border-*`
- `--status-*`
- `--state-*`
- `--glass-*`
- `--sidebar-*`
- `--shadow-*`
- `--focus-*`
- `--warning-*`

### 页面 / 组件局部变量权限

页面和组件允许定义局部变量，但必须满足下面两个条件：

1. 变量必须挂在本模块根类或局部类上，不能挂在 `:root` / `html` / `body`
2. 变量名必须是“模块私有变量”或“设计系统允许的局部适配变量”

推荐的局部变量命名：

- 页面：`--home-*`、`--blog-*`、`--about-*`、`--footmark-*`
- 组件：`--content-card-*`、`--tilt-*`、`--media-card-*`
- 共享 palette：`--article-*`、`--code-page-*`、`--beautify-code-*`、`--main-shell-*`、`--header-shell-*`

允许保留的设计系统局部适配变量：

- `--ui-card-padding`
- `--ui-button-*`
- `--ui-tag-*`
- `--ui-input-*`

### 页面主题 / palette 文件规则

`src/styles/themes/` 目录里并不是所有文件都天然拥有“全局主题权限”。

只有下面 3 个文件属于真正的主题入口：

- `src/styles/themes/dark.css`
- `src/styles/themes/light.css`
- `src/styles/themes/accessibility.css`

其余文件如果只是页面主题、历史页面 palette 或共享展示 palette，例如：

- `src/styles/themes/home-pages.css`
- `src/styles/themes/blog-pages.css`
- `src/styles/themes/showcase-pages.css`
- `src/styles/themes/footmark-pages.css`
- `src/styles/themes/content-features.css`
- `src/styles/themes/code-pages.css`
- `src/styles/themes/legacy-code.css`
- `src/styles/themes/legacy-shell.css`

那么它们必须遵守“局部层规则”：

1. 变量必须挂在页面根类、模块根类或共享组件根类上
2. 禁止使用 `:root`
3. 禁止定义或覆写全局语义 token
4. 只允许使用模块前缀变量或 `--ui-*` 局部适配变量

`src/styles/palettes.css` 的职责是：

1. 只聚合这些局部 palette 文件
2. 自身不得定义 `:root`
3. 自身不得定义新的全局 token
4. 不得承载任何真实布局或结构样式

### 严禁的页面层覆写

下面这些变量如果出现在页面或组件层，默认视为违反规范：

- `--card-radius`
- `--card-gap`
- `--card-padding`
- `--heading-display-size`
- `--heading-1-size`
- `--heading-2-size`
- `--heading-3-size`
- `--heading-4-size`
- `--heading-card-size`
- `--heading-card-line-height`
- `--text-body-size`
- `--text-body-line-height`
- `--text-caption-size`
- `--text-meta-size`
- `--text-lead-size`
- `--text-lead-line-height`
- `--text-eyebrow-size`
- `--text-eyebrow-letter-spacing`
- `--text-overline-size`
- `--text-overline-letter-spacing`

原因很简单：这些变量属于整站排版基线或共享组件基线，不应该在业务层再偷偷定义第二套系统。

### 主题切换边界

如果未来做一键换肤，入口也必须保持单一：

- 主题状态只允许通过 `:root` / `html` 上的 `data-theme`、`data-font-size`、`data-high-contrast`、`data-reduced-motion` 驱动
- 主题值只允许在 `src/styles/themes/dark.css`、`light.css`、`accessibility.css` 覆盖
- 页面文件禁止自己实现一套“局部主题系统”

### 审计入口

规范不是只靠人记，必须通过脚本落地：

- 运行命令：`pnpm audit:style`
- 审计脚本：`scripts/audit-style.js`

更严格的变量权限和违规判定，详见：

- `docs/style-governance-strict.md`

## 设计系统分层

建议把这套体系理解成“从值到页面”的 5 层链路，而不是只记文件名：

1. `Base Token`
只放原始值和尺度，不表达业务语义。
典型内容：`--raw-*`、`--white-alpha-*`、`--font-size-*`、`--radius-*`、`--space-*`、`--shadow-*`。

2. `Semantic Token`
把“值”翻译成“用途”。
典型内容：`--color-text-primary`、`--color-surface-base`、`--color-danger-strong`、`--color-brand-primary`。

3. `Component Token`
把高频组件的公共约束收口。
典型内容：`--heading-1-size`、`--heading-display-size`、`--button-height-lg`、`--button-primary-bg`、`--card-radius`、`--card-border`。

4. `Component Class`
把高频 UI 做成可以直接复用的语义类。
典型内容：`.ui-display-title`、`.ui-page-title`、`.ui-lead-text`、`.ui-button-primary`、`.ui-card`。

5. `Theme Override`
主题文件只负责覆盖 token 的值，不负责定义新的业务结构。

执行口径统一为：

- `base.css` 负责“值”
- `semantic.css` 负责“用途”
- `theme.css` 负责“核心主题入口”
- `palettes.css` 负责“局部 palette 聚合”
- `components.css` 负责“可复用表现”
- `dark.css` / `light.css` / `accessibility.css` 负责“主题覆盖”
- `*-pages.css` / palette 文件负责“模块局部视觉变量”
- 页面文件只负责“组合”，不负责重新发明 token

## 页面开发顺序

新增页面或重构页面时，统一按下面顺序落样式：

1. 先用 Tailwind 处理布局、栅格、间距、对齐、响应式显隐。
2. 标题、正文、按钮、卡片等高频 UI，优先复用 `src/styles/components.css` 中的 `.ui-*` 通用类。
3. 交互控件优先使用 Ant Design 组件，不重新造 `button / input / select / pagination` 的交互行为。
4. 如果 Tailwind 无法覆盖局部视觉，再补页面私有 SCSS，但 SCSS 只能消费语义 token 或页面主题变量。
5. Three.js / Canvas / 地图等运行时颜色，必须先读 CSS 变量，再传给运行时 API。

页面层的推荐分工：

- Tailwind：布局、间距、栅格、flex、响应式断点、显隐控制。
- `.ui-*` 通用类：标题、正文、说明文、按钮、卡片等语义表现。
- 语义 token：颜色、字号、圆角、阴影、边框、动效。
- 页面私有主题变量：只处理该页面独有的视觉语言，不反向污染全站 token。

## Token 分层规则

### 基础 token

只能出现在：

- `src/styles/tokens/base.css`

示例：

- `--raw-indigo-500`
- `--font-size-2xl`
- `--radius-md`
- `--shadow-sm`

### 语义 token

用于描述“用途”，不描述“具体值”。

示例：

- `--color-page-bg`
- `--color-text-primary`
- `--color-brand-primary`
- `--button-primary-bg`
- `--card-border`

业务组件优先使用语义 token。

### 组件 token

组件 token 用来约束组件表现。

示例：

- `--heading-1-size`
- `--heading-display-size`
- `--heading-card-size`
- `--button-height`
- `--button-height-lg`
- `--button-radius`
- `--button-padding-inline-md`
- `--card-padding`
- `--card-padding-sm`

如果多个组件反复出现同一类样式，应先沉淀到组件 token。

### 页面局部覆写边界

页面或组件可以做“局部变体”，但不要在业务层重新定义一套排版系统。

推荐保留在页面层的覆写：

- `--ui-card-padding`
- `--ui-button-height`
- `--ui-button-padding-inline`
- `--ui-button-radius`
- `--ui-tag-*`
- `--ui-input-*`
- 页面私有主题变量，例如 `--home-*`、`--lab-*`、`--detail-*`

这类变量的共同点是：它们只影响当前模块的局部表现，不会改写整站排版基线。

不推荐在页面层频繁覆写的 token：

- `--card-radius`
- `--card-gap`
- `--heading-card-size`
- `--heading-card-line-height`
- `--text-body-size`
- `--text-body-line-height`
- `--heading-1-size` / `--heading-2-size` / `--heading-3-size`

这类变量一旦在多个页面重复出现，本质上就是页面在偷偷定义第二套设计系统。遇到这种情况，按下面顺序治理：

1. 如果只是当前模块的紧凑/强调变体，优先新增 `.ui-*` 组件变体类。
2. 如果多个页面都需要同一组覆写，提升到 `semantic.css` 的组件 token。
3. 如果差异本质上属于全局主题风格，而不是组件结构，放到 `src/styles/themes/dark.css`、`light.css`、`accessibility.css`；如果只是页面私有氛围，则放到对应页面根类作用域。

额外硬约束：

- 页面层禁止定义 `--button-primary-*`、`--button-secondary-*`、`--button-ghost-*`、`--button-danger-*`
- 页面层禁止定义 `--tag-bg`、`--tag-border`、`--tag-text`
- 页面层禁止定义 `--bg-*`、`--text-*`、`--accent-*` 这类历史兼容全局别名
- 页面层禁止定义 `--surface-*`、`--brand-*`、`--border-*`、`--status-*`、`--state-*`、`--glass-*`
- 如果需要局部按钮或标签变体，优先使用 `.ui-*` 组合类，实在不够再新增组件变体类，不要直接重写共享 token

## 排版规范

### 字体

- 正文：`var(--font-family-body)`
- 标题：`var(--font-family-heading)`
- 代码：`var(--font-family-mono)`

### 标题层级

- `h1`: `var(--heading-1-size)` / `var(--heading-font-weight)`
- `h2`: `var(--heading-2-size)` / `var(--heading-font-weight)`
- `h3`: `var(--heading-3-size)` / `var(--heading-font-weight)`
- `h4`: `var(--heading-4-size)` / `var(--font-weight-semibold)`
- `h5`: `var(--heading-5-size)` / `var(--font-weight-semibold)`
- `h6`: `var(--heading-6-size)` / `var(--font-weight-semibold)`

### 正文

- 正文大小：`var(--text-body-size)`
- 正文行高：`var(--text-body-line-height)`
- 导语大小：`var(--text-lead-size)`
- 元信息大小：`var(--text-meta-size)`
- Caption：`var(--text-caption-size)`

## 组件规范

### 按钮

统一按钮基础约束：

- 高度：`var(--button-height)`
- 圆角：`var(--button-radius)`
- 字号：`var(--button-font-size)`
- 字重：`var(--button-font-weight)`

推荐尺寸变体：

- 紧凑按钮：`.ui-button-sm`
- 默认按钮：`.ui-button-md`
- 强调按钮：`.ui-button-lg`

优先级：

1. Ant Design `Button`
2. 原生 `button`
3. 路由跳转用 `Link` 或 `a`

禁止：

- 用 `span` / `div` 充当按钮
- 只靠 `role="button"` 补语义

### 卡片

统一卡片基础约束：

- 圆角：`var(--card-radius)`
- 边框：`var(--card-border)`
- 背景：`var(--card-bg)`
- Hover 背景：`var(--card-bg-hover)`
- 阴影：`var(--card-shadow)`

## 设计系统对照速查

这部分用于“拿来就用”。新增页面时，优先照着这里选组件、类名和 token。

| 场景 | 推荐标签/组件 | 推荐类名 | 优先 token | 备注 |
|------|---------------|----------|------------|------|
| 首屏展示标题 | `h1` | `.ui-display-title` | `--heading-display-size` `--heading-display-line-height` | Hero 首屏、大标题区域优先使用 |
| 页面主标题 | `h1` | `.ui-page-title` | `--heading-1-size` `--heading-font-weight` `--color-text-heading` | 用于页面首屏、主模块标题 |
| 区块标题 | `h2` | `.ui-section-title` | `--heading-2-size` `--color-text-heading` | 一个 section 一个主标题 |
| 子模块标题 | `h3`/`h4` | `.ui-subsection-title` | `--heading-3-size` `--font-weight-semibold` | 卡片组、子面板标题 |
| 卡片标题 | `h3`/`h4` | `.ui-card-title` | `--heading-card-size` `--heading-card-line-height` | 卡片/统计面板标题统一走这里 |
| 导语 / 首屏摘要 | `p` | `.ui-lead-text` | `--text-lead-size` `--text-lead-line-height` | Hero 描述、页面导语 |
| 正文 | `p` | `.ui-body-text` | `--text-body-size` `--text-body-line-height` `--color-text-primary` | 默认正文层级 |
| 强调正文 | `p`/`div` | `.ui-body-text-strong` | `--text-body-strong-weight` | 需要比正文更稳的说明块 |
| 弱化说明 | `p`/`span` | `.ui-muted-text` | `--color-text-muted` | 摘要、辅助说明、解释文案 |
| Caption / 元信息 | `span`/`time` | `.ui-caption` | `--text-caption-size` `--color-text-secondary` | 时间、作者、状态描述 |
| 元信息 / 数据副标题 | `span`/`time` | `.ui-meta-text` | `--text-meta-size` `--text-meta-line-height` | 阅读量、日期、统计标签 |
| 眉标签 / 分组前缀 | `span` | `.ui-eyebrow` | `--color-accent-cyan` `--text-caption-size` | 分类、kicker、章节前缀 |
| Overline | `span` | `.ui-overline` | `--text-overline-size` `--text-overline-letter-spacing` | 更轻的上标说明 |
| 主按钮 | `Button` / `button` / `Link` | `.ui-button-primary` | `--button-primary-bg` `--button-primary-text` | Antd `Button` 仍优先 |
| 次按钮 | `Button` / `button` / `Link` | `.ui-button-secondary` | `--button-secondary-bg` `--button-secondary-border` | 次操作、返回、筛选 |
| 弱按钮 | `Button` / `button` / `Link` | `.ui-button-ghost` | `--button-ghost-text` | 工具栏、轻操作 |
| 危险按钮 | `Button` / `button` | `.ui-button-danger` | `--button-danger-bg` `--button-danger-text` | 删除、清空、不可逆操作 |
| 按钮尺寸 | `Button` / `button` / `Link` | `.ui-button-sm` `.ui-button-md` `.ui-button-lg` | `--button-height-*` `--button-padding-inline-*` | 尺寸和语义拆开组合使用 |
| 通栏按钮 | `Button` / `button` | `.ui-button-block` | `--button-height` | 表单提交、弹层主操作 |
| 标准卡片 | `section` / `article` / `div` | `.ui-card` | `--card-bg` `--card-border` `--card-radius` | 内容容器优先复用 |
| 可点击卡片 | `button` / `Link` / `a` | `.ui-card .ui-card--interactive` | `--card-bg-hover` `--card-shadow-hover` | 不再用 `div + onClick + role="button"` |
| 紧凑卡片 | `section` / `article` / `div` | `.ui-card .ui-card--compact` | `--card-padding-sm` | 信息密度更高的卡片 |
| 高亮卡片 | `section` / `article` / `div` | `.ui-card .ui-card--elevated` | `--card-shadow-hover` `--card-border-strong` | Hero 面板、重点浮层 |
| 媒体分层卡片 | `article` / `div` | `.ui-card .ui-card--media-split` | `--card-media-split-*` | 上方媒体、下方正文的卡片骨架 |
| 标签 / 轻徽标 | `Tag` / `span` | `.ui-tag` | `--tag-*` | 分类、技术栈、轻状态标签统一走这里 |
| 紧凑标签 | `Tag` / `span` | `.ui-tag .ui-tag--sm` | `--tag-height-sm` `--tag-padding-inline-sm` | 筛选器、卡片小徽标 |
| 交互标签 | `Tag` / `span` | `.ui-tag .ui-tag--interactive` | `--card-border-interactive` | 筛选、状态切换、可点击标签 |
| 强调标签 | `Tag` / `span` | `.ui-tag .ui-tag--accent` | `--tag-accent-*` | 章节提示、精选、特色说明 |
| 成功标签 | `Tag` / `span` | `.ui-tag .ui-tag--success` | `--tag-success-*` | 成功、完成、通过 |
| 警告标签 | `Tag` / `span` | `.ui-tag .ui-tag--warning` | `--tag-warning-*` | 警告、待处理、提醒 |
| 危险标签 | `Tag` / `span` | `.ui-tag .ui-tag--danger` | `--tag-danger-*` | 错误、风险、危险提示 |
| 输入框 / 文本域 / 选择器 | `Form` + `Input` / `Select` / 原生 `input` | `.ui-input` | `--input-*` | 交互控件仍优先 Antd，`ui-input` 负责统一视觉层 |
| 输入尺寸 | `Input` / `Select` / `textarea` | `.ui-input--sm` `.ui-input--md` `.ui-input--lg` | `--input-height-*` `--input-padding-inline-*` | 表单密度统一靠变体控制 |
| 输入组 | `div` / `label` | `.ui-input-group` `.ui-input-label` `.ui-input-help` `.ui-input-error` | `--input-label-size` `--input-help-size` | 表单说明、错误提示统一结构 |
| 成功态 | 状态文案 / 提示块 | 页面私有状态类 | `--color-success` `--color-success-strong` `--success-alpha-20` `--success-alpha-30` | 文本、背景、边框分开使用 |
| 警告态 | 状态文案 / 提示块 | 页面私有状态类 | `--color-warning` `--color-warning-strong` `--warning-alpha-20` `--warning-alpha-30` | 警告提示和强调信息统一走这一层 |
| 危险态 | 状态文案 / 提示块 | 页面私有状态类 | `--color-danger` `--color-danger-strong` `--danger-soft-alpha-20` `--danger-soft-alpha-30` | 删除、错误、风险提示统一走这一层 |

## Tailwind 与设计系统如何配合

推荐写法不是“只用 Tailwind”或“只用 SCSS”，而是分层配合：

- 布局层：Tailwind
- 语义表现层：`.ui-*` 通用类
- 视觉数值层：token / 主题变量

示例：

```tsx
<section className="mx-auto grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
  <div className="space-y-4">
    <span className="ui-eyebrow">Featured</span>
    <h1 className="ui-page-title">文章标题</h1>
    <p className="ui-muted-text">这里放摘要或补充说明</p>
    <div className="flex flex-wrap gap-2">
      <span className="ui-tag ui-tag--accent">精选</span>
      <span className="ui-tag">React</span>
    </div>
    <div className="flex flex-wrap gap-3">
      <Button className="ui-button-primary">立即查看</Button>
      <button type="button" className="ui-button-secondary">稍后再看</button>
    </div>
    <Input className="ui-input" placeholder="搜索内容" />
  </div>

  <article className="ui-card ui-card--interactive flex flex-col gap-3">
    <h2 className="ui-subsection-title">卡片标题</h2>
    <p className="ui-body-text">卡片正文内容。</p>
  </article>
</section>
```

### 推荐

- 用 Tailwind 写 `flex / grid / gap / padding / margin / responsive`。
- 用 `.ui-*` 类统一标题、正文、按钮、卡片表现。
- 用 `.ui-tag`、`.ui-input` 统一标签和输入类视觉。
- 用 Antd 处理表单、选择器、分页、按钮等成熟交互。
- 需要页面专属氛围时，在页面根类或模块根类下定义模块私有变量，不要再把局部 palette 提升成新的 `:root`。

## 第二阶段落地规则

- 页面里允许写 Tailwind 布局类，不允许重新定义标题基础字号、按钮基础高度、卡片基础圆角。
- 同一类视觉规则在页面/组件里重复出现 3 次以上，必须提升为 token 或 `.ui-*` 通用类。
- 页面私有 SCSS 可以保留氛围背景、装饰、Three.js / Canvas 容器和局部动画，但不应接管基础排版体系。

### 禁止

- 在页面或组件里直接手写颜色、圆角、字号、阴影值。
- 用 Tailwind 直接写固定色值替代 token。
- 用 `div` / `span` 假装按钮，再靠 `onClick` 或 `role="button"` 补语义。
- 为单页临时视觉反复复制一套标题、按钮、卡片样式。

## 换肤策略

当前先做“可换肤架构”，不强制做完整 UI。

`ThemeBridge` 会把用户偏好同步为：

- `data-theme`
- `data-font-size`
- `data-reduced-motion`
- `data-high-contrast`

当前建议：

- 默认主题：`cyberpunk`
- 保留主题：`dark`、`light`
- 风格变体：`minimal`、`vibrant`

不建议当前阶段做的事：

- 让所有 Three.js / Canvas / 作品展示页强行跟随主题切换
- 在没有完成语义 token 治理前就加“主题按钮”

## 开发规则

新增样式时，按这个顺序判断：

1. 是否已经有 `.ui-*` 通用类或 Antd 组件可复用？
2. 这部分是不是应该先用 Tailwind 完成布局，而不是新写一层 SCSS？
3. 是否已经有语义 token 可复用？
4. 如果没有，这是基础 token 还是组件 token？
5. 是否真的需要新 token，还是局部主题色？
6. 是否属于 3D / Canvas / 可视化专属 palette？

### 允许直接写值的例外

- `src/styles/tokens/base.css`
- `src/styles/themes/dark.css`
- `src/styles/themes/light.css`
- `src/styles/themes/accessibility.css`
- 明确作为局部 palette 容器、但已作用域化的 `src/styles/themes/*-pages.css` / `content-features.css` / `code-pages.css` / `legacy-code.css`
- 明确属于 Canvas / Three.js / 图形渐变控制点的文件

### 不允许直接写值的范围

- `src/components/**`
- `src/features/**`
- 普通页面样式文件

## 推荐通用类名

这组类名用于“先统一表现，再逐步组件化”。

适用原则：

- 标题、说明文案、按钮、卡片等高频 UI，优先复用通用类名。
- 类名描述“用途”，不描述“长什么样”。
- 如果页面里重复出现同一类样式，优先沉淀为通用类名，而不是继续复制一份 SCSS。

推荐类名：

- `.ui-page-title`：页面级主标题，用于页面首屏或主模块标题。
- `.ui-section-title`：区块级标题，用于大段内容分组。
- `.ui-subsection-title`：次级标题，用于卡片组、子模块、分栏标题。
- `.ui-body-text`：标准正文。
- `.ui-muted-text`：弱化正文、说明性补充文案。
- `.ui-caption`：更短的说明、时间、元信息。
- `.ui-eyebrow`：小型强调文案，适合分类、章节前缀、标签式提示。
- `.ui-button-primary`：主操作按钮。
- `.ui-button-secondary`：次操作按钮。
- `.ui-button-ghost`：弱操作按钮或工具栏按钮。
- `.ui-button-danger`：危险操作按钮。
- `.ui-card`：标准卡片容器。
- `.ui-card--interactive`：可点击、可 hover 的交互卡片。
- `.ui-card--media-split`：上方媒体、下方正文的卡片骨架。

示例：

```tsx
<section className="ui-card ui-card--interactive">
  <span className="ui-eyebrow">Featured</span>
  <h1 className="ui-page-title">文章标题</h1>
  <p className="ui-muted-text">这里放摘要或补充说明</p>
  <button className="ui-button-primary">立即查看</button>
</section>
```

说明：

- 如果已经在使用 `Antd Button`，优先继续使用组件，不强制替换成原生按钮。
- 通用类名适合落在语义标签上，例如 `h1`、`h2`、`p`、`button`、`section`。
- 通用类名消费的是语义 token，因此后续改主题、改字号、改圆角时会自动跟随。
- 页面布局本身仍优先使用 Tailwind；`.ui-*` 类负责“语义表现”，不是替代布局系统。

## 审计方式

使用脚本：

```bash
pnpm audit:style
```

或：

```bash
pnpm audit:styles
```

脚本会输出：

- 硬编码颜色命中
- 非语义交互元素命中
- token 使用分布

治理节奏建议：

1. 先清 `src/components/**`
2. 再清 `src/features/**`
3. 最后处理 `src/pages/**`
4. 3D / Canvas 单独建专题治理
