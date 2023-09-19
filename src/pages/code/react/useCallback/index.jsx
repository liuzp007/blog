import React from 'react'
import Body from "../../../../components/bodyComponent";
let data = {

  1: `useCallback 和 useMemo 类似 接受两个参数，第一个参数是一个函数，
  第二个参数是Array,Array里的依赖项发生变化，更新第一个回调。`,
  2: `主要作用是缓存，减少不必要的渲染，例如不使用useCallback，
  在父组件中创建了一个名为handleClick的事件处理函数，
  根据需求我们需要把这个handleClick传给子组件，
  当父组件中的一些state变化后（这些state跟子组件没有关系），
  父组件会reRender，然后会重新创建名为handleClick函数实例，
  并传给子组件，这时即使用React.memo把子组件包裹起来，子组件也会重新渲染，
  因为props已经变化了，但这个渲染是无意义的`,
  3: `const handleClick= useCallback(() => {
    console.log(textRef.current);
}, [total]) //  只有 total 改变的时候，重新创建这个函数实例`,

}
export default function UseCallback() {
  return (
    <Body title={"useCallback"} data={data} />
  )
}
