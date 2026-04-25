# 任务说明：性能优化专项

## 文档定位

- `Task.json`：当前仓库的唯一执行队列，任务状态以它为准
- `Task.md`：本次性能优化专项的说明文档，用于沉淀问题、方案、验收标准与执行顺序

## 背景

当前项目已经具备完整的页面体系、内容体系与作品页能力，但从实际代码结构和构建结果看，存在以下几类高优先级优化空间：

1. 首页首屏资源偏重，影响首次可见速度
2. Vite 分包策略过粗，大型依赖被固定打进超大 chunk
3. 启动链路存在低价值全局逻辑，增加首屏初始化负担
4. 自动化回归保护偏弱，后续优化容易引入回归

本轮优化不追求一次性重构全站，而是优先处理投入产出比最高的事项。

## 当前问题

### P01 首页首屏资源偏重

- **现象**：
  首页入口同步引入了 `@react-three/fiber`、Ant Design、首页交互组件与部分重逻辑，导致首屏渲染成本偏高。
- **影响**：
  首次可见内容变慢，低性能设备体验不稳定，首页后续继续叠加效果时维护成本会持续上升。
- **相关文件**：
  - `src/pages/home/index.tsx`
  - `src/pages/home/components/HeroCore.tsx`

### P02 Vite 分包策略过粗

- **现象**：
  当前 `vite.config.mjs` 采用固定对象式 `manualChunks`，将 `three`、`antd`、动画库等整组依赖打成大包。
- **影响**：
  首页或普通页面即使只使用其中一部分能力，也会承担整组依赖的下载和解析成本。
- **相关文件**：
  - `vite.config.mjs`

### P03 启动链路存在低价值同步逻辑

- **现象**：
  应用启动时同步执行 `performanceMonitor.init()`，同时 `App.tsx` 中还存在 `window.$$create` 这类当前未发现消费方的全局挂载。
- **影响**：
  首屏初始化路径变长，增加理解成本，也放大后续维护噪音。
- **相关文件**：
  - `src/index.tsx`
  - `src/App.tsx`
  - `src/utils/create-name/index.ts`
  - `src/utils/performanceMonitor.ts`

### P04 自动化回归保护不足

- **现象**：
  当前虽然已有 `vitest` 与少量测试，但首页、博客核心交互、路由懒加载与作品页主流程缺少足够的 smoke 级验证。
- **影响**：
  后续做首屏优化、分包优化、重构拆分时，容易引入空白页、交互失效或路由回归。
- **相关文件**：
  - `package.json`
  - `tests/`

### P05 项目规范主要依赖文档，缺少自动约束

- **现象**：
  当前项目规范大量沉淀在 `AGENTS.md`、`CLAUDE.md`、`docs/style-governance.md` 等文档中，但 `.eslintrc.json` 与 `.stylelintrc.json` 仍以通用规则为主，尚未把“路径别名优先、导入顺序、禁止扩散 any、禁止页面层硬编码视觉值、限制 inline style”等核心约束自动化。
- **影响**：
  规范执行依赖人工自觉与评审记忆，容易出现“文档有规定、代码里仍持续偏离”的情况，治理成本会随时间持续升高。
- **相关文件**：
  - `.eslintrc.json`
  - `.stylelintrc.json`
  - `AGENTS.md`
  - `docs/style-governance.md`

### P06 样式体系双轨并存，主规范不够单一

- **现象**：
  当前 `src/index.css` 同时导入 `styles/tokens/*`、`styles/1_tokens/*`、`styles/2_globals/*`、`styles/3_components/*`、`styles/components.css`、`styles/themes/*` 等多套层级，说明样式体系仍处于“新旧并存”状态。
- **影响**：
  开发者不容易判断“变量该加在哪层、组件样式该放哪层、页面主题该落哪层”，容易继续叠加历史包袱。
- **相关文件**：
  - `src/index.css`
  - `src/styles/tokens/*`
  - `src/styles/1_tokens/*`
  - `src/styles/2_globals/*`
  - `src/styles/3_components/*`
  - `src/styles/components.css`

### P07 视觉 token 规则未完全落地，仍存在硬编码视觉值

