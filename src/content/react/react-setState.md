---
title: setState 原理与最佳实践
slug: react-set-state
category: React
tags: [React]
summary: 深入理解 React 状态更新机制
date: 2026-04-26
series: React 基础教程
seriesOrder: 8
---

## 概述

深入理解 React 状态更新机制

## 内容片段

### 片段 A

```text
setState 是同步的还是异步的？
```

### 片段 B

```text
   在React中，如果是由React引发的事件处理（onClick等）或者是React的生命周期中，调用setState 不会立即更新this.state，所以感觉是异步的（如果想要在
这里拿到更新后的state 可以在setState(partialState,callback) 中的 callback拿到更新后的值 ,

因为在这里setState是批量更新的，会等这个函数执行到最后才会更新状态，避免重复渲染，消耗性能，
如果是原生的addEventLister 添加事件 或者是 setTimeout/setintervel  不需要等到函数执行完
```

### 片段 C

```text
底层实现原理：
在React的setStatel函数实现中,根据一个变量 isBatchingUpdates:判断是直接更新this.state还是放到队列中，isBatchingUpdates默认是false,也就表示
setState会同步更新this.state, 但是,有一个函数 batchedUpdates,这个函数会把isBatchingUpdates修改为 true,而当React在调用事件处理函数之前就会调用batchedUpdates,
造成的后果,就是由React控制的事件处理 过程setState不会同步更新this.state.
```

### 片段 D

```text
setState的'异步' 不是内部由异步代码实现的，本身的执行过程以及代码都是同步的，只是在合成事件和生命周期的调用顺序在更新之前，导致没法立即拿到更新后的值
```

### 片段 E

```tsx
// 函数式写法
export function Test() {

  let [count, setCount] = useState(1)

  const changeCount =(type)=>{

    return ()=>{

      if(type === 'add') {
        // 注意：闭包陷阱 - 无法获取最新值
        // setCount(count +2)

        // 解决方案1：使用临时变量
        // let num = count +2
        // setCount(num);

        // 解决方案2：使用函数式更新（推荐）
        setCount((prevCount)=>{
          let num = prevCount + 2
          return num
        })
      }else{
        setCount(count -2 )
      }
    }
  }
  return (
    <div>
      <p>{count}</p>
      <button onClick={changeCount('add')}>count add</button>
    </div>
  )
}
```

### 片段 F

```tsx
// 类式写法
class Test extends Component {
  constructor(props){
    super(props)
   this.state={
     count:1
   }
   this.changeCount = this.changeCount.bind(this)
  }
 changeCount(type){
   let {count} = this.state
   return ()=>{

     if(type === 'add') {
       // 注意：同样存在闭包陷阱
       // this.setState({count:++count})

       // 解决方案1：使用临时变量
       // const num = ++count
       // this.setState({count:num})

       // 解决方案2：使用回调函数（推荐）
       this.setState((prevState) => ({
         count: prevState.count + 1
       }))
     }else{
      this.setState((prevState) => ({
        count: prevState.count - 1
      }))
     }
   }
 }
 render() {
   const {count} = this.state
   const {changeCount} = this
   return (
     <div>
     <p>{count}</p>
     <button onClick={changeCount('add')}> count add</button>
     <button onClick={changeCount('cutDown')}> count cut down </button>
 </div>
   )
 }
 }
```

## 补充说明

### 💡 批量更新机制

- React 18 之前：事件处理函数中的 setState 会合并成一次更新
- React 18+：自动批处理范围更广，包括 Promise、setTimeout 等场景
- 使用 flushSync 可以强制同步更新（谨慎使用）
### ⚠️ 常见陷阱

- 闭包陷阱：基于旧 state 计算新值时，使用函数式更新
- 对象更新：setState 不会自动合并深层对象，需要使用展开运算符
- 异步操作：在 async 函数中注意 setState 的时序问题
