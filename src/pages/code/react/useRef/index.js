import React from 'react'
import Body from "../../../../components/bodyComponent";
let data = {
    1: `useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。
    返回的 ref 对象在组件的整个生命周期内持续存在。`,
    2: `Refs 提供了一种方式，允许我们访问在 render 方法中创建的 DOM 节点或 React 元素。
    所以我们拿到的ref对象是react元素或者可以说是虚拟DOM`,
    3: `useRef创建的是一个普通 Javascript 对象，和自建一个 {current: ...} 对象的唯一区别是，
    useRef 会在每次渲染时返回同一个 ref 对象`,
    4: `red.current的变更不会引发组件重新渲染。
    如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现`,
    5: `useRef 和 createRef 都是 React 中用于获取对 DOM 元素的引用的方法，
    但useRef是在函数组件中使用的，它是一个 React 钩子函数，可以在函数组件内部创建和使用`,
    6: `useRef 创建的 ref 对象在多次渲染之间保持不变，因此可以用来存储持久性数据，
    而不会导致函数组件的重新渲染。它通常用于保存组件内的数据，而不是用于访问 DOM 元素`,
    7: `createRef 创建的 ref 对象在组件每次渲染时都会是一个全新的对象，
    因此可以用来触发组件更新。你可以通过将 ref 分配给 DOM 元素来访问和操作 DOM，但不能直接用它来触发函数组件的重新渲染。`
}
const reducer = (state, action) => {
    switch (action.type) {
        case 'add':
            console.log(action);
            return {
                ...state,
                value: action.value + 1
            }
        case 'sub':
            return {
                ...state,
                value: action.value - 1
            }
    }
}
export default function UseRef() {

    return (
        <>
            <Body title={"useRef"} data={data} />
        </>
    )
}
