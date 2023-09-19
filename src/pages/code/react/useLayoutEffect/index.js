import React from 'react'
import Body from "../../../../components/bodyComponent";
let data = {
  1: `与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。
  在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新`,
  2: `useLayoutEffect 与 componentDidMount、componentDidUpdate 的调用阶段是一样的`,
  3: `使用服务端渲染无论 useLayoutEffect 还是 useEffect 都无法在 Javascript 代码加载完成之前执行.
  服务端渲染组件中引入 useLayoutEffect 代码时会触发 React 告警,解决这个问题，需要将代码逻辑移至 useEffect 中`,
}
export default function UseLayoutEffect() {
  return (
    <Body title={"useLayoutEffect"} data={data} />
  )
}
