---
title: useMemo Hook
slug: react-use-memo
category: React
tags: [React]
summary: 缓存计算结果，优化性能
date: 2026-04-26
series: React 基础教程
seriesOrder: 4
---

## 概述

缓存计算结果，优化性能

## 内容片段

### 片段 1

```text
useMemo 接受两个参数，第一个参数是一个函数，返回值用于产生保存值，第二个参数是Array,Array里的依赖项发生变化，重新执行第一个函数，产生新的值。
```

### 片段 2

```text
主要作用是缓存计算结果，减少不必要的渲染和重复计算
```

### 片段 3

```tsx
比如组件外部传入的props改变，该组件会重新渲染，使用useMemo 可以针对某些改变，减低渲染频率
  const total = useMemo(()=>{
    return props.list.reduce((sum, item) => sum + item.value, 0)
  },[ props.list ]) //  只有 list 改变的时候，重新计算total的值。
```

### 片段 4

```tsx
或者缓存组件本身
//只有当props中，list列表改变的时候，子组件才渲染
const MemoChildList = useMemo(() => <ChildList list={props.list} />, [
  props.list,
]);
```

### 片段 5

```text
优点: 对组件有一定程度的优化，不需要在父组件每次更新的时候重新计算，只要在依赖项发生变化的时候计算即可
```

## 补充说明

### 💡 适用场景

- 昂贵的计算：排序、过滤、大量数据运算等
- 引用相等：需要保持对象/数组引用稳定（如 useEffect 依赖）
- 防止子组件不必要渲染：配合 React.memo 使用
### ⚠️ 常见误区

- 不要为了&quot;优化&quot;而包装所有计算，useMemo 本身也有开销
- 简单计算（如基础算术）不需要 useMemo
- 依赖数组必须准确，否则可能导致数据过期
### 📝 实际示例

```tsx
// 昂贵的过滤和排序操作
const filteredAndSortedUsers = useMemo(() => {
  return users
    .filter(user => user.age > 18)
    .sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// 缓存传递给子组件的数据
const childProps = useMemo(() => ({
  data: expensiveData,
  config: { theme: 'dark' }
}), [expensiveData]);
```