- **现象**：
  虽然规范要求颜色、字号、圆角、阴影、渐变优先使用 token 或页面根变量，但页面与组件中仍能看到直接写死渐变、颜色或局部视觉值的情况。
- **影响**：
  主题切换、样式审计和后续设计统一会越来越难，页面一多后会形成新的“视觉债务”。
- **相关文件**：
  - `src/pages/aboutme/index.tsx`
  - `src/pages/blog/index.css`
  - `src/pages/home/index.css`
  - `src/styles/themes/*`

### P08 React 代码基线不统一

- **现象**：
  仓库中仍有大量默认 `React` 导入、`any` 宽松扩散、fallback 组件使用 inline style、页面重复手写事件监听和动画帧逻辑等情况。
- **影响**：
  可读性、统一性和性能治理成本偏高，新代码容易继续沿用历史写法，难以形成一致的 React 工程基线。
- **相关文件**：
  - `src/utils/LoadableComponent.tsx`
  - `src/pages/home/index.tsx`
  - `src/pages/aboutme/index.tsx`
  - `src/pages/showcase-*/index.tsx`

### P09 测试目录、文档真相源与命名风格不够统一

- **现象**：
  当前测试既存在 `src/**/__tests__`，也存在根目录 `tests/`；规范文档也分散在多个入口；目录命名中同时存在 `Loader/`、`global-components/`、`scroot-top/` 等不同风格残留。
- **影响**：
  增加协作认知成本，不利于批量治理、搜索、脚手架约束与新人快速接手。
- **相关文件**：
  - `tests/`
  - `src/**/__tests__/`
  - `AGENTS.md`
  - `CLAUDE.md`
  - `src/components/Loader`
  - `src/components/scroot-top`

## 解决方案

### S01 首页首屏瘦身

#### 目标

- 首屏先快速渲染静态可用内容
- 增强效果改为异步加载
- 低性能设备自动降级

#### 方案

1. 将首页 Hero 区拆成两层：
   - `HomeHeroStatic`：静态首屏层，负责标题、按钮、导航、轻量视觉
   - `HomeHeroFx`：增强效果层，承载 3D、粒子和高成本动画
2. 把 `Canvas` 与 Three 生态依赖移出首页顶层同步入口，只在 `HomeHeroFx` 中引入
3. 新增性能分层 Hook，例如：
   - `src/hooks/usePerformanceTier.ts`
   - `src/hooks/useIdleMount.ts`
4. 仅在以下条件满足时挂载增强层：
   - `performanceTier === 'high'`
   - 用户未开启减少动画
   - 浏览器进入空闲阶段
   - 首页静态内容已完成首次渲染

#### 建议改动文件

- `src/pages/home/index.tsx`
- `src/pages/home/components/HeroCore.tsx`
- 新增 `src/pages/home/components/HomeHeroStatic.tsx`
- 新增 `src/pages/home/components/HomeHeroFx.tsx`
- 新增 `src/hooks/usePerformanceTier.ts`
- 新增 `src/hooks/useIdleMount.ts`

### S02 Vite 分包重切

#### 目标

- 降低首页被大型依赖拖累的概率
- 让页面级懒加载真正发挥价值

#### 方案

1. 将当前对象式 `manualChunks` 改为函数式 `manualChunks(id)`
2. 按依赖职责拆分 chunk，而不是按“整组库”粗暴绑定
3. 推荐拆分：
   - `react-core`
   - `router-store`
   - `antd-core`
   - `antd-icons`
   - `r3f-core`
   - `r3f-drei`
   - `postprocessing`
   - `motion`

#### 建议改动文件

- `vite.config.mjs`

### S03 启动链路瘦身

#### 目标

- 缩短应用启动关键路径
- 删除低价值历史遗留代码

#### 方案

1. 删除 `window.$$create` 的声明、赋值与相关工具函数
2. 保留全局错误处理同步初始化
3. 将 `performanceMonitor.init()` 延后到浏览器空闲阶段或首帧之后执行
4. 第一阶段不调整 `PersistGate` 架构，只做低风险清理

#### 建议改动文件

- `src/App.tsx`
- `src/index.tsx`
- `src/utils/create-name/index.ts`

### S04 建立最小回归测试基线

#### 目标

- 先守住首页、博客、路由三条主链路
- 为后续优化提供最小安全网

#### 方案

