---
title: render 方法
slug: react-render
category: React
tags: [React]
summary: 类组件的核心渲染函数
date: 2026-04-26
series: React 基础教程
seriesOrder: 3
---

## 概述

类组件的核心渲染函数

## 内容片段

### 片段 rendercode

```text
render 函数在类组件中有着绝对的地位，创建虚拟 DOM，进行 diff 算法，更新 DOM 树都在此进行
```

### 片段 render

```tsx
- componentWillMount
- shouldComponentUpdate
- componentWillUpdate
- componentDidUpdate

以上钩子的执行都会触发 render 函数的执行

render 函数必须是纯函数：
- 不修改 state
- 不直接操作 DOM
- 不做网络请求
- 相同输入总是返回相同输出

import React, { Component } from 'react'

export default class MyComponent extends Component {
  // shouldComponentUpdate 钩子返回 false 则不会触发 render
  shouldComponentUpdate(nextProps, nextState) {
    // 可以在这里决定是否需要重新渲染
    return this.props.value !== nextProps.value;
  }

  render() {
    return (
      <div>
        {this.props.value}
      </div>
    )
  }
}
```

## 补充说明

### 💡 render 的作用

- 读取 this.props 和 this.state
- 返回一个 React 元素（JSX、字符串、数组、Fragment 等）
- 可以返回 null 表示不渲染任何内容
- 不要在 render 中修改 state 或执行副作用
### ⚠️ 常见错误

- 在 render 中调用 setState（死循环）
- 直接修改 props（props 是只读的）
- 在 render 中执行副作用（Ajax、setTimeout）
### 🔄 函数组件等价

```tsx
// 函数组件本身就是 render 函数
function MyComponent({ value }) {
  // 函数的返回值就是 render 的返回值
  return (
    <div>
      {value}
    </div>
  );
}

// 函数组件的优点：
// 1. 没有 this 指向问题
// 2. 更容易测试
// 3. 更好的代码提示
// 4. 可以使用 Hooks
```


