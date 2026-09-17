---
title: React Diff 算法
slug: react-diff
category: React
tags: [React]
summary: 理解虚拟DOM的差异化更新机制
date: 2026-04-26
series: React 基础教程
seriesOrder: 13
---

## 概述

通过 createElement 生成虚拟 DOM 树。如果是第一次渲染，直接进行虚拟 DOM 转换真实 DOM；如果不是，将本次的虚拟 DOM 和上次的虚拟 DOM 进行比较，然后进行更新。

虚拟 DOM 其实就是一个树状结构的 Object 对象，只对比同一层级下子节点的变化。

## diff 算法规律

diff 算法主要基于三个规律：

- DOM 节点的跨层级移动操作特别少
- 拥有相同类的两个组件将会生成类似的树形结构，拥有不同类的两个组件生成不同的树形结构
- 对于同一层级的一组子节点，可以通过唯一的 id 进行区分

如下说明：

- diff 算法只会在相同层级中进行比较，如果发现节点不存在，将会将该节点以及全部子节点删除
- 如果出现跨层级移动的操作，会删除该节点及其子节点，然后在移动后的位置创建
- 如果是同类组件，会对比其 VM 树；如果知道 VM 没有任何变化，可以通过设置 `shouldComponentUpdate()` 跳过更新
- 如果不是同类的组件，会将其及其子节点全部替换，不会进行对比
- 当处于同一层级，有移动、插入、删除三种操作，React 使用唯一的 key 值区分用户操作

![React 渲染流程图](@/assets/img/01.png "React 渲染流程")
