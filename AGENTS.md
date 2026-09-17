# AGENTS.md 规则文件

## 项目概述

**Personal Blog/Portfolio** - 基于 React 18 + TypeScript + Vite 的个人博客/作品集网站

### 技术栈
- **前端框架**: React 18 (类组件与函数组件混合)
- **构建工具**: Vite 5.0
- **语言**: TypeScript 5.x
- **路由**: React Router DOM v5 (`BrowserRouter`)
- **状态管理**: 页面局部状态使用 React Hooks；用户偏好使用 `useUserPreferences` + `localStorage`
- **UI 库**: Ant Design v4 + Tailwind CSS v3
- **3D/动画**: Three.js 0.182 + React Three Fiber + React Three Drei + Postprocessing
- **样式**: SCSS + Tailwind CSS
- **HTTP**: Axios

### 路径别名配置
```
@/*         → src/*       (根路径)
@router/*   → src/router/*
@page/*     → src/pages/*
moment      → dayjs       (兼容性别名)
```

---

## 核心架构风格

### 1. 组件架构规范

**混合组件策略**
- **函数组件优先**: 新功能/页面使用函数组件 + Hooks
- **类组件保留**: 核心入口组件（如 App.tsx）保留类组件风格
- **内联子组件**: 复杂页面（如 home/index.tsx）中，子组件（LineDog, InteractiveGrid, UI 等）在文件内部定义

```tsx
// ✅ 推荐：函数组件 + Hooks
export default function Header({ history }: HeaderProps) {
  const [topNum, setTopNum] = useState('-110px')
  // ...
}

// ✅ 保留：类组件风格（仅限核心入口）
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <RouterView routes={routers as any} />
      </BrowserRouter>
    );
  }
}
```

### 2. 路由系统规范

**收口式路由机制**
- 路由统一收口在 `src/router/router_config.ts`
- 页面组件通过 `import.meta.glob` 动态发现，再由 `router_config.ts` 组装
- `/main/**` 下的内容页主要由 `src/data.ts` 菜单结构派生
- `/blog`、`/blog-detail`、`/showcase-*`、`/resume`、`/standard`、`/footmark`、`/aboutme` 等顶层页面在 `router_config.ts` 中显式声明

```typescript
// 动态页面发现
const modules = import.meta.glob('../pages/**/index.{js,jsx,tsx}');

// 目录名会被转换成组件名，例如：
// src/pages/blog-detail/index.tsx -> BlogDetail
```

**添加新页面流程**
1. 创建 `src/pages/{pageName}/index.tsx` 或对应分类目录入口
2. 如果页面属于 `/main/**` 内容体系，在 `src/data.ts` 添加菜单项
3. 如果页面属于顶层直达路由，在 `src/router/router_config.ts` 和必要的导航配置里显式注册

### 3. 状态管理规范

- 菜单、侧栏等布局状态优先放在 `MainLayout` 本地状态中派生
- 跨刷新保留的用户偏好统一使用 `src/hooks/useUserPreferences.ts`
- `useUserPreferences` 兼容旧 `persist:blog-user-preferences` 存储，并支持跨标签页同步
- 不新增 Redux、Context Store 或全局状态模块；确有跨页面状态时先评估页面参数与路由状态

---

## 代码风格规范

### 1. 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件/类 | PascalCase | `LineDog`, `InteractiveGrid` |
| 函数/变量 | camelCase | `handleMouseMove`, `pupilPos` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PARTICLES`, `DEFAULT_TIMEOUT` |
| CSS 类 | kebab-case | `.header-wrap`, `.canvas-container` |
| 文件（组件目录） | kebab-case | `src/components/header/`, `src/pages/code/react/` |
| 文件（页面入口） | index.tsx | `src/pages/home/index.tsx` |

### 2. 注释规范

**简洁为主，关键处点睛**

```tsx
// --- 线条小狗组件 (Maltese Style - 优化版) ---
const LineDog = () => {
  // 尾巴动画循环
  useEffect(() => {
    let animationFrameId;
    let angle = 0;
    // ...
  }, []);

  // 1. 眼睛跟随逻辑
  const updateEye = (eyeX, eyeY) => { /* ... */ };
};
```

**注释风格规则**
- **代码块分隔**：`// --- 标题 ---`
- **行内说明**：`// 描述`
- **避免冗余**：不添加无意义注释
- **复杂逻辑**：仅在需要解释的地方添加

### 3. 导入组织顺序

```tsx
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Float,
  OrbitControls,
} from "@react-three/drei";
import { EffectComposer, TiltShift2, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./index.scss";
```

**顺序规则**
1. React 核心导入
2. 第三方库导入（按功能分组）
3. 本地模块导入
4. 样式文件（最后）

### 4. TypeScript 风格

**宽松类型策略**
```typescript
// ✅ 显式 any 仅在确有必要时使用
interface HeaderProps {
  history: any;
}

// ✅ 简化函数签名
const AAAfn = (data) => ({
    type: AAA,
    data: data
});

// ✅ 接口命名 PascalCase
export interface MenuItem {
    name: string;
    path: string;
    comparison?: ComparisonItem[];
}
```

**配置特点**
- `strict: false`
- `noImplicitAny: true`
- `strictNullChecks: false`
- `allowJs: true`
- `checkJs: false`
- `noUnusedLocals: false`
- `noUnusedParameters: false`

### 5. 代码格式

```tsx
export default function Home({ history }) {
  const autoPlay = () => {
      const myMusic = document.getElementById("myMusic");
      myMusic?.play().catch(e => console.log('Audio play failed', e));
  }

  return (
    <div className="HomeWrap" onClick={autoPlay}>
      {/* 内容 */}
    </div>
  );
}
```

**格式规则**
- **缩进**: 2 空格
- **大括号**: 1TBS (Same Line)
- **空行**: 逻辑块之间单空行
- **引号**: 字符串使用双引号 `"` (JSX) / 单引号 `'`
- **分号**: 不强制

### 6. 样式写法

**SCSS 模块化 + Tailwind CSS 混用**

```tsx
import "./index.scss";

export default function Header() {
  return (
    <div className={'headerWrap'}>
      <div className='header'>
        {/* Tailwind 类名 */}
        <div className="logo flex items-center justify-center">
          {/* 内联样式用于动态效果 */}
          <div style={{
            transform: `translate(calc(-50% + ${mousePos.x * 20}px), ...)`
          }}>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**页面样式优先级**
1. 页面布局、栅格、间距、对齐、响应式：优先使用 Tailwind 风格
2. 标题、正文、按钮、卡片等高频 UI：优先复用 `src/styles/components.css` 中的 `.ui-*` 通用类
   标签、输入框等也优先复用设计系统中的 `.ui-tag`、`.ui-input`
3. 颜色、字号、圆角、阴影、边框：必须优先使用 `src/styles/tokens.css` 和主题变量
4. Ant Design 组件：优先沿用组件本身并通过 token / className 做轻量定制
5. 只有 Tailwind 无法覆盖、且确实属于页面私有视觉时，才新增 SCSS 文件

**禁止事项**
- 禁止在页面/组件里直接手写颜色、字号、圆角、阴影等视觉值
- 禁止新增页面绕开 `docs/style-governance.md` 中的 token / `.ui-*` 体系
- 禁止用 `div` / `span` 充当按钮再配合 `onClick` 或 `role="button"` 补语义
- 非必须不要写行内样式以及使用 `styled-components`

---

## Hooks 使用规范

### 标准 Hooks 用法

```tsx
// 状态管理
const [pupilPos, setPupilPos] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

// 生命周期
useEffect(() => {
    // 清理函数
    return () => cancelAnimationFrame(animationFrameId);
}, []);

