---
title: React.StrictMode
slug: react-strict-mode
category: React
tags: [React]
summary: 开发时检测潜在问题
date: 2026-04-26
---

## 概述

StrictMode 是一个用于突出显示应用中潜在问题的工具。它不会渲染可见的 UI，而是激活额外的检查和警告，仅在开发模式下生效，生产环境不影响性能。

StrictMode 会激活以下检查：

- 识别不安全的生命周期方法
- 使用过时的字符串 ref API 发出警告
- 检测意外的副作用
- 检测过时的 Context API
- 确保可复用组件状态不被意外修改

## 基本用法

```tsx
import { StrictMode } from 'react'

function App() {
  return (
    <StrictMode>
      <MainComponent />
    </StrictMode>
  )
}

// 只对部分组件启用
function App() {
  return (
    <div>
      <StrictMode>
        <Header />
        <Sidebar />
      </StrictMode>
      <Footer />
    </div>
  )
}
```

## 检测意外的副作用

```tsx
function Example() {
  const [count, setCount] = useState(0)

  // ❌ 在渲染时修改外部状态
  useEffect(() => {
    setCount(1) // 每次渲染都触发 effect
  }, []) // 空依赖数组会导致无限循环

  // ✅ StrictMode 会双重调用 effect 来暴露这个问题
  useEffect(() => {
    setCount(1)
  }, [count]) // 正确的依赖
}

// StrictMode 会让组件渲染两次
// 第一次渲染：检测并记录问题
// 第二次渲染：确认修复有效
```

## 检测过时的 API

```tsx
// ❌ 使用过时的字符串 ref
class OldComponent extends Component {
  render() {
    return <input ref="myInput" />
  }
}

// ✅ 使用回调 ref 或 useRef
function NewComponent() {
  const inputRef = useRef(null)
  return <input ref={inputRef} />
}

// StrictMode 会警告这些过时用法
```

## StrictMode 检测项

| 检测项 | 说明 |
| --- | --- |
| 不安全的生命周期 | `componentWillMount` 等已废弃的方法 |
| 过时的 ref API | 字符串 ref 会被警告 |
| 意外的副作用 | render 中不应有副作用 |
| 过时的 Context API | old context 会被警告 |
| 可重用组件状态 | 检测状态意外修改 |
| 双重渲染 | 故意渲染两次暴露问题 |

## 最佳实践

- **全应用包裹**：在应用最外层添加 StrictMode
- **渐进式采用**：可以从子组件开始，逐步扩大范围
- **关注警告**：严格模式下修复所有控制台警告
- **测试副作用**：确保组件在多次渲染时行为一致
- **不要在生产环境禁用**：帮助捕获早期错误

## 常见问题

- **effect 执行两次**：这是正常的，用于检测副作用
- **构造函数执行两次**：state 初始化应该保证幂等性
- **第三方库警告**：某些库可能不兼容 StrictMode
- **性能影响**：仅开发模式，不影响生产性能

## React 18+ StrictMode 变化

```tsx
// React 18 中 StrictMode 不会再双重调用 constructor
// 但会双重调用 render 和某些 effects

// React 18 对以下的支持：
// 1. Concurrent Features 支持
// 2. Suspense 更好的集成
// 3. 自动批处理（Automatic Batching）

// StrictMode 与 Concurrent Features 配合
import { StrictMode } from 'react'

function App() {
  return (
    <StrictMode>
      <Suspense fallback={<Loading />}>
        <MainApp />
      </Suspense>
    </StrictMode>
  )
}

// 注意：StrictMode 在生产环境中不会运行
if (process.env.NODE_ENV !== 'production') {
  // 启用 StrictMode 的额外开发模式功能
}
```

## StrictMode 影响对比

| 特性 | 开发环境 | 生产环境 |
| --- | --- | --- |
| 额外检查 | ✅ 启用 | ❌ 无影响 |
| 双重渲染 | ✅ 启用 | ❌ 禁用 |
| 双重 effect 调用 | ✅ 启用 | ❌ 禁用 |
| 性能开销 | 有额外开销 | 无额外开销 |
