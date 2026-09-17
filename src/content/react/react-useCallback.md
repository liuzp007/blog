---
title: useCallback Hook
slug: react-use-callback
category: React
tags: [React]
summary: 缓存函数引用，优化子组件渲染
date: 2026-04-26
series: React 基础教程
seriesOrder: 5
---

## 概述

缓存函数引用，优化子组件渲染

## 内容片段

### 片段 1

```text
useCallback 和 useMemo 类似，接受两个参数，第一个参数是一个函数，
  第二个参数是Array,Array里的依赖项发生变化，更新第一个回调。
```

### 片段 2

```text
主要作用是缓存函数引用，减少不必要的渲染，例如不使用useCallback，
  在父组件中创建了一个名为handleClick的事件处理函数，
  根据需求我们需要把这个handleClick传给子组件，
  当父组件中的一些state变化后（这些state跟子组件没有关系），
  父组件会reRender，然后会重新创建名为handleClick函数实例，
  并传给子组件，这时即使用React.memo把子组件包裹起来，子组件也会重新渲染，
  因为props已经变化了，但这个渲染是无意义的
```

### 片段 3

```tsx
const handleClick = useCallback(() => {
  // 处理逻辑
}, [total]) //  只有 total 改变的时候，重新创建这个函数实例
```

### 片段 4

```tsx
useCallback(fn, deps) 相当于 useMemo(() => fn, deps)
  即：缓存一个函数，而不是计算结果
```

### 片段 5

```text
每次渲染时，useCallback 返回的都是同一个函数实例（依赖未变时）
```

### 片段 6

```tsx
// 基本使用
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// 带参数的回调
const handleClick = useCallback((id) => {
  setSelectedId(id);
}, []);
```

## 补充说明

### 💡 为什么要用 useCallback

- 保持函数引用稳定，避免子组件不必要的重渲染
- 当函数作为 useEffect 的依赖时，避免无限循环
- 配合 React.memo 包裹的子组件使用效果最佳
### ⚠️ 常见误区

- 不要为了&quot;优化&quot;而包装所有函数，useCallback 本身也有开销
- 如果不传递给子组件或作为其他 Hook 的依赖，通常不需要
- 依赖数组必须准确，否则可能捕获到过期的值
### 📝 实际示例

```tsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // 不使用 useCallback：每次 Parent 重渲染都会创建新函数
  // const handleClick = () => {};

  // 使用 useCallback：只有 count 变化时才重新创建
  const handleClick = useCallback(() => {
    // 处理逻辑
  }, [count]);

  return <Child onClick={handleClick} name={name} />;
}

// 子组件用 React.memo 包裹
const Child = React.memo(({ onClick, name }) => {
  return <button onClick={onClick}>{name}</button>;
});
```