// 性能优化
const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({ /* ... */ });
    }
    return temp;
}, [count]);

// 3D 动画帧
useFrame((state) => {
    if (!meshRef.current) return;
    // 动画逻辑
});
```

---

## 项目目录结构

```
src/
├── api/                    # API 接口层
│   └── uploadFile.ts       # 上传接口
├── assets/
│   ├── scss/              # SCSS 样式文件
│   └── fonts/             # 字体文件
├── components/            # 公共组件
│   ├── header/           # 头部组件
│   ├── loading/          # 加载组件
│   └── vinyl/            # 乙烯组件
├── config/                # 配置文件
│   ├── antd_global.tsx   # Ant Design 全局配置
│   └── secret.ts         # 密钥配置
├── data.ts               # 菜单数据结构
├── hooks/                # 自定义 Hooks
│   └── useDeviceType.ts  # 设备类型检测
├── pages/                # 页面组件
│   ├── home/             # 首页
│   ├── main/             # 主内容区
│   ├── resume/           # 简历页
│   ├── standard/         # 代码规范
│   ├── footmark/         # 3D 足迹页
│   ├── aboutme/          # 关于我
│   └── code/             # 技术文章
│       └── react/        # React 系列
├── redux/                # 已移除
├── router/               # 路由配置
│   ├── router_config.ts  # 路由定义
│   └── router-view.tsx   # 路由视图
├── types/                # TypeScript 类型定义
│   ├── global.d.ts       # 全局类型
│   └── vite.d.ts         # Vite 类型
└── utils/                # 工具函数
    ├── axios_instance.ts # Axios 实例
    ├── libs/             # 工具库集合
    └── LoadableComponent.tsx  # 懒加载组件
```

---

## 开发命令

```bash
# 启动开发服务器 (默认端口 8081)
pnpm dev
# 或
pnpm start

# 生产构建
pnpm build

# 预览生产构建
pnpm preview

# 基础质量门禁
pnpm audit:style
pnpm type-check
pnpm lint
pnpm format:check
pnpm ci:check
```

补充约定：

- `vite.config.mjs` 已将默认开发地址配置为 `http://127.0.0.1:8081`，并启用 `strictPort: true`。
- 需要用 Chrome MCP、浏览器调试工具或其他方式查看当前页面实现时，先检查 `8081` 端口对应的开发服务是否已经运行。
- 只有确认 `8081` 没有服务在跑时，才执行 `pnpm dev`，避免重复启动开发服务器。

---

## 新功能开发检查清单

### 添加新页面
- [ ] 在 `src/pages/{dir}/index.tsx` 创建组件
- [ ] 若属于 `/main/**` 内容体系，则在 `src/data.ts` 添加菜单项
- [ ] 若属于顶层页面，则在 `src/router/router_config.ts` / `src/config/siteNavigation.ts` 注册
- [ ] 页面布局优先使用 Tailwind 风格组织
- [ ] 标题/正文/按钮/卡片优先复用 `src/styles/components.css` 中的 `.ui-*` 类
- [ ] 标签/输入框优先复用 `src/styles/components.css` 中的 `.ui-tag`、`.ui-input`
- [ ] 如需样式补充，新增 `index.scss`，且样式只能消费语义 token / 页面主题变量
- [ ] 路由注册路径与导航入口保持一致

### 添加持久化偏好
- [ ] 优先扩展 `src/hooks/useUserPreferences.ts`
- [ ] 明确默认值、非法存储回退与跨标签页同步行为
- [ ] 补充 Hook 单元测试

### 添加工具函数
- [ ] 在 `src/utils/libs/` 添加文件
- [ ] 导出函数使用 `camelCase`
- [ ] 在 `src/utils/libs/index.ts` 导出

### 添加 API 接口
- [ ] 在 `src/api/` 创建接口文件
- [ ] 使用 `async/await` 风格
- [ ] 返回 Promise 类型

---

## 重要注意事项

1. **TypeScript**: 当前配置为 `strict: false`，但 `noImplicitAny: true`；禁止新增隐式 `any`，显式 `any` 仅在确有必要时使用并控制范围。
2. **混合组件架构**: 接受类组件与函数组件并存，不强制统一
3. **自动发现机制**: 页面组件通过 `import.meta.glob` 动态发现；用户偏好统一由 `useUserPreferences` 收口
4. **注释简洁原则**: 只在必要时添加注释，避免冗余
5. **样式分层策略**: 页面布局优先使用 Tailwind 风格，标题/正文/按钮/卡片等高频 UI 优先复用设计系统语义类，SCSS 仅用于复杂样式补充，内联样式仅用于必要的动态效果
6. **路径别名**: 必须使用 `@/` 等路径别名，禁止相对路径滥用
7. **3D 开发**: 使用 `@react-three/fiber` 生态，遵循现有动画模式（useFrame）

8. **沟通语言约定**：所有对用户的回复须使用中文，包含代码评审、问题说明、变更摘要与后续建议等内容。

9. **状态管理真相**：当前应用不使用 Redux；菜单与侧栏状态在 `MainLayout` 内维护，用户偏好由 `useUserPreferences` 持久化。
   - 不在新功能里重新引入 Redux / redux-persist。
   - 只有确实需要跨刷新保留的偏好才进入 Hook，避免扩大持久化状态面。

10. **UI 组件规范（Ant Design 优先）**：涉及可交互控件（选择器、分页、下拉、输入框、按钮等）时，禁止使用原生标签自行实现交互，必须优先使用 Ant Design v4 对应组件，确保一致的交互行为与可访问性。
   - 例如：排序选择使用 `Select`，分页使用 `Pagination`，表单控件使用 `Form`/`Input`/`Button` 等。
   - 原生标签仅用于语义结构或极简静态展示，不得替代可交互控件。
   - 代码评审将据此规范进行校验。
11. **页面开发规范**：新增页面或改版页面必须遵循 `docs/style-governance.md`。页面布局、栅格、间距、响应式优先使用 Tailwind 风格；标题、正文、按钮、卡片等高频 UI 优先复用 `src/styles/components.css` 中的 `.ui-*` 类；颜色、字号、圆角、阴影、边框必须使用语义 token 或页面主题变量。只有 Tailwind 无法覆盖且确属页面私有视觉时，才新增对应的 SCSS 文件；非必须不要写行内样式以及使用 `styled-components`。
12. **设计系统优先规范**：生成新页面、新组件或调整现有页面样式时，默认必须遵循现有设计系统，禁止绕开 token / 语义类单独定义一套视觉规则。
   - 颜色、字号、圆角、阴影、间距、动效等视觉属性，优先使用 `src/styles/tokens.css` 已接入的 token，不得在页面或组件中直接写硬编码值。
   - 标题、正文、说明文案、按钮、卡片、标签、输入框等常见 UI，优先复用现有语义类与组件样式，例如 `ui-page-title`、`ui-section-title`、`ui-body-text`、`ui-muted-text`、`ui-button-primary`、`ui-button-secondary`、`ui-card`、`ui-tag`、`ui-input` 等。
   - 页面私有视觉仅在确有必要时新增模块私有变量，并挂在页面根类或组件根类上；不得把实验色或局部 palette 直接散落在 TSX / SCSS 中。
   - 具体使用规则与对照关系以 `docs/style-governance.md` 为准；生成页面时默认视为必须遵守。
13. **本地调试端口规范**：项目开发服务默认端口为 `8081`，以 `vite.config.mjs` 为准。
   - 使用 Chrome MCP、浏览器开发者工具或其他可视化方式查看页面实现前，先确认 `8081` 端口的服务是否已启动。
   - 若 `8081` 已有可用开发服务，直接复用，不重复执行 `pnpm dev`。
   - 仅在 `8081` 未启动时，才执行 `pnpm dev` 拉起本地服务。
   - 当前默认质量门禁链为 `pnpm type-check`、`pnpm lint`、`pnpm format:check`、`pnpm audit:style`、`pnpm build`；页面人工验收默认走 Chrome MCP，不把 Playwright 作为当前仓库的默认前置依赖。
