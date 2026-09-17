---
title: React 渲染原理
slug: react-rendering
category: React
tags: [React]
summary: 深入理解 JSX 到 Virtual DOM 的转换过程
date: 2026-04-26
series: React 基础教程
seriesOrder: 1
---

## 概述

深入理解 JSX 到 Virtual DOM 的转换过程

## 内容片段

### 片段 A

```text
jsx经过babel编译后的React.createElement
```

### 片段 B

```text
babel在编译时会判断JSX中标签的首字母：
当首字母为小写时，其被认定为原生DOM标签，createElement的第一个变量被编译为字符串
当首字母为大写时，其被认定为自定义组件，createElement的第一个变量被编译为对象
最终都会通过ReactDOM.render(...)方法进行挂载，如下：
ReactDOM.render(<App/>,getElementById('root'))
```

### 片段 C

```text
在react中，节点大致可以分成四个类别：
    ·原生标签节点
    ·文本节点
    ·函数组件
    ·类组件
```

### 片段 D

```text
createElement 接受三个参数 
        type -> 标签
        attributes -> 标签属性，若无则为null
        children -> 标签的子节点
```

