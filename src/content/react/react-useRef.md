---
title: useRef Hook
slug: react-use-ref
category: React
tags: [React]
summary: 访问 DOM 和持久化数据
date: 2026-04-26
series: React 基础教程
seriesOrder: 6
---

## 概述

访问 DOM 和持久化数据

## 内容片段

### 片段 1

```text
useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。
  返回的 ref 对象在组件的整个生命周期内持续存在。
```

### 片段 2

```text
Refs 提供了一种方式，允许我们访问在 render 方法中创建的 DOM 节点或 React 元素。
  所以我们拿到的ref对象是react元素或者可以说是虚拟DOM
```

### 片段 3

```text
useRef创建的是一个普通 Javascript 对象，和自建一个 {current: ...} 对象的唯一区别是，
  useRef 会在每次渲染时返回同一个 ref 对象
```

### 片段 4

```text
ref.current的变更不会引发组件重新渲染。
  如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现
```

### 片段 5

```text
useRef 和 createRef 都是 React 中用于获取对 DOM 元素的引用的方法，
  但useRef是在函数组件中使用的，它是一个 React 钩子函数，可以在函数组件内部创建和使用
```

### 片段 6

```text
useRef 创建的 ref 对象在多次渲染之间保持不变，因此可以用来存储持久性数据，
  而不会导致函数组件的重新渲染。它通常用于保存组件内的数据，而不是用于访问 DOM 元素
```

### 片段 7

```text
createRef 创建的 ref 对象在组件每次渲染时都会是一个全新的对象，
  因此可以用来触发组件更新。你可以通过将 ref 分配给 DOM 元素来访问和操作 DOM，但不能直接用它来触发函数组件的重新渲染。
```

## 补充说明

### 💡 使用场景

- 访问 DOM 元素（focus、滚动、测量尺寸等）
- 存储不需要触发重新渲染的数据（定时器 ID、之前的值等）
- 在闭包中获取最新值，避免闭包陷阱
### ⚠️ 注意事项

- ref.current 的变化不会触发重新渲染
- 不要在渲染期间读取或写入 ref.current
- 函数组件使用 useRef，类组件使用 createRef
### 📝 实际示例

```tsx
// 访问 DOM 元素
function InputFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus(); // 组件挂载时自动聚焦
  }, []);

  return <input ref={inputRef} />;
}

// 存储上一次的值
function PreviousValue({ value }) {
  const prevRef = useRef(null);

  useEffect(() => {
    prevRef.current = value; // 更新为当前值（不触发重渲染）
  }, [value]);

  return (
    <div>
      当前值: {value} <br />
      上次值: {prevRef.current}
    </div>
  );
}

// 解决闭包陷阱
function Timer() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  countRef.current = count; // 始终保持最新值

  useEffect(() => {
    const id = setInterval(() => {
      // 处理最新值
    }, 1000);
    return () => clearInterval(id);
  }, []); // 空依赖数组
}
```