14. **CSS 变量权限红线**：后续新增或修改样式时，默认按严格权限模型执行。
   - `:root` 只允许出现在 `src/styles/tokens.css`、`src/styles/themes/dark.css`、`src/styles/themes/light.css`、`src/styles/themes/accessibility.css`。
   - `src/pages/**`、`src/components/**`、`src/styles/base.css`、`src/styles/components.css`、`src/styles/themes/*-pages.css`、`src/styles/themes/content-features.css`、`src/styles/themes/code-pages.css`、`src/styles/themes/legacy-code.css` 禁止使用 `:root`。
   - 除 token / 核心主题入口外，禁止定义或覆写 `--raw-*`、`--white-alpha-*`、`--black-alpha-*`、`--font-*`、`--space-*`、`--radius-*`、`--control-*`、`--motion-*`、`--easing-*`、`--color-*`、`--text-*`、`--heading-*`、`--button-*`、`--card-*`、`--tag-*`、`--input-*`、`--bg-*`、`--accent-*`、`--surface-*`、`--brand-*`、`--border-*`、`--status-*`、`--state-*`、`--glass-*`、`--sidebar-*`、`--shadow-*`、`--focus-*`、`--warning-*`。
   - 页面、组件和局部 palette 文件只能定义模块前缀变量或 `--ui-*` 局部适配变量，且变量必须挂在模块根类上，不得挂在全局选择器上。
---

### 错误经验记录规则
在对话过程中，如果遇到错误或失败后成功解决问题，**必须**将解决经验添加到当前项目的 AGENTS.md 文件中。记录格式应包括：
- 问题描述：遇到什么错误或问题
- 解决方法：如何解决的，使用的方法或工具
- 相关文件/命令：涉及的关键文件或命令
- 注意事项：避免踩坑的关键点

这样可以减少下次遇到同样问题时的排查时间，积累项目知识库。

### 错误经验记录

#### 1. 多 agent 并行改文件时 `apply_patch` 上下文失效
- 问题描述：多个 agent 并行治理同一批样式/组件时，主线程按旧上下文继续 `apply_patch`，出现 `Failed to find expected lines`，并不是代码本身有语法问题，而是文件内容已经被其他改动提前改写。
- 解决方法：先重新读取目标文件的最新内容，再基于最新上下文重新生成精确补丁；不要凭上一次读取结果继续硬打 patch。
- 相关文件/命令：`src/components/content-card/index.tsx`、`sed -n '1,220p' ...`、`sed -n '220,520p' ...`、`apply_patch`
- 注意事项：多 agent 模式下，如果多个任务可能触及相邻区域，主线程落补丁前必须先复读当前文件；看到 `apply_patch` 上下文匹配失败时，优先怀疑并行改动导致的上下文漂移，不要直接回退别人代码。

#### 2. 脏工作区里新增文件可能只存在于 index，不在 `HEAD`
- 问题描述：构建报错提示 `Could not resolve "./index.scss"`，但用 `git show HEAD:...` 又找不到对应文件，容易误判成入口引用写错。实际情况是文件是“已暂存新增但工作区缺失”，存在于 index，不存在于 `HEAD`。
- 解决方法：先用 `git status --short` 判断文件是否处于 `A` / `AD` 状态；如果怀疑文件只在暂存区，使用 `git show :路径` 读取 index 版本，而不是只看 `HEAD`。本次在确认老 SCSS 仍含大量硬编码后，没有原样恢复，而是补了一份基于 token 的精简版样式文件。
- 相关文件/命令：`src/pages/showcase-vault/index.tsx`、`src/pages/showcase-vault/index.scss`、`git status --short src/pages/showcase-vault`、`git show :src/pages/showcase-vault/index.scss`
- 注意事项：遇到“入口还在 import，但文件丢失”的问题时，先区分是 `HEAD` 缺失、index 存在，还是工作区真实删除；不要默认用 `HEAD` 判断文件是否曾存在。

#### 3. `rg` 搜索包含括号的字面量时，优先用固定字符串模式
- 问题描述：扫描样式文件里的 `@import url(` 时，直接写 `rg -n '@import url\\(' ...` 触发了 `regex parse error: unclosed group`，因为 `(` 在正则里仍被当作分组起始，转义写法容易出错。
- 解决方法：对这类“只是查字面量，不需要正则能力”的场景，直接使用 `rg -F '@import url(' ...` 做 fixed-string 搜索，稳定且更省心。
- 相关文件/命令：`rg -n -F '@import url(' src --glob '*.{scss,css}'`
- 注意事项：搜索 CSS/SCSS 里的函数、媒体查询、选择器片段时，只要目标字符串里有 `(`、`)`、`[`、`]`、`?`、`+` 等正则敏感字符，优先判断是否可以改用 `rg -F`，不要默认手写正则。

#### 4. `git status` / index 与工作区状态不一致时，先以“实际文件是否存在 + 当前 import 链”为准
- 问题描述：清理遗留 SCSS 时，`test -f`、`git status`、`rg` 的结果一度看起来互相冲突，容易把“仍被组件导入但内容已过时”的文件误判成死文件直接删除。
- 解决方法：先同时检查 1）组件当前是否还在 `import './index.scss'`，2）工作区文件是否真实存在，3）样式内容是否与当前组件结构匹配；如果只是“样式实现过时”，就重写成与当前组件一致的精简版，而不是机械删除。
- 相关文件/命令：`src/components/show-file/index.tsx`、`src/components/show-file/index.scss`、`rg -n "import './index.scss'" src/...`、`test -f ...`、`git status --short`
- 注意事项：脏工作区 + 多 agent 并行时，`git status` 只能说明 index/worktree 差异，不能单独证明文件“已废弃”；删样式文件前必须回看当前 TSX 的真实导入链。

#### 5. `tsc` 验证阶段优先顺手修低风险显式类型问题
- 问题描述：样式治理完成后跑 `pnpm exec tsc --noEmit`，报错 `ThemeBridge` 缺少返回类型注解，导致验证链路中断。
- 解决方法：对这类与当前改动不冲突、修复成本极低的类型错误，直接补显式返回类型，例如 `(): null`，让验证结果更可信。
- 相关文件/命令：`src/theme/theme-bridge.tsx`、`pnpm exec tsc --noEmit`
- 注意事项：如果 `tsc` 暴露的是局部、确定性、低风险问题，优先一并修掉；但如果是大面积类型债，要在结果里明确说明范围，不要顺手扩散改动。

#### 6. 多 agent 并行前先回收已完成线程，避免 `spawn_agent` 触发线程上限
- 问题描述：样式治理阶段为了并行处理多个无依赖任务，继续新增 worker 时出现 `agent thread limit reached (max 6)`，导致本该并行的任务无法启动。
- 解决方法：在新一轮并行前，先确认已有 agent 是否已完成；对已完成且不再需要复用上下文的 agent 及时关闭，或者改为主线程直接接手剩余小任务。
- 相关文件/命令：`spawn_agent`、`wait_agent`、`close_agent`
- 注意事项：项目里适合多 agent 并行，但并行前要先看“线程数上限”和“任务是否真的无依赖”；不要默认无限开新 agent。

