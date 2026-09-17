---
title: useLayoutEffect Hook
slug: react-use-layout-effect
category: React
tags: [React]
summary: 同步读取 DOM 布局
date: 2026-04-26
series: React 基础教程
seriesOrder: 3
---

## 概述

与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

useLayoutEffect 与 componentDidMount、componentDidUpdate 的调用阶段是一样的。

使用服务端渲染时，无论 useLayoutEffect 还是 useEffect 都无法在 Javascript 代码加载完成之前执行。服务端渲染组件中引入 useLayoutEffect 代码时会触发 React 告警，解决这个问题，需要将代码逻辑移至 useEffect 中或使用 useEffectLayoutEffect 替代。

## 基本用法

```typescript
useLayoutEffect(() => {
  // DOM 更新后，浏览器绘制前执行

  return () => {
    // 清理函数
  };
}, [dependencies]);
```

## 读取 DOM 布局

```tsx
function MeasureElement() {
  const [height, setHeight] = useState(0);
  const ref = useRef();

  useLayoutEffect(() => {
    // 在浏览器绘制前读取布局
    const rect = ref.current.getBoundingClientRect();
    setHeight(rect.height);
  });

  return <div ref={ref}>Height: {height}px</div>;
}
```

## 使用场景

- 需要同步读取 DOM 布局（getBoundingClientRect、offsetHeight 等）
- 需要在浏览器绘制前同步修改 DOM
- 避免画面闪烁（如滚动位置恢复）

## 注意事项

- 会阻塞浏览器绘制，谨慎使用
- 服务端渲染时会报警告，需配合 useEffect 使用
- 优先使用 useEffect，只在必要时使用 useLayoutEffect
- 可能影响性能，避免执行耗时操作

## useLayoutEffect vs useEffect

| 特性 | useLayoutEffect | useEffect |
| --- | --- | --- |
| 执行时机 | DOM 更新后，绘制前（同步） | 绘制后（异步） |
| 是否阻塞绘制 | 是 | 否 |
| SSR 兼容 | 警告（需处理） | 完全兼容 |

## 实际示例

```tsx
// 防止闪烁的滚动位置恢复
function ScrollContainer() {
  const containerRef = useRef();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    // 在绘制前恢复滚动位置，用户看不到跳动
    containerRef.current.scrollTop = position.top;
    containerRef.current.scrollLeft = position.left;
  }, [position]);

  const handleScroll = () => {
    setPosition({
      top: containerRef.current.scrollTop,
      left: containerRef.current.scrollLeft
    });
  };

  return (
    <div ref={containerRef} onScroll={handleScroll} style={{ height: '100vh', overflow: 'auto' }}>
      {/* 内容 */}
    </div>
  );
}

// 动态测量元素
function AutoResize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef();

  useLayoutEffect(() => {
    // 同步读取布局，更新状态
    const { width, height } = ref.current.getBoundingClientRect();
    setSize({ width, height });
  }, []);

  return (
    <div ref={ref} style={{ width: size.width, height: size.height, transition: 'all 0.3s' }}>
      Size: {size.width} x {size.height}
    </div>
  );
}
```
