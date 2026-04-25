---
slug: ant-design-guidelines
title: Ant Design 实战规范清单
summary: 基于 Ant Design v4 的使用约定与样式策略，确保页面在内容密度、交互反馈和一致性上的最小可行规范。
date: 2026-03-23
tags:
  - 设计
  - 技术
  - React
visualScene: signal-grid
cover: /blog.png
draft: false
---

开场引言  
组件库是“体验收口”。本项目以 AntD v4 为主 UI，约束了配置入口、排版节律、交互反馈与表单校验，让新增页面能在不额外设计的情况下保持一致体验。

## 全局配置与节律

- 统一消息、弹层挂载与时长；字体、圆角、间距在全局样式中约束。  
- 仅在必要时覆盖主题色，避免全局 CSS 污染。

```tsx
// src/config/antd_global.tsx（片段）
import { ConfigProvider } from 'antd'
export default (App: any) => () => (
  <ConfigProvider componentSize="middle">
    <App />
  </ConfigProvider>
)
```

## 表单与校验

- 使用 `Form.Item` 的 `rules` 明确必填与格式；  
- 将错误提示控制在一行，减少布局抖动；  
- 提交时统一 `message.error` 告知原因。

```tsx
// 表单片段
<Form layout="vertical" onFinish={onSubmit}>
  <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
    <Input maxLength={50}/>
  </Form.Item>
</Form>
```

## 列表信息密度

- 卡片（Card）容器用于内容分组；  
- 表格/列表的操作列不超过 3 个，超过折叠为“更多”；  
- 封面懒加载与骨架屏（Skeleton）配合，缓解卡片闪烁。

```tsx
// 骨架占位
<Skeleton active loading={loading}>
  <YourList />
</Skeleton>
```

## 反馈与可达性

- 操作必有反馈：成功 `message.success`，长任务使用 `Spin` 或全屏 `Modal`。  
- 所有可点击元素给出 `title` 或可见标签，保证键盘可达。

```tsx
// 统一消息提示
import { message } from 'antd'
message.config({ duration: 3, maxCount: 3 })
```

## 收尾结语

AntD 的目标不是“炫样式”，而是“收敛体验”。落实少量可执行的规范，即可在内容快速增长时保持一致与可靠。

