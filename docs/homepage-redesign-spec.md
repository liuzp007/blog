# 博客首页重构 — 最终设计规格书

> 分支：`feature/new-blog` | 文档路径：`docs/homepage-redesign-spec.md`

## 1. 设计方向

| 项目         | 决定                                              |
| ------------ | ------------------------------------------------- |
| **基调**     | 深黑底 `#0a0a0a`，文字 `#e8e8e8`，次级 `#888`     |
| **强调色**   | amber-400 `#fbbf24`（参考 zhouyi.run 金色）       |
| **字体**     | Inter / 中文 PingFang + 思源黑体                  |
| **背景**     | 全局 fixed 星空粒子 canvas（缓慢漂移 + 鼠标视差） |
| **氛围**     | 大量留白、细边框、低饱和、入场淡入                |
| **平滑滚动** | **Lenis**（安装依赖，非 CSS-only）                |

---

## 2. 自定义鼠标 — 水母效果

> 参考效果：鼠标停止时出现有机流体形态，每次颜色随机

### 行为

- 隐藏原生 cursor（`cursor: none`）
- **两层结构**：
  - **小圆点**：8px 实心强调色，跟随鼠标 1:1
  - **水母外环**：鼠标停止移动 ~300ms 后出现，有机流体形态（带触手/卷曲），半透明渐变，**每次出现颜色随机**
- 鼠标移动时水母消失，小圆点跟随
- hover 交互元素（a / button / .work-card）时：水母放大、小圆点缩小
- 移动端检测 `(pointer: coarse)` 时禁用，恢复系统 cursor

### 水母视觉特征

- 有机圆形基底 + 两侧螺旋卷曲结构（类似水母触手）
- 半透明 30%-50%，边缘模糊
- 中心颜色较深，外缘浅色渐变
- 颜色每次随机：蓝、紫、青、绿、粉、橙等
- 出现时有 scale + opacity 渐入动画

### 技术实现

- Canvas 绘制或 SVG + CSS filter blur
- 颜色池：`['#4fc3f7', '#ab47bc', '#26c6da', '#66bb6a', '#ef5350', '#ff7043', '#7e57c2', '#29b6f6']`
- `mousemove` 事件更新位置，停止后延迟 300ms 触发水母出现
- requestAnimationFrame 驱动动画循环

---

## 3. 自定义滚动条

### 样式

- 极细 6px，深色轨道，amber 强调色 thumb，圆角
- webkit / firefox 双平台支持

### 滚动时动画

- 默认 thumb `opacity: 0.3`
- 滚动中 thumb `opacity: 1` + 宽度变为 8px，transition 200ms
- 停止滚动 800ms 后淡出
- 通过 `scroll` 事件 + setTimeout 触发 `.is-scrolling` class

---

## 4. 页面结构

```
┌─────────────────────────────────────────┐
│ [Logo]      ⌘K 搜索            [菜单]   │ 悬浮 nav（毛玻璃）
├─────────────────────────────────────────┤
│                                         │
│         大 Logo / 头像                   │ Hero：居中 + 标语 marquee
│   体系化架构 · 可演进 · 数据驱动…        │ （水平无限 marquee）
│                                         │
├─────────────────────────────────────────┤
│  Work / 最近在做                         │
│  ┌────┐ ┌────┐ ┌────┐                   │ 作品卡片 3 列
│  │img │ │img │ │img │                   │ hover：zoom + 边框点亮
│  └────┘ └────┘ └────┘                   │     + cursor 水母变大
├─────────────────────────────────────────┤
│  Writing / 最近在写                      │ Featured 全宽 + 小卡片 3 列
├─────────────────────────────────────────┤
│  About / 关于                            │ 简介 + 技能标签
├─────────────────────────────────────────┤
│  Voices / 访客留言                       │ 4 行跑马灯
├─────────────────────────────────────────┤
│  Moment / 慢一点看一眼                   │ 200vh sticky 视差
├─────────────────────────────────────────┤
│  品牌大字水印                             │ 112px/900 极暗半透明
│  运行时间 · 浏览数 · 版权                │ Footer
└─────────────────────────────────────────┘
   ↘ 右下角进度环（滚动 0–100%）
```

---

## 5. 各区块交互细节

### 导航栏

- 浮动胶囊式：`fixed top-0 md:top-4`，max-w-48rem
- 背景 `rgba(255,255,255,0.05)` + `border-radius: 16px`
- **色散棱镜毛玻璃 + 倒影**：使用 SVG displacementFilter 实现，透过玻璃看到背后内容的**镜像倒影**（非普通 backdrop-blur）
  - `backdrop-filter: url(#displacementFilter)`
  - SVG 滤镜链：SourceGraphic → **垂直翻转（scaleY -1，产生倒影）** → feImage（红蓝渐变位移图）→ 3 组 feDisplacementMap（R/G/B 通道分别位移 scale -180/-170/-160）→ feColorMatrix 分离通道 → feBlend(screen) 合成 → feGaussianBlur(0.2) 柔化
  - 效果：当导航栏滚过文字/图片时，透过玻璃可以看到内容的**倒影 + 色散折射**，像真实玻璃表面的镜面反射
