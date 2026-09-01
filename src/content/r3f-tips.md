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

上个月帮朋友看一个落地页的性能问题，他那个页面在手机上帧率直接掉到个位数，打开 DevTools 一看，好家伙，Bloom + SSAO + Vignette 全挂上了。我说你把后处理关了试试？他试了一下，帧率直接翻倍。

坦率的讲，后处理确实是提升画面质感的利器，但也确实是性能杀手。尤其是在移动端，那些 shader 运算量不是闹着玩的。我自己在做项目的时候，一般会根据设备性能来决定要不要开后处理。

```
{enabled && (
  <EffectComposer>
    <Bloom />
  </EffectComposer>
)}
```

这个写法很简单，enabled 可以是你自己根据设备能力判断的一个布尔值。我自己的感受是，与其让用户在一个卡顿的 3D 场景里受罪，不如痛痛快快给一个流畅的基础体验。画面差点就差点吧，流畅比好看重要。

## 使用 useFrame

说真的，刚接触 R3F 的时候我有点不太适应 useFrame 这个概念。之前写 Three.js 原生代码，动画循环都是在 requestAnimationFrame 里手动搞的，突然变成 React 的 hook 风格，脑子里需要转个弯。

但用了一阵子之后我是真的觉得，这玩意太香了。

useFrame 的好处在于它给了你对每一帧的细粒度控制。你可以在回调里拿到 delta 时间，可以拿到当前相机，可以访问 scene 里的任何节点。所有动画逻辑都集中在一个地方，调试起来特别方便。

```
useFrame((state, delta) => {
  ref.current.rotation.y += delta * 0.5;
});
```

我自己的经验是，但凡涉及到动画的东西，都优先考虑放到 useFrame 里去实现。别在外面用 setInterval 或者 GSAP 去驱动 Three.js 的对象变化，那种写法在简单场景下没问题，一旦场景复杂了，时序问题会让你抓狂的。

还有一个需要注意的点，useFrame 里面的代码每帧都会执行，所以千万别在里面做重计算或者创建新对象。我之前就在里面 new 了一个 THREE.Vector3，结果 GC 疯狂触发，帧率抖得不行。这个坑我踩过，大家别再踩了。
