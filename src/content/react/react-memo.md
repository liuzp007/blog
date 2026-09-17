---
title: React.memo
slug: react-memo
category: React
tags: [React]
summary: 组件渲染性能优化利器
date: 2026-04-26
series: React 基础教程
seriesOrder: 7
---

## 概述

组件渲染性能优化利器

## 内容片段

### 片段 1

```text
如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，
  以此通过记忆组件渲染结果的方式来提高组件的性能表现。
  这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。
```

### 片段 2

```text
React.memo 仅检查 props 变更。如果函数组件被 React.memo 包裹，
  且其实现中拥有 useState，useReducer 或 useContext 的 Hook，
  当 state 或 context 发生变化时，它仍会重新渲染。
```

### 片段 3

```tsx
默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，
  那么请将自定义的比较函数通过第二个参数传入来实现。
  function MyComponent(props) {
    /* 使用 props 渲染 */
  }
  function areEqual(prevProps, nextProps) {
    /*
    如果把 nextProps 传入 render 方法的返回结果与
    将 prevProps 传入 render 方法的返回结果一致则返回 true，
    否则返回 false
    */
  }
  export default React.memo(MyComponent, areEqual);
```

### 片段 4

```tsx
与 class 组件中 shouldComponentUpdate() 方法不同的是，
  如果 props 相等，areEqual 会返回 true；如果 props 不相等，则返回 false。
  这与 shouldComponentUpdate 方法的返回值相反。
```

### 片段 5

```text
仅作为性能优化的方式而存在。但请不要依赖它来"阻止"渲染，因为这会产生 未知bug。
```

## 补充说明

### 🎯 使用场景

- 纯展示型组件，相同 props 总是渲染相同结果
- 父组件频繁重新渲染，但子组件 props 很少变化
- 大型列表渲染，每个列表项都可以用 memo 包裹
### ⚠️ 注意事项

- memo 包裹的组件仍会在内部 state/context 变化时重新渲染
- 默认浅比较：对象/数组引用变化才会触发重渲染
- 自定义比较函数返回 true 表示&quot;props 相等，不重渲染&quot;
- 过度使用可能适得其反，比较本身也有性能开销
### 🔗 配合使用

- 与 useCallback 配合：保持函数引用稳定
- 与 useMemo 配合：保持对象/数组引用稳定