- 多层阴影：`oklch(0 0 none / 0.15) inset` + 多层 `rgba(17,17,26,0.05)` 外阴影
- 搜索按钮 `⌘K` → 搜索弹窗（暂不做）
- 菜单按钮（移动端）

### Hero 区

- 背景：星空粒子 canvas
- 头像 128-160px 圆形 + inset shadow + ring 隔离层
- H1：63px/700/-3.15px letter-spacing，`blur-reveal` 入场（0.9s，delay 0.2s）
- 副标题：15.75px/400/+0.39px letter-spacing，delay 0.5s
- 网站链接：delay 0.68s
- "继续往下看" pill 按钮：透明 + zinc 边框
- 标语水平 marquee（参考站是静态 flex-wrap，改为 marquee 增加动感）

### TagsSection — 标签云

- 水平无限 marquee，大号加粗关键词
- hover 双层叠显（底层半透明水印 + 上层文字显现）
- 背景 `grid-bg-drift` 微漂移

### WorkSection — 作品卡片

- 三列网格（lg），gap 17.5px
- 卡片 hover 效果链：
  1. 边框变色：zinc-700/50 → amber-500/40
  2. 发光阴影：amber 色辉光
  3. 背景加深：zinc-900/30 → 45
  4. 图片放大：scale(1.05)，500ms
  5. "访问"按钮 opacity 0→1
- 标签：amber-400/80 纯文字 uppercase

### WritingSection — 文章

- Featured 文章全宽，图片绝对定位覆盖，hover scale(1.03) 700ms
- 小卡片三列，内阴影顶部高光线
- 背景渐变 from-zinc-950 via-zinc-950 to-black

### AboutSection — 关于

- 3-4 行简介 + 技能标签
- 联系方式（邮箱、GitHub、微信占位）

### VoicesSection — 留言跑马灯

- 4 行 marquee，60s 线性无限反向
- 卡片固定 w-64（224px），头像 + 脱敏邮箱 + blockquote
- 连接现有留言板数据

### MomentSection — 视差区

- 200vh 容器 + `sticky top-0 h-screen`
- 内容固定在视口，外部继续滚动
- 氛围文字 + 渐变背景

### Footer

- 品牌大字水印：112px/900 字重，zinc-900/70 极暗半透明
- 运行时间计数器（JS setInterval 实时更新）
- 浏览数 + 版权

---

## 6. 全局交互效果

### 滚动入场动画

> 参考站仅 Hero 有 CSS blur-reveal，其他区块无入场动画。
> 本项目**增强为**每个 section 用 IntersectionObserver 触发 fade-up 入场。

| 区块    | 入场效果           | 延迟                     |
| ------- | ------------------ | ------------------------ |
| Hero    | blur-reveal（CSS） | 0.2s / 0.5s / 0.68s 交错 |
| Tags    | marquee 始终运行   | —                        |
| Work    | fade-up（IO 触发） | 0ms                      |
| Writing | fade-up（IO 触发） | 0ms                      |
| About   | fade-up（IO 触发） | 0ms                      |
| Voices  | marquee 始终运行   | —                        |
| Moment  | sticky 视差        | —                        |

### 动画关键帧清单

| 名称             | 效果                         | 用途         |
| ---------------- | ---------------------------- | ------------ |
| blur-reveal      | blur(14px)→清晰+淡入         | Hero 入场    |
| grid-bg-drift    | rotate+translate 微移        | 背景漂移     |
| marquee          | translate(-100%) 水平滚动    | 标签云/留言  |
| fade-up          | translateY(30px)+opacity 0→1 | section 入场 |
| jellyfish-appear | scale(0.5)+opacity 0→1       | 水母光标出现 |

### 微交互时值

- 通用 transition：**150ms** cubic-bezier(0.4,0,0.2,1)
- 卡片 transition：**300ms**
- 图片放大：**500-700ms** ease-out（比容器慢，层次感）

### 字体排版层级

| 级别     | font-size | font-weight | letter-spacing |
| -------- | --------- | ----------- | -------------- |
| Hero H1  | 63-72px   | 700         | -3.15px        |
| 品牌水印 | 112px     | 900         | 0.08em         |
| 区块标签 | 10.5px    | 600         | 0.35em         |
| 卡片标题 | 17.5px    | 700         | normal         |
| 正文描述 | 12.25px   | 400         | normal         |
| 副标题   | 15.75px   | 400         | +0.39px        |

