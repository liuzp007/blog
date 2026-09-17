---
title: useImperativeHandle Hook
slug: react-use-imperative-handle
category: React
tags: [React]
summary: 自定义 ref 暴露给父组件的实例
date: 2026-04-26
series: React 基础教程
seriesOrder: 9
---

## 概述

自定义 ref 暴露给父组件的实例

## 内容片段

### 片段 1

```text
useImperativeHandle 可以在使用 ref 时自定义暴露给父组件的实例值（父拿子的方法或者状态）
```

### 片段 2

```text
useImperativeHandle(ref, createHandle, [deps])，第一个参数为父组件传过来的ref，
  第二个参数为一个回调返回值是一个对象，对象的value就是子组件的要暴露给父组件的方法。
  第三个参数是可选参数，和useMemo，useEffect的可选参数一样，是一个依赖数组每当依赖列表中的值发生改变时，createHandle才会重新计算
```

### 片段 3

```text
React 会确保 dispatch 函数的标识是稳定的，并且不会在组件重新渲染时改变，createHandle 也只在依赖变化时重新计算
```

### 片段 4

```tsx
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

function FancyInput(props, ref) {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    reset: () => {
      inputRef.current.value = '';
    }
  }));

  return <input ref={inputRef} {...props} />;
}

export default forwardRef(FancyInput);
```

### 片段 5

```tsx
// 父组件中使用
import React, { useRef, useEffect } from 'react';
import FancyInput from './FancyInput';

function Parent() {
  const childInputRef = useRef(null);

  useEffect(() => {
    // 调用子组件暴露的方法
    childInputRef.current.focus();
    childInputRef.current.reset();
  }, []);

  return <FancyInput ref={childInputRef} />;
}
```

## 补充说明

### 💡 使用场景

- 需要父组件调用子组件的方法（如 focus、scroll 等）
- 不想暴露整个 DOM 元素，只想暴露特定方法
- 封装第三方组件时，提供统一的 API 接口
### ⚠️ 注意事项

- 必须配合 forwardRef 使用
- 暴露的方法应该是稳定的，避免频繁变化
- 过度使用会破坏组件的封装性
- 优先考虑使用 props 传递回调，而不是命令式调用
### 📝 完整示例

### 🔗 替代方案

- 使用状态提升：将状态放在父组件，通过 props 传递
- 使用 Context API：跨组件共享状态和方法
- 使用状态管理库：Redux、Zustand 等