#### 7. 批量 `apply_patch` 多文件时，只要一个文件上下文漂移，整组补丁都会失败
- 问题描述：一次性对 `semantic.css`、`components.css`、`home/index.tsx`、`home/index.scss` 落多文件补丁时，`apply_patch` 因 `home/index.tsx` 的旧上下文不匹配直接整体失败，哪怕其他文件的补丁内容本身是正确的。
- 解决方法：看到这类失败后，不要继续按旧 patch 重试；先逐个重新读取本轮涉及的所有目标文件，再按最新上下文重新生成整组补丁，必要时拆成更小的 patch 分批提交。
- 相关文件/命令：`src/styles/tokens/semantic.css`、`src/styles/components.css`、`src/pages/home/index.tsx`、`src/pages/home/index.scss`、`sed -n '860,1060p' ...`、`apply_patch`
- 注意事项：脏工作区里批量 patch 的失败不一定是“补丁写错了”，也可能只是其中一个文件被别的改动提前改写；多文件一起改时，优先保证上下文是同一时刻重新读取出来的。

#### 8. 当前会话没有 `spawn_agent` 时，并行要降级成 `parallel + 主线程落补丁`
- 问题描述：为了满足“多个任务尽量并行”的要求，习惯性想调用 `spawn_agent` 拆分样式治理，但当前工具链并未暴露该能力，导致并行流程中断。
- 解决方法：先检查当前会话真实可用的工具；如果没有 `spawn_agent`，就用 `multi_tool_use.parallel` 并行执行 `sed`、`rg`、`git status` 这类无副作用命令，把真正的 `apply_patch` 写文件操作集中到主线程串行完成。
- 相关文件/命令：`multi_tool_use.parallel`、`functions.exec_command`、`functions.apply_patch`
- 注意事项：用户提出“多 agent”诉求时，也要先确认当前环境到底支持“多线程 agent”还是只支持“多工具并行”；不要把别的会话能力默认套进当前会话。

#### 9. 读取 skill 文件前先确认是项目内 `.agents` 还是用户目录 `$HOME/.agents`
- 问题描述：想读取 `audit-ui` 的 `SKILL.md` 时，先按项目内路径 `.agents/skills/audit-ui/SKILL.md` 去找，结果报 `No such file or directory`，因为这个 skill 实际挂在用户目录，不在仓库内。
- 解决方法：先根据当前会话暴露的 skill 路径判断真实位置；像这次 `audit-ui` 应该读取 `/Users/mac/.agents/skills/audit-ui/SKILL.md`，不要默认拼接成仓库相对路径。
- 相关文件/命令：`/Users/mac/.agents/skills/audit-ui/SKILL.md`、`sed -n '1,220p' ...`
- 注意事项：会话里可用 skill 可能同时来自项目 `.agents`、用户目录 `.agents`、`.codex/skills` 等不同位置；读取前先看完整绝对路径，避免因为路径假设错误浪费一次排查。

#### 10. `index.css` 留下残缺选择器会直接导致构建失败
- 问题描述：整理全局样式入口时，`src/index.css` 曾残留一个不完整的 `html,` 选择器片段，`pnpm build` 会直接报 CSS 解析错误，不是 Vite 或 Tailwind 本身的问题。
- 解决方法：回读 `src/index.css`，删除残缺选择器，只保留真实需要的 `@import` 与 Tailwind 指令，再重新执行 `pnpm build` 验证。
- 相关文件/命令：`src/index.css`、`pnpm build`
- 注意事项：改全局样式入口文件后，不要只看 diff，要再读一次文件首尾确认没有留下半截选择器、半截注释或断裂的规则块。

#### 11. 私有 registry 不可达时，`pnpm remove --lockfile-only` 会卡在重试
- 问题描述：移除 `styled-components` 依赖时执行 `pnpm remove styled-components --lockfile-only`，由于当前环境里的 registry 指向私有源且沙箱内无法解析，命令会持续输出 `ENOTFOUND` 并长时间重试，无法及时结束。
- 解决方法：遇到这种场景不要继续等待，直接手工更新 `package.json` 和 `pnpm-lock.yaml`，删掉目标依赖的 importer 与对应 lock 条目，再用 `pnpm exec tsc --noEmit` / `pnpm build` 做结果验证。
- 相关文件/命令：`package.json`、`pnpm-lock.yaml`、`pnpm remove styled-components --lockfile-only`、`pnpm exec tsc --noEmit`、`pnpm build`
- 注意事项：如果只是维护锁文件且改动范围可控，优先手工 patch；否则会被 registry 重试白白阻塞当前任务。

#### 12. `rg` 一旦写了参数终止符 `--`，后面的 `-g` 会失效并被当成路径
- 问题描述：为了安全搜索变量名，命令写成了 `rg -n -- 'pattern' src -g '*.scss'`，结果 `rg` 报 `-g: No such file or directory`，因为 `--` 之后所有内容都会被当作普通参数，`-g` 不再被识别成选项。
- 解决方法：把 `-g/--glob` 这类选项放到 `--` 前面，例如 `rg -n -g '*.scss' -- 'pattern' src`；如果没有以 `-` 开头的 pattern，也可以直接去掉 `--`。
- 相关文件/命令：`rg -n -g '*.scss' -- 'pattern' src`、`rg -n 'pattern' src`
- 注意事项：后续凡是同时需要“字面量 pattern”与 `-g`、`--glob`、`--type` 等选项时，先检查 `--` 的位置；不要把 glob 选项写到 `--` 后面。

#### 13. 样式审计会把“只作为局部可选覆写入口”的 `--ui-*` 变量也判成未定义
- 问题描述：`components.css` 里像 `var(--ui-button-gap, var(--button-icon-gap))`、`var(--ui-input-text, var(--input-text))` 这类写法，虽然运行时有 fallback，但审计脚本仍会把 `--ui-button-gap`、`--ui-input-text` 等首参数变量记为“仓库中未定义”。
- 解决方法：如果这些 `--ui-*` 确实是设计系统允许的局部适配入口，就在对应组件基类里补一个默认赋值，例如在按钮基类补 `--ui-button-gap: var(--button-icon-gap)`，在标签/输入基类补 `--ui-tag-font-size`、`--ui-input-text` 等默认值；不要为了消警告去把它们提升成全局 token。
- 相关文件/命令：`src/styles/components.css`、`node scripts/audit-style.js`
- 注意事项：审计报“未定义 token”时，先区分它是“真正缺失的全局 token”，还是“组件局部 override 入口没有默认声明”；前者补 token 层，后者补组件基类默认值。

#### 14. Task 板里的样式文件路径可能已经落后于真实代码
- 问题描述：继续执行页面样式治理任务时，`Task.json` / `Task.md` 里仍指向 `src/pages/aboutme/components/AdvancedBackground/index.scss`，但当前工作区里这个文件已经不存在，实际实现已迁到 `index.tsx` 的 Tailwind 风格类名里。
- 解决方法：不要机械按任务板路径直接改文件；先用 `rg --files`、`rg -n`、`git status --short` 核实目标文件是否仍存在、当前组件实际 import 链在哪里，再决定是改现有 TSX、补回样式，还是直接把任务状态同步为已完成。
- 相关文件/命令：`Task.json`、`Task.md`、`src/pages/aboutme/components/AdvancedBackground/index.tsx`、`rg --files src/pages/aboutme/components/AdvancedBackground`、`git status --short src/pages/aboutme/components/AdvancedBackground`
- 注意事项：任务板是执行队列，不一定是源码真相；遇到“任务指向的 SCSS 不存在”时，优先怀疑代码已经提前迁层，而不是默认文件丢失。