---

## 7. 实现计划

### 第一阶段：基础设施

#### Step 1: 安装 Lenis 平滑滚动

- `pnpm add lenis`
- 创建 `src/hooks/useLenis.ts`
- 配置：`duration: 1.2`, `smoothWheel: true`

#### Step 2: 水母光标组件

- 创建 `src/pages/home/components/JellyfishCursor.tsx`
- Canvas 绘制有机流体 + 随机颜色
- 移动端检测自动禁用

#### Step 3: 星空背景组件

- 创建 `src/pages/home/components/StarfieldBackground.tsx`
- Canvas 粒子 + 鼠标视差

#### Step 4: 配色与 Token

- 更新 `src/styles/themes/home-pages.css`
- 主强调色 amber-400 `#fbbf24`

#### Step 5: 动画工具

- 创建 `src/styles/3_components/animations.css`
- blur-reveal / grid-bg-drift / marquee / fade-up 关键帧

#### Step 6: 自定义滚动条

- 全局 CSS `::-webkit-scrollbar` 样式
- `useScrollState.ts` hook 提供 `.is-scrolling` body class

### 第二阶段：首页重构

#### Step 7: 组件拆分

```
src/pages/home/
├── index.tsx                    # 主组件（~100行，组装各区）
├── sections/
│   ├── HeroSection.tsx          # Hero + 标语 marquee
│   ├── TagsSection.tsx          # 关键词 marquee
│   ├── WorkSection.tsx          # 作品卡片
│   ├── WritingSection.tsx       # 文章列表
│   ├── AboutSection.tsx         # 关于 + 联系
│   ├── VoicesSection.tsx        # 留言跑马灯
│   ├── MomentSection.tsx        # 视差区
│   └── HomeFooter.tsx           # 品牌大字 + 计数器
├── components/
│   ├── JellyfishCursor.tsx      # 水母光标
│   ├── StarfieldBackground.tsx  # 星空背景
│   ├── WorkCard.tsx             # 作品卡片
│   ├── ArticleCard.tsx          # 文章卡片
│   ├── VoiceCard.tsx            # 留言卡片
│   └── ScrollProgress.tsx       # 进度环
├── homeContent.ts               # 内容数据
└── index.css                    # 首页样式
```

#### Step 8-14: 各区块组件实现

按 Hero → Tags → Work → Writing → About → Voices → Moment → Footer 顺序

### 第三阶段：全局组件

#### Step 15: ScrollProgress 进度环

- 45px 圆形毛玻璃
- SVG 进度环 + 百分比

#### Step 16: 导航栏更新

- 浮动胶囊 + 毛玻璃
- 搜索 + 菜单按钮

### 第四阶段：打磨与验证

#### Step 17: 样式完善

- 首页 index.css 重写
- 响应式适配

#### Step 18: 验证

- `pnpm type-check` + `pnpm build`
- 浏览器逐区验收

---

## 8. 关键文件清单

### 新增

- `src/hooks/useLenis.ts`
- `src/hooks/useScrollState.ts`
- `src/pages/home/sections/*.tsx`（8个）
- `src/pages/home/components/*.tsx`（6个）
- `src/styles/3_components/animations.css`

### 修改

- `src/pages/home/index.tsx` — 重构为组装层
- `src/pages/home/index.css` — 样式重写
- `src/pages/home/homeContent.ts` — 内容数据
- `src/styles/themes/home-pages.css` — 配色变量
- `src/index.css` — 导入 animations.css
- `package.json` — 新增 lenis

### 可删除

- `src/pages/home/HomeHeroFx.tsx` — 不再使用
- `src/pages/home/HeroCore.tsx` — 不再使用
- `src/pages/home/SignalWaveOverlay.tsx` — 不再使用
- `src/pages/home/HomeInteractiveDemo.tsx` — 不再使用
- `src/pages/home/LineDog.tsx` — 不再使用

---

## 9. 验证方案

1. `pnpm type-check` — 无类型错误
2. `pnpm build` — 构建成功
3. 浏览器 `http://127.0.0.1:8081` 逐区验收：
   - Lenis 平滑滚动
   - 水母光标（停止出现 + 随机色 + hover 变大）
   - 星空背景 + 鼠标视差
   - 自定义滚动条
   - 各区块 hover 效果
   - 跑马灯流畅性
   - Sticky 视差
   - 进度环准确性
   - 响应式布局

---

## 10. 不包含（暂不做）

- ⌘K 搜索弹窗
- 作品详情子路由
- 公告弹窗
- 多语言
- 后端接口