1. 新增首页 smoke test
2. 新增博客页筛选/分页 smoke test
3. 新增路由懒加载 smoke test
4. 将 smoke 测试纳入常规验证命令

#### 建议新增文件

- `src/pages/home/__tests__/home.smoke.test.tsx`
- `src/pages/blog/__tests__/blog.smoke.test.tsx`
- `src/router/__tests__/router.smoke.test.tsx`

#### 建议改动文件

- `package.json`
- `vitest.config.ts`
- `tests/setup.ts`（如需扩展）

### S05 规范自动化收口

#### 目标

- 把关键规范从“文档约定”升级为“工具自动校验”
- 降低人工评审对记忆的依赖

#### 方案

1. 强化 ESLint：
   - 增加导入顺序规则
   - 增加路径别名使用约束
   - 收紧 `any` 扩散
   - 将关键 Hooks 依赖问题纳入重点治理
2. 强化 Stylelint：
   - 补充对页面/组件层硬编码视觉值的限制
   - 对非法 `:root`、非法 token 覆写继续保持审计
3. 对项目约束补一层轻量自定义检查脚本，收口以下问题：
   - 页面层硬编码颜色/渐变
   - 未按规范使用别名
   - 非必要 inline style
   - 非语义组件替代交互控件

#### 建议改动文件

- `.eslintrc.json`
- `.stylelintrc.json`
- `package.json`
- `scripts/` 下新增治理脚本（如有必要）

### S06 样式体系单一化

#### 目标

- 明确哪套样式层级是主规范
- 避免新旧目录继续并存扩散

#### 方案

1. 对 `src/index.css` 的全局导入层级做一次收口说明
2. 明确旧目录与新目录的角色：
   - 哪些目录继续使用
   - 哪些目录视为 legacy，只读不扩展
3. 后续新增样式时，只允许进入单一主路径体系
4. 在文档中补充“新增样式落点对照表”

#### 建议改动文件

- `src/index.css`
- `docs/style-governance.md`
- 必要时新增 `docs/style-layer-map.md`

### S07 视觉 token 与页面样式边界治理

#### 目标

- 让颜色、阴影、圆角、渐变等视觉属性回到 token / 页面根变量体系
- 避免页面内继续散落硬编码视觉值

#### 方案

1. 扫描页面与组件层的硬编码视觉值
2. 将可复用值上收至 token / semantic / theme 层
3. 页面私有视觉统一落在页面根类变量或 `themes/*-pages.css`
4. 禁止在 TSX 中继续新增无必要视觉常量

#### 建议改动文件

- `src/pages/**/index.tsx`
- `src/pages/**/index.css`
- `src/styles/tokens/semantic.css`
- `src/styles/themes/*-pages.css`

### S08 React 工程基线统一

#### 目标

- 收敛 React 写法，减少历史残留风格混用
- 降低副作用代码、fallback 组件与重复逻辑的分散度

#### 方案

1. 新代码默认不使用默认 `React` 导入
2. 统一懒加载 fallback 的样式实现，避免随处写 inline style
3. 将常见浏览器副作用抽成标准 hooks：
   - `useIdleMount`
   - `usePerformanceTier`
   - `useRafLoop`
   - `useMediaQuery`
   - `useWindowEvent`
4. 收敛 `any` 使用范围，对通用基础组件优先补类型边界

#### 建议改动文件

- `src/utils/LoadableComponent.tsx`
- `src/hooks/*`
- `src/pages/home/index.tsx`
- `src/pages/aboutme/index.tsx`
- `src/pages/showcase-*/index.tsx`

### S09 测试、文档与命名规范统一

#### 目标

- 明确测试文件放置规则
- 明确规范文档的真相源
- 逐步统一目录命名风格

#### 方案

1. 统一测试策略：
   - `src/**/__tests__` 仅放单元测试
   - `tests/` 放页面级、路由级、smoke 级测试
2. 统一文档真相源：
   - 执行规则以 `AGENTS.md` 为主
   - 样式规则以 `docs/style-governance.md` 为主
   - 其他文档只保留补充说明
3. 目录命名逐步收口到 kebab-case
4. 对历史目录采用“新增不再扩展、重构时顺手迁移”的策略

#### 建议改动文件