#### 14. 全局行为层不能用 `:root[...]` 承载状态选择器
- 问题描述：把 `reduced-motion` 规则从 `accessibility.css` 挪到 `src/styles/global-ui.css` 后，如果继续写成 `:root[data-reduced-motion="true"] *`，`pnpm audit:style` 会直接报“非法 :root”，因为项目硬规则限定只有核心 token / theme 入口文件允许出现 `:root`。
- 解决方法：在 `global-ui.css` 这类全局行为层，改用 `html[data-reduced-motion="true"] *` 之类的根元素属性选择器承载行为状态；不要为了方便继续写 `:root[...]`。
- 相关文件/命令：`src/styles/global-ui.css`、`src/styles/themes/accessibility.css`、`pnpm audit:style`
- 注意事项：凡是从 token/theme 文件拆出来的“全局行为规则”，落到 `global-ui.css`、`components.css`、页面或组件样式时，都要先检查是否仍残留 `:root` 选择器；行为层允许根元素属性选择器，不允许 `:root`。

#### 15. `node -e` 里不要把模板字符串直接塞进双引号 shell 命令
- 问题描述：用 `node -e "..."` 读取 `Task.json` 时，如果内层又写了 `` `${next.id} ${next.title}` ``，`zsh` 会先尝试做 shell 级 `${...}` 展开，导致 `bad substitution`，Node 收到的脚本也会被截坏。
- 解决方法：这类一次性命令优先改成字符串拼接，比如 `next.id + ' ' + next.title`；如果必须用模板字符串，就把整段脚本放进不会被 shell 预展开的安全引号结构里。
- 相关文件/命令：`Task.json`、`node -e "const data=...; console.log(next ? (next.id + ' ' + next.title) : 'none')"`
- 注意事项：后续凡是在 `functions.exec_command` 里写 `node -e`、`ruby -e`、`perl -e` 这类内联脚本，只要出现 `${...}`、反引号或 `$()`，都要先检查是不是会被外层 shell 提前解释；能用普通字符串拼接就不要上模板字符串。

#### 16. 当前仓库默认不以 Playwright 作为门禁前提
- 问题描述：在恢复质量门禁的过程中，曾尝试把 Playwright e2e 纳入默认校验链，但这会额外要求本机安装浏览器二进制，也会引入与当前协作目标无关的环境依赖。
- 解决方法：当前项目默认质量门禁只收口 `type-check`、`lint`、`format:check`、`build`；页面验收优先使用 Chrome MCP。只有用户明确要求恢复 e2e 自动化时，才重新引入 Playwright。
- 相关文件/命令：`package.json`、`pnpm ci:check`、Chrome MCP
- 注意事项：后续如果重新启用 Playwright，需要同时补齐浏览器安装策略、端口占用策略和测试基线，不要只恢复一半配置。

#### 17. `Failed to fetch dynamically imported module` 不一定是页面模块本身丢失
- 问题描述：首页出现 `TypeError: Failed to fetch dynamically imported module: http://localhost:8081/src/pages/home/index.tsx?...`，表面看像 `src/pages/home/index.tsx` 懒加载失败，容易误判成路由映射或页面文件路径错误。
- 解决方法：先用 Chrome MCP 看当前页面的最新 network/console，而不是只盯着报错文案。本次实际失败的是 `node_modules/.vite/deps/@react-three_fiber.js` 和 `@react-three_drei.js`，状态码为 `504 Outdated Optimize Dep`。处理方式是删除 `node_modules/.vite`，停掉旧的 dev server，再用 `pnpm dev -- --force` 强制重建 Vite 预构建依赖缓存。
- 相关文件/命令：`node_modules/.vite`、`lsof -nP -iTCP:8081 -sTCP:LISTEN`、`kill <pid>`、`pnpm dev -- --force`、Chrome MCP Network / Console
- 注意事项：Chrome MCP 如果开启了 preserved requests / messages，会继续显示旧的 504 记录；验收时要以最新一次 reload 的页面快照和最新请求结果为准，不要被历史缓存日志误导。

#### 18. 文档写 `HashRouter`、源码却接了 `BrowserRouter` 时，`/#/...` 会被静默当成首页
- 问题描述：Chrome MCP 直接打开 `http://localhost:8081/#/showcase-vault` 时，地址栏看起来是作品页，但页面实际仍然渲染首页，network 里只加载了 `src/pages/home/index.tsx`，没有去请求 `src/pages/showcase-vault/index.tsx`。
- 解决方法：先同时核对文档约定和入口源码，不要只看路由配置表。本次根因是 `src/App.tsx` 实际使用了 `BrowserRouter`，而项目约定和访问方式都基于 `HashRouter`；把入口改回 `HashRouter` 后，`/#/showcase-vault` 才会按预期匹配到作品页模块。
- 相关文件/命令：`src/App.tsx`、`src/router/router_config.ts`、Chrome MCP `take_snapshot` / `list_network_requests`
- 注意事项：如果 Chrome MCP 里 URL 已经带了 `#`，但页面却始终落到首页，优先怀疑“入口 Router 类型和当前 URL 形态不一致”；不要先去怀疑页面文件缺失或样式没生效。

#### 19. 清理企业 SSO 模板残留时，要追踪完整的引用链确认是否为死代码
- 问题描述：处理 A08 任务时，`secret.ts` 被 `axios_instance.ts` 和 `cookie.ts` 引用，这两个文件又分别被 `api/base-url/index.ts` 和 `utils/libs/validate.tsx` 等文件引用，导致第一眼看认为这些文件都有运行时用途。
- 解决方法：从最外层开始逐级反向搜索引用关系，发现 `api/base-url/index.ts`、`utils/libs/validate.tsx`、`utils/libs/cookie.ts` 这三个文件本身没有被任何其他文件引用，确认它们是死代码。因此可以安全删除整个引用链：`secret.ts` → `axios_instance.ts` + `cookie.ts` → `api/base-url/index.ts` + `utils/libs/validate.tsx` + `utils/libs/cookie.ts`。
- 相关文件/命令：`src/config/secret.ts`、`src/utils/axios_instance.ts`、`src/utils/cookie.ts`、`src/api/base-url/index.ts`、`src/utils/libs/validate.tsx`、`src/utils/libs/cookie.ts`、`grep -r "from.*api/base-url|import.*api/base-url"`、`rm`、`pnpm build`
- 注意事项：清理企业 SSO 模板残留这类历史代码时，不要只看一层引用关系，要完整追踪从配置文件到最外层引用的整个调用链；只有确认整个引用链都是死代码时，才能安全删除。

#### 20. 空目录结构但未注册路由的页面要直接删除，而非补充路由
- 问题描述：处理 A06 任务时，`src/pages/knowledge/` 目录存在且有子目录结构（`advanced/`、`cases/`、`resources/`），容易误以为需要补充路由配置。但实际上所有子目录都是空的，`data.ts`、`router_config.ts`、`siteNavigation.ts` 中也没有任何引用。
- 解决方法：先用 `ls -la` 确认目录结构，再用 `rg` 搜索可能的引用，确认页面确实未被使用后，直接删除整个空目录结构。不要机械地补充路由。
- 相关文件/命令：`src/pages/knowledge/`、`src/data.ts`、`src/router/router_config.ts`、`src/config/siteNavigation.ts`、`ls -la src/pages/knowledge/`、`rm -rf src/pages/knowledge/`
- 注意事项：遇到"目录存在但无路由"的页面，先确认目录是否真的有内容；如果是空目录结构，直接删除即可，不要补充路由配置。

#### 21. 在当前终端环境里不要假设 `rg` 可用，搜索统一走工具层或兼容命令
- 问题描述：为了从 `pnpm lint` 输出中过滤错误，直接在命令里用了 `rg` 管道（`... | rg ...`），结果终端报 `zsh:1: command not found: rg`，导致排查流程中断。
- 解决方法：在当前会话里改用两种稳定方案：1）内容检索优先使用 `Grep` 工具；2）终端过滤用系统自带兼容命令（如 `pnpm lint --quiet`、`grep`、`sed`）替代 `rg`。
- 相关文件/命令：`pnpm lint --quiet`、`Grep` 工具
- 注意事项：后续在 `RunCommand` 里写管道筛选时，先确认命令在当前 shell 可用；需要正则检索优先直接用工具层 `Grep`，不要默认依赖本地 `rg` 二进制。

