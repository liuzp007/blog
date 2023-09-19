import React, { useReducer } from 'react'
import { Button, Row, Col } from 'antd'
import Body from "../../../../components/bodyComponent";
let data = {
    1: `useImperativeHandle  可以在使用ref 的时候自定义暴露给父组件的实例值（父拿子的方法或者状态）`,
    2: `useImperativeHandle(ref, createHandle, [deps])，第一个参数为父组件传过来的ref，
    第二个参数为一个回调返回值是一个对象，对象的value就是子组件的要暴露给父组件的方法。
    第三个参数是可选参数，和useMemo，useEffect的可选参数一样，是一个依赖数组每当依赖列表中的值发生改变额时候m`,
    3: `React 会确保 dispatch 函数的标识是稳定的，并且不会在组件重新渲染时改变createHandle才会重新计算`,
    4: `function FancyInput(props, ref) {
        const inputRef = useRef();
        useImperativeHandle(ref, () => ({
          focus: () => {
            inputRef.current.focus();
          }
        }));
        return <input ref={inputRef} ... />;
      }
        export default forwardRef(FancyInput);`,
    5:'childInputRef.current.focus()'
}
export default function UseImperativeHandle() {

    return (
        <>
            <Body title={"useImperativeHandle"} data={data} />

        </>
    )
}
