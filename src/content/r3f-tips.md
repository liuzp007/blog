---
slug: r3f-tips
title: React Three Fiber 小技巧
summary: 在项目中使用 R3F 的一些实践与建议。
date: 2026-03-22
tags: [r3f, three, webgl]
visualScene: space-orbit
cover: /blog.png
---

# R3F 实践

## 条件渲染后处理

在低性能设备上关闭后处理可以显著提升帧率。

```
{enabled && (
  <EffectComposer>
    <Bloom />
  </EffectComposer>
)}
```

## 使用 useFrame

将动画逻辑放在 `useFrame` 内部实现细粒度控制。