#### 22. 当前子 agent 模型不支持 `reasoning_effort: medium`
- 问题描述：并行启动只读审计 agent 时，`spawn_agent` 指定 `reasoning_effort: medium`，四个任务全部失败，并提示当前 `glm-5.3` 模型不支持该推理档位。
- 解决方法：去掉 `reasoning_effort` 覆盖参数，让子 agent 继承父线程默认配置后重试；不要继续切换其他未确认的档位。
- 相关文件/命令：`multi_agent_v1.spawn_agent`、`reasoning_effort`
- 注意事项：子 agent 模型能力与父线程可能不同；显式覆盖推理档前应确认该模型支持列表，优先使用默认继承配置。

#### 23. 沙箱内启动 / 访问本地 preview 端口会被 EPERM 或连接拒绝拦截
- 问题描述：执行 `pnpm preview --host 127.0.0.1 --port 4173` 时，沙箱内监听端口报 `listen EPERM`；服务用提升权限启动后，沙箱内 `curl 127.0.0.1:4173` 又报 `Failed to connect`。
- 解决方法：preview 启动和本机 HTTP 只读验证都需要按流程申请提升权限；先提升启动 preview，再提升执行 `curl` 验证 `/` 与深链路由，结束后中断 preview 进程。
- 相关文件/命令：`pnpm preview --host 127.0.0.1 --port 4173`、`curl http://127.0.0.1:4173/blog`
- 注意事项：不要把 `EPERM` 误判为端口占用或 Vite 配置问题；先确认是否为沙箱网络 / 监听权限限制。

#### 24. `node -e` 内联脚本里的正则和引号会被 zsh 预解析
- 问题描述：把包含正则字面量、嵌套引号或 `$` 的 Node 脚本直接塞进 `node -e "..."` 时，zsh 会先解释特殊字符，导致正则被截断或 shell 报解析错误。
- 解决方法：一次性检查 `Task.json` 这类脚本优先使用 `require()` / 字符串拼接；必须写正则或 `$` 时，先把脚本落到临时文件再执行，避免外层双引号与内层语法互相干扰。
- 相关文件/命令：`Task.json`、`node -e`
- 注意事项：内联脚本越复杂越容易被 shell 改写；验证任务队列这类低风险脚本也应优先选择无歧义写法。

#### 25. 同一份文件不要把 Delete 与 Add 放进同一个 `apply_patch`
- 问题描述：在同一组多文件补丁里，对同一个目标文件同时执行删除与新增相关段落时，一旦其中一个上下文漂移，整组补丁会原子失败，容易误判为源码语法问题。
- 解决方法：按文件拆分补丁；锁文件这类重复键较多的文件，进一步按 6 个精确段落逐段执行 `apply_patch`，每段成功后再检查下一处。
- 相关文件/命令：`pnpm-lock.yaml`、`apply_patch`
- 注意事项：手工维护锁文件时先核对 importer、resolution、snapshot 三类条目；不要在一个大补丁里混合过多上下文。

#### 26. Framer `useScroll` 的 offset 语法不能沿用 GSAP / IntersectionObserver 习惯
- 问题描述：迁移滚动动画时沿用 `top 100%` / `top 35%`，TypeScript 会报 offset 类型不匹配；这不是 Framer 版本问题，而是它的边缘语法使用 `start`、`end`、`center` 等命名。
- 解决方法：使用 Framer 导出的 `UseScrollOptions` 收窄自定义 hook 参数，并把默认区间改成 `start end` → `start center`。
- 相关文件/命令：`src/hooks/useScrollDrivenAnimation.ts`、`pnpm exec tsc --noEmit`
- 注意事项：迁移动画库时先确认目标库的 API 语义；仅加 `as any` 或强行断言会掩盖真实运行时问题。

#### 27. Chrome 地址栏 `typeText` 可能被搜索提供商标点改写
- 问题描述：用键盘向 Chrome 地址栏输入 `http://127.0.0.1:8081/footmark` 时，冒号和斜杠被当前搜索输入流吞掉，最终跳到搜索页并把本地地址改写成错误查询串。
- 解决方法：先定位地址栏元素，再用 `setValue` 直接填入完整 URL 后回车；成功后以地址栏真实 value 为准确认，而不是只看窗口标题。
- 相关文件/命令：Chrome Computer Use、`http://127.0.0.1:8081/footmark`
- 注意事项：本地路由验收若出现奇怪的搜索引擎跳转，先读取地址栏当前值，再决定是否重试；不要误判为 Vite 服务不可用。

#### 28. Vitest 精准执行要用 `pnpm exec vitest run`
- 问题描述：执行 `pnpm test -- tests/pages/footmark-console.test.tsx --run` 时，额外 `--` 会让参数透传形态不符合预期，结果跑完整个测试集，容易把其他用例输出误认为目标文件失败原因。
- 解决方法：精准执行改为 `pnpm exec vitest run tests/pages/footmark-console.test.tsx`；确需使用脚本包装时先确认 pnpm 参数透传后的最终命令。
- 相关文件/命令：`tests/pages/footmark-console.test.tsx`、`pnpm exec vitest run`
- 注意事项：判断聚焦测试是否生效，先看 Vitest 输出的测试文件数量，再分析失败原因。

#### 29. 从 Stylelint 修复结果生成 `apply_patch` 时要去掉行号范围头
- 问题描述：把 Stylelint `--fix` 生成的 unified diff 直接转换成 `apply_patch` 格式时，保留 `@@ -17,8 +17,8 @@` 这类范围头会被补丁解析器当作上下文，报“找不到上下文”。
- 解决方法：先在 `/private/tmp` 生成修复参考文件并执行 Stylelint；再生成 unified diff，并把每段 hunk 头替换成裸 `@@`，最后通过 `apply_patch` 应用到仓库文件。
- 相关文件/命令：`src/pages/footmark/index.css`、`src/pages/footmark/map.css`、`src/pages/footmark/detail.css`、`stylelint --fix`、`apply_patch`
- 注意事项：不要在仓库里直接执行格式化修复；参考文件放临时目录，仓库落盘仍必须经过 `apply_patch`。

#### 30. 格式化临时副本必须显式传入仓库 Prettier 配置
- 问题描述：对 `/private/tmp` 里的 TSX 副本执行 Prettier 时，Prettier 找不到仓库根 `.prettierrc`，按默认双引号和分号格式生成补丁，导致仓库文件再次检查失败。
- 解决方法：临时文件格式化命令显式加 `--config .prettierrc`，确认临时结果与仓库配置一致后再生成 `apply_patch`。
- 相关文件/命令：`.prettierrc`、`src/pages/footmark/index.tsx`、`tests/pages/footmark-console.test.tsx`
- 注意事项：凡是脱离仓库目录处理副本，都要显式带上配置文件；不能假设 Prettier 会向上查找仓库配置。

#### 31. 手工把函数改成 `useCallback` 时必须同步修改签名与闭合
- 问题描述：把 `syncMapState` 从普通函数改成 `useCallback` 时，只补了外层调用而没有把参数列表包成箭头函数签名，临时副本触发 TypeScript 解析错误；随后又在原 `) =>` 未删除时插入新签名，出现重复闭合。
- 解决方法：一次性确认结构为 `useCallback((args) => { ... }, [deps])`，删除旧闭合后再复制到临时文件，用 `prettier --config .prettierrc` 验证语法并生成 `apply_patch`。
- 相关文件/命令：`src/pages/footmark/components/FootmarkMapScene.tsx`、`prettier --config .prettierrc`
- 注意事项：手工重构回调包装时先画清括号配对；不要在语法已损坏的文件上继续叠加格式化补丁。