- `AGENTS.md`
- `CLAUDE.md`
- `docs/style-governance.md`
- `tests/`
- `src/**/__tests__/`

## 推荐执行顺序

### 第一阶段：首屏性能收益优先

1. S01 首页首屏瘦身
2. S02 Vite 分包重切

### 第二阶段：启动成本与维护噪音治理

3. S03 启动链路瘦身

### 第三阶段：建立最小回归保护

4. S04 建立 smoke 测试基线

### 第四阶段：规范治理收口

5. S05 规范自动化收口
6. S06 样式体系单一化
7. S07 视觉 token 与页面样式边界治理
8. S08 React 工程基线统一
9. S09 测试、文档与命名规范统一

## 验收标准

### A01 自动化验收

以下命令全部通过，视为基础验收通过：

```bash
pnpm type-check
pnpm lint
pnpm format:check
pnpm audit:style
pnpm test -- --run
pnpm build
```

### A02 构建产物验收

满足以下条件视为通过：

- `pnpm build` 成功
- 不再出现单个超大的固定 `three-vendor` 包拖累所有页面
- `antd` 与 `@ant-design/icons` 成功拆分
- 首页入口不再直接绑定完整 Three 生态

### A03 首页功能与性能验收

访问 `/#/` 后需满足：

- 首屏标题、导航、按钮能够快速出现
- 页面无长时间白屏
- 低性能设备或减少动画模式下，首页仍可完整浏览
- 高性能设备上，增强层在静态内容之后再加载
- 控制台无新增错误

### A04 博客页验收

访问 `/#/blog` 后需满足：

- 分类切换正常
- 排序切换正常
- 分页正常
- 页面样式无明显回退
- 控制台无新增错误

### A05 路由与懒加载验收

从首页进入以下页面时需满足：

- `/blog`
- `/aboutme`
- 任一 `showcase-*`

验收条件：

- 路由切换成功
- 页面可正常渲染
- 不出现空白页
- 不出现错误跳转或懒加载失败

### A06 网络与资源加载验收

使用浏览器 DevTools 检查：

- 首页首屏阶段不应立即拉取完整 3D 增强资源
- 首页首屏请求更聚焦于静态首屏内容
- 分包后页面按需加载行为符合预期

### A07 规范自动化验收

满足以下条件视为通过：

- ESLint / Stylelint 规则已覆盖关键项目约束，而不只是通用规则
- 页面与组件新增代码的主要规范偏差能够在本地校验阶段被发现
- 核心治理规则已进入脚本或门禁，不再只依赖人工 review

### A08 样式体系验收

满足以下条件视为通过：

- 新增样式的落点规则明确
- 旧目录与主目录的职责已写清楚
- 不再继续向 legacy 目录追加新样式
- 页面私有视觉变量能在固定层级中找到，不再散落

### A09 React 基线验收

满足以下条件视为通过：

- 新增 React 代码默认不再使用无必要默认 `React` 导入
- 懒加载 fallback、浏览器事件、副作用逻辑不再重复散落
- 通用 Hook 已覆盖高频副作用场景
- `any` 扩散趋势得到控制

### A10 测试与文档规范验收

满足以下条件视为通过：

- 测试目录职责清晰
- 规范文档主入口清晰
- 目录命名新增内容符合统一规则
- 新人能够通过单一入口快速找到项目规范

## 任务映射

本文件用于说明本轮性能优化专项，不直接替代 `Task.json`。若后续需要把本专项拆成实际执行卡片，建议新增如下任务：

1. `PF01` 首页首屏瘦身
2. `PF02` Vite 分包重切
3. `PF03` 启动链路瘦身
4. `PF04` smoke 测试基线
5. `PG01` 规范自动化收口
6. `PG02` 样式体系单一化
7. `PG03` 视觉 token 与页面样式边界治理
8. `PG04` React 工程基线统一
9. `PG05` 测试、文档与命名规范统一

## 备注

- 本轮优化优先解决“性能感知”和“回归风险”问题，不做全量重构
- 页面巨石文件拆分、公共 Hook 治理、进一步的 3D 降级策略可作为下一轮优化主题
- 规范治理建议与性能优化并行推进，但优先以“自动化约束先落地”为原则，避免文档先行、代码继续发散
