# 严格 CSS 变量治理规范

这份文档是 `docs/style-governance.md` 的严格执行版，重点解决三个问题：

- `:root` 只能在哪里出现
- 全局 token 只能在哪里定义
- 页面/组件层允许改哪些变量，禁止改哪些变量

## 1. 权限模型

把 CSS 变量理解成“有权限边界的配置”，不要把它当成“随手定义的局部常量”。

### 一级：全局基础值

文件：

- `src/styles/tokens/base.css`

职责：

- 只定义原始值
- 不表达业务语义

允许：

- `--raw-*`
- 透明度层
- 字体、字号、字重、圆角、间距、阴影、动效尺度

禁止：

- `--color-*`
- `--button-*`
- `--card-*`
- 页面私有变量

### 二级：全局语义与组件 token

文件：

- `src/styles/tokens/semantic.css`

职责：

- 把原始值翻译成用途
- 定义共享组件基线

允许：

- `--color-*`
- `--text-*`
- `--heading-*`
- `--button-*`
- `--card-*`
- `--tag-*`
- `--input-*`
- 少量兼容别名，例如 `--bg-primary`

禁止：

- 页面私有变量
- 组件私有变量
- 业务场景耦合变量，例如 `--home-*`、`--about-*`

### 三级：主题覆盖

文件：

- `src/styles/themes/dark.css`
- `src/styles/themes/light.css`
- `src/styles/themes/accessibility.css`

职责：

- 覆盖 token 的值
- 管理 `data-theme`、`data-font-size`、`data-high-contrast`、`data-reduced-motion` 对应的主题差异

允许：

- `:root`
- `:root[data-theme="..."]`
- `:root[data-font-size="..."]`
- `:root[data-high-contrast="true"]`
- `:root[data-reduced-motion="true"]`

禁止：

- 定义业务结构类
- 把页面布局规则直接写进主题文件

补充边界：

- `src/styles/themes/*-pages.css`、`content-features.css`、`code-pages.css`、`legacy-code.css`、`legacy-shell.css` 不属于这一级
- 这些文件即使位于 `themes/` 目录，也只能按“局部层”处理，禁止使用 `:root`

### 四级：共享样式层

文件：

- `src/styles/components.css`
- `src/styles/global-ui.css`
- `src/styles/primitives.css`
- `src/styles/antd-overrides.css`
- `src/styles/theme.css`
- `src/styles/palettes.css`

职责：

- 消费 token
- 组织 reset、基础排版、共享组件类、Antd 覆写

硬规则：

- 禁止出现 `:root`
- 禁止定义新的全局 token
- 允许在类选择器内部使用局部适配变量，例如 `--ui-card-padding`
- `theme.css` 只允许聚合 token / 真正的 theme 文件
- `palettes.css` 只允许聚合页面 / feature / legacy palette 文件

### 五级：页面 / 组件局部层

文件：

- `src/pages/**/*.scss`
- `src/components/**/*.scss`

职责：

- 只处理模块私有视觉
- 只做局部变量适配，不得回写全局系统

硬规则：

- 禁止 `:root`
- 禁止 `html` / `body` 级变量定义
- 禁止新增全局 token
- 局部变量必须挂在模块根类或局部类上

## 2. `:root` 允许清单

只有下面这些文件允许出现 `:root`：

- `src/styles/tokens/base.css`
- `src/styles/tokens/semantic.css`
- `src/styles/themes/dark.css`
- `src/styles/themes/light.css`
- `src/styles/themes/accessibility.css`

除此之外，一律视为违规。

## 3. 页面 / 组件允许定义什么变量

### 允许的模块私有变量

推荐统一为“模块前缀”：

- 页面：`--home-*`、`--blog-*`、`--about-*`、`--footmark-*`
- 组件：`--content-card-*`、`--media-card-*`、`--tilt-*`
- 共享 palette：`--article-*`、`--code-page-*`、`--beautify-code-*`、`--main-shell-*`、`--header-shell-*`

这些变量只能服务当前模块，不能假装自己是全站 token。

### 允许的设计系统局部适配变量

这些变量用于“消费共享组件时做局部微调”，允许在模块根类上覆写：

- `--ui-card-padding`
- `--ui-button-*`
- `--ui-tag-*`
- `--ui-input-*`

使用原则：

- 必须挂在模块根类上
- 只能影响当前模块
- 不得在 `:root` 定义

## 4. 页面 / 组件禁止定义什么变量

### 禁止定义的全局语义前缀

以下前缀只允许出现在 token 层或 theme 层：

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

### 禁止覆写的共享基线

以下变量一旦出现在页面/组件层，默认视为高风险违规：

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

## 5. 主题切换规则

如果后续接入一键换肤，必须遵守下面的单入口原则：

- 主题状态由 `ThemeBridge` 或等价主题桥接层控制
- 页面禁止自己增加第二套 `data-theme`
- 主题只改 token 值，不改业务结构
- 页面和组件继续只消费语义 token

## 6. 审计脚本要求

`scripts/audit-style.js` 至少要覆盖下面 7 类问题：

1. 非法 `:root`
2. 非授权文件里定义全局 token
3. 非授权文件里覆写高风险共享基线 token
4. 使用了仓库中不存在的 CSS 变量
5. 业务层硬编码颜色
6. 非语义交互实现，例如 `div/span + onClick`
7. 未命名空间化的局部变量

建议把结果分成两级：

- `error`
  - 非法 `:root`
  - 定义全局 token
  - 覆写高风险共享基线 token
  - 使用未定义 token
- `warning`
  - 硬编码颜色
  - 非语义交互
  - 仍未命名空间化的局部变量

## 7. 执行要求

新增页面、改版页面、重构组件、调整共享样式时，默认流程：

1. 先看 `docs/style-governance.md`
2. 涉及变量定义权限时，再看本文件
3. 修改后运行 `pnpm audit:style`
4. 如果新增的是共享模式，优先沉淀到 `semantic.css` 或 `components.css`

## 8. 当前仓库的治理口径

这份规范优先用于“后续新增和重构”。

对于历史页面：

- 可以先保留已有局部变量
- 但禁止继续新增不合规写法
- 审计脚本应持续报告存量问题，作为后续治理清单