#### 32. Footmark 必须使用真实 AMap 且缺失 Key 时显式报错
- 问题描述：本地启动 `/footmark` 后地图显示“未配置 VITE_AMAP_KEY”，检查发现 `.env.development`、`.env.production`、`.env.test` 都没有该变量；随后尝试的 SVG 本地降级方案被用户明确拒绝。
- 解决方法：只保留真实 AMap 加载逻辑；缺失 Key 时显示错误与重试入口，并把历史源码中的 Key 迁移到被 Git 忽略的 `.env.local`。
- 相关文件/命令：`.env.local`、`.env.development.example`、`.env.production.example`、`src/pages/footmark/components/FootmarkMapScene.tsx`
- 注意事项：不要为 Footmark 增加无 Key 替代地图；配置缺失应显式暴露，真实 Key 不得写入示例文件或提交到仓库。

#### 33. 迁移地图配置时要同时搜索 Git 历史里的硬编码 Key
- 问题描述：当前 `.env.*` 均没有 `VITE_AMAP_KEY` 时，容易直接判断 Key 不存在；但旧版 `src/pages/footmark/compont/map/index.jsx` 曾把 AMap Key 硬编码在源码常量 `KEY` 中，重构后该配置没有迁移。
- 解决方法：用 `git log --all -- src/pages/footmark` 找历史提交，再用 `git ls-tree -r` 定位旧组件 blob，只查看脱敏后的 `const KEY` 与 `AMapLoader.load` 上下文；确认后把 Key 迁移到被 `.gitignore` 忽略的 `.env.local`，不在输出和补丁展示中泄露。
- 相关文件/命令：`.env.local`、`.gitignore`、`git ls-tree -r`、`git show <blob>`、`src/pages/footmark/components/FootmarkMapScene.tsx`
- 注意事项：“当前配置不存在”不等于“项目从未配置过”；迁移第三方地图时必须检查旧实现和历史构建产物来源。

#### 34. 当前 `apply_patch` 新增文件格式不使用 `@@`
- 问题描述：为 `.env.local` 动态生成新增文件补丁时沿用旧格式，在 `*** Add File:` 后写了 `@@`，解析器报“Invalid patch hunk”。
- 解决方法：先用 `/private/tmp` 的无敏感测试文件确认当前语法；新增文件格式应为 `*** Begin Patch`、`*** Add File: path`、`+内容`、`*** End Patch`，中间不写 `@@`。
- 相关文件/命令：`.env.local`、`apply_patch`
- 注意事项：动态生成补丁时不要为了调试输出真实 Key；先用占位内容验证格式再执行敏感写入。

#### 35. Vitest mock 的 AMap 构造函数必须可用 `new` 调用
- 问题描述：为地图限制逻辑新增测试时，用箭头函数实现 `vi.fn()` 后交给 `new AMap.Map()` / `new AMap.Bounds()` 调用，测试报 “is not a constructor”。
- 解决方法：把 `Bounds`、`Map`、`Marker`、`Pixel`、`Polyline` 的 mock 实现改成命名普通函数并返回对象，保持可以被 `new` 调用，同时继续用 `vi.fn()` 收集参数。
- 相关文件/命令：`tests/pages/footmark-map-scene.test.tsx`、`pnpm exec vitest run tests/pages/footmark-map-scene.test.tsx`
- 注意事项：mock 浏览器 SDK 时先确认业务代码使用 `new` 还是普通调用；箭头函数即使包在 `vi.fn()` 里也不能充当构造函数。

#### 36. 删除地图程序性缩放后要同步收敛回调参数
- 问题描述：把城市切换从 `setZoomAndCenter` 改成 `setCenter` 后，`syncMapState` 的 `nextQuality` 参数不再使用，`pnpm exec tsc --noEmit` 报未使用参数。
- 解决方法：同步删除回调签名、初始化调用、响应式调用里的 `quality` 参数，并清理 effect 依赖，再重跑聚焦测试、类型检查、格式检查和构建。
- 相关文件/命令：`src/pages/footmark/components/FootmarkMapScene.tsx`、`pnpm exec tsc --noEmit`
- 注意事项：删除实现细节时先沿调用链搜索参数和依赖；不要只改函数体导致类型检查中断。

#### 37. 私有 registry 不可达时优先手工 prune lockfile
- 问题描述：移除 Redux 相关依赖后执行 `pnpm install --lockfile-only --ignore-scripts`，持续报 `registry.npmmirror.com ENOTFOUND` 并长时间重试，阻塞重构验证。
- 解决方法：停止等待 registry，手工删除 `package.json` 依赖与 `pnpm-lock.yaml` 中对应 importer、package、snapshot 条目，再用本地 `pnpm exec vitest`、`pnpm type-check`、`pnpm build` 验证。
- 相关文件/命令：`package.json`、`pnpm-lock.yaml`、`pnpm install --lockfile-only --ignore-scripts`
- 注意事项：只有依赖删除范围清晰且本地 node_modules 可继续支撑验证时才手工 prune；新增或升级依赖仍应等待可用 registry 后由包管理器维护。

#### 38. 页面 palette 不再允许通过全局聚合入口加载
- 问题描述：`src/styles/palettes.css` 会把 Blog、Footmark、Showcase 等页面私有变量全部并入首页 CSS，造成首页加载大量无关样式。
- 解决方法：删除全局 palette 聚合入口和 `theme.css` 重复导入，把对应 `themes/*-pages.css`、`content-features.css`、`code-pages.css`、`legacy-code.css` 移到实际页面或组件使用点导入。
- 相关文件/命令：`src/index.css`、`src/pages/blog/index.tsx`、`src/pages/footmark/components/FootmarkCityDetail.tsx`、`src/pages/showcase-*/index.tsx`
- 注意事项：新增页面私有变量必须挂页面/组件根类，并由该路由的使用点导入；不要重新创建全局 palette 聚合文件。

#### 39. 派发 agent 前不要假设当前模型支持 reasoning effort 覆盖
- 问题描述：并行审计时给 `spawn_agent` 传了 `reasoning_effort: "medium"`，但当前默认模型是 `glm-5.3`，返回 “Supported reasoning efforts” 空列表，两个 agent 均未启动。
- 解决方法：去掉 `reasoning_effort` 参数继承当前配置后重新派发，两个只读审计 agent 正常启动。
- 相关文件/命令：`multi_agent_v1.spawn_agent`
- 注意事项：模型能力存在会话差异；除非用户明确要求模型/推理覆盖，默认省略模型与 reasoning 参数，失败后先降级为继承配置重试。

#### 40. `Task.json` 存在重复 ID 时不能用裸状态行打补丁
- 问题描述：想把 AR03 / AR05 标记为完成时，只按 `"isDone": true` / `"status": "cancelled"` 生成无上下文补丁，结果命中文件中第一处待办 CSS13，造成任务状态误改。
- 解决方法：立即回读目标区域，带 `id`、`title`、`priority` 的完整上下文分别修正 CSS13、AR03、AR05，再重新检查待办队列。
- 相关文件/命令：`Task.json`、`apply_patch`
- 注意事项：任务板历史队列里同一 ID 可能出现多次；更新状态时必须以 title + 相邻字段确认唯一目标，不能只匹配状态行。

