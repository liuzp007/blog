# 参考站滚动动画时间线

> 来源：zhouyi.run 详细分析

## 核心结论

参考站**几乎没有 JS 驱动的滚动动画**，所有动态效果都是纯 CSS。
没有 IntersectionObserver、没有 ScrollTrigger、没有 scroll 驱动的 transform 变化。

## 滚动时间线

| scrollY   | 区域          | 动画                                                              |
| --------- | ------------- | ----------------------------------------------------------------- |
| 0         | Hero          | blur-reveal 入场（h1 delay 0.2s, p delay 0.5s, link delay 0.68s） |
| 0-703     | Hero 向上滚出 | 无特殊效果，直接滚走                                              |
| 703       | Work 进入     | **无入场动画**，直接可见                                          |
| 703-1923  | Work 卡片     | hover 时边框 amber + 发光 + 图片 scale(1.05)                      |
| 1923      | Writing 进入  | **无入场动画**，直接可见                                          |
| 3146      | About 进入    | **无入场动画**，绿色脉冲点持续动画                                |
| 3868      | Voices 进入   | 4 行 marquee 始终运行（60s/圈）                                   |
| 4989-6395 | Moment        | **200vh + sticky 视差**，内容固定在视口中心                       |
| 6395+     | Footer        | 品牌水印 + 计时器                                                 |

## 参考站没有而我们有的

| 效果                 | 参考站         | 我们    | 建议           |
| -------------------- | -------------- | ------- | -------------- |
| Section fade-up 入场 | 无             | 有      | 保留，是增强   |
| Hero 标语 marquee    | 静态 flex-wrap | marquee | 保留，更动感   |
| 星空粒子背景         | 无             | 有      | 保留，增加氛围 |
| 水母光标             | 无             | 有      | 保留，核心亮点 |

## 参考站核心动态元素

1. **Lenis 平滑滚动** — 全局惯性手感
2. **Marquee 跑马灯** — 4 行交替方向，60s 线性
3. **卡片 hover** — 边框 amber + 发光 + 图片微缩放
4. **Sticky 视差** — Moment 区 200vh + sticky
5. **blur-reveal** — 仅 Hero 入场，CSS only