#### 41. 删除 multiline CSS custom property 不能只删首行
- 问题描述：token 减肥脚本按行匹配 `--name:` 删除 multiline gradient token 时，只删除了首行，留下 `135deg, var(...)` 续行，导致 `tokens.css` 语法解析失败。
- 解决方法：格式检查暴露后续行后，删除整个残留声明和已空的组件 token 注释块，再重跑 Prettier、Stylelint、样式审计和构建。
- 相关文件/命令：`src/styles/tokens.css`、`pnpm format:check`
- 注意事项：自动删 custom property 前先判断值是否跨行；要么按完整声明区间删除，要么删除后立即用 CSS parser / Prettier 验证。

#### 42. `prettier --list-different` 找到差异时退出码是 1
- 问题描述：用 Node `spawnSync` 调 `prettier --list-different` 时把退出码 1 当作命令失败，导致格式化补丁没有生成。
- 解决方法：按 Prettier CLI 语义把 `0` 视为无差异、`1` 视为存在差异，解析 stdout 文件列表后继续生成格式化补丁。
- 相关文件/命令：`prettier --list-different`、`apply_patch`
- 注意事项：包装 CLI 时先确认“非零退出码”是错误还是有效结果，不能统一按命令崩溃处理。

#### 43. Markdown 内容 slug 必须全小写并使用连字符
- 问题描述：第一批 React 教程迁移后，`pnpm check:content` 报出 `react-customHooks`、`react-useEffect` 等 9 个 slug 不符合小写字母/数字/连字符规则。
- 解决方法：统一转换为 `react-custom-hooks`、`react-use-effect` 等形式，并同步页面 wrapper、内容元数据，再重新执行 `build:content-meta` 与 `check:content`。
- 相关文件/命令：`src/content/react/*.md`、`src/pages/code/react/*/index.tsx`、`pnpm check:content`
- 注意事项：新增 Markdown 时 frontmatter slug 不要沿用目录 camelCase 命名；路由 wrapper 与生成元数据必须一起核对。

#### 44. 同一个文件不能在一个 `apply_patch` 里先 Delete 再 Add
- 问题描述：迁移教程页面时把“删除旧 TSX、新增薄 wrapper”写在同一个补丁里，`apply_patch` 报 “multiple operations target ...”，整组补丁未落地。
- 解决方法：拆成“新增 Markdown → 删除旧入口 → 新增 wrapper”多次补丁；每次失败后先确认没有半落地状态再重试。
- 相关文件/命令：`src/pages/code/react/*/index.tsx`、`apply_patch`
- 注意事项：替换整文件时不要在同一补丁中对同一路径做互斥操作；必要时用删除和新增两个独立补丁。

#### 45. 扩展 Markdown block 类型时必须同步所有渲染分支
- 问题描述：新增 table block 后，测试期望与 TypeScript 类型一度少了单元格层级；`MarkdownTutorial` 也因外层容器缺 key 触发 ESLint error。
- 解决方法：将 table 类型定义为 `header: InlineNode[][]`、`rows: InlineNode[][][]`，同步教程渲染器与 Blog 详情渲染器，并给迭代根节点补 key。
- 相关文件/命令：`src/features/content/contentIndex.ts`、`src/components/markdown-tutorial/index.tsx`、`src/pages/blog-detail/index.tsx`
- 注意事项：共享 parser 新增 block 后，先枚举所有 `ContentBlock` 消费者；类型层级和渲染分支要一起更新，并补聚焦测试。

#### 46. 统一响应式断点时 JS 边界要和 CSS 包含语义对齐
- 问题描述：把 Home 特效阈值从 `>900` 改为 `>1024` 后，jsdom 默认宽度正好是 1024，`hero-fx` 不渲染导致单测失败。
- 解决方法：与 Tailwind `min-width: 1024px` 的包含语义对齐，改为 `window.innerWidth >= 1024`，同时把 CSS/JS 里的 640、720、979、1100、1200 收敛到 480/768/1024/1280。
- 相关文件/命令：`tailwind.config.js`、`src/pages/home/index.tsx`、`src/hooks/usePerformanceTier.ts`
- 注意事项：统一断点不能只替换数字；`min-width/max-width` 与 JS `>=/>` 的边界包含关系必须一致，并跑响应相关测试。

#### 47. 拆分巨石 CSS 必须按完整规则块迁移
- 问题描述：继续拆分 Home 样式时，如果按行号或简单字符串切块，容易把跨行选择器、multiline gradient 和 `@media` 嵌套规则切断，导致样式解析失败或响应式规则丢失。
- 解决方法：用括号深度解析完整 top-level rule；遇到 `@media` 先拆出嵌套规则，再按 section 归属迁移，最后用 Prettier、Stylelint、样式审计和构建验证。
- 相关文件/命令：`src/pages/home/styles/experiments.css`、`src/pages/home/styles/showcase.css`、`pnpm lint:style`
- 注意事项：拆分后要确认原文件删除、入口 import 更新、每个媒体查询内的规则仍归属正确；不要用固定行号作为 CSS 边界。

#### 48. 本机脚本清空白要显式使用 C locale 并过滤已删除路径
- 问题描述：用 Perl 清理尾随空白时继承 `C.UTF-8` 触发 locale panic；同时脏工作区里 `git diff --name-only` 包含大量已删除文件，直接遍历会报 “No such file or directory”。
- 解决方法：对 Perl 显式设置 `LC_ALL=C LANG=C`，并先用 `test -f` 或 `Path#is_file` 过滤；清理后必须重跑 `git diff --check`。
- 相关文件/命令：`git diff --name-only`、`LC_ALL=C perl -pi -e 's/[ \t]+$//'`、`git diff --check`
- 注意事项：不要假设 diff 列表里的路径都存在；macOS 本机没有对应 locale 时，批量文本命令要显式降级到 C locale。

#### 49. 拆 CSS 时逗号选择器首行不能被当作完整规则
- 问题描述：按“每行括号深度是否回到 0”切分 CSS 时，`.selector-a,` 这类逗号首行没有 `{`，被误判为完整规则，拆分后留下悬空选择器并吞掉后续 `@media`，导致移动端规则整体失效。
- 解决方法：解析规则必须等到遇到闭合 `}` 才 flush；逗号选择器跨行时以完整 `{...}` 为单位迁移。发现 selector 中出现 `@media` 立即停止并回读源文件。
- 相关文件/命令：`src/pages/home/styles/experiments.css`、PostCSS 解析检查、`pnpm build`
- 注意事项：Stylelint 当前不一定捕获该形态，拆分后要用 PostCSS 遍历普通 rule selector，禁止包含 `@` at-rule 片段。

#### 50. GitHub TLS 失败时可用官方离线安装器兜底安装 UI/UX Pro Max
- 问题描述：执行 `npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max` 时，GitHub clone 在 TLS 握手阶段报 `LibreSSL SSL_connect: SSL_ERROR_SYSCALL`，直接重试与 codeload 下载均不可用。
- 解决方法：改用官方 `npx -y uipro-cli init --ai codex --offline --force` 从 npm 包内置模板安装；随后用 `npx -y skills list --json` 确认项目级 `.agents/skills/ui-ux-pro-max` 已被识别，并运行 skill 自带 `scripts/search.py --design-system` 验证数据和 Python 依赖。
- 相关文件/命令：`.agents/skills/ui-ux-pro-max/SKILL.md`、`.codex/skills/ui-ux-pro-max/SKILL.md`、`skills-lock.json`、`npx -y uipro-cli init --ai codex --offline --force`
- 注意事项：`uipro-cli` 生成的 `.codex` 模板与 GitHub 源码版 `.agents` / `.claude` 内容不同；验收以 `skills list` 识别的 `.agents` 源码版为准，不要把两套目录互相覆盖。

<!-- vnext:start -->
## Deploy with vnext

This project is linked to vnext.

- Project ID: `p_6kgrxxp32w58`
- Config: `.vnext/config.json`
- Deploy: `vnext deploy`

<!-- vnext:end -->
