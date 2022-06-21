import React from 'react'
import Body from "../../../../components/bodyComponent";
let data = {
  1: `Effect Hook 可以在函数组件中执行副作用操作,
  可以看做是componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合`,
  2: `通过使用这个 Hook，可以告诉 React 组件需要在渲染后执行某些操作。React 会保存传递的函数，并且在执行 DOM 更新之后调用。
  也可以在此函数内执行数据获取或调用其他命令式的 API。`,
  3: `默认情况下，useEffect在第一次渲染之后和每次更新之后都会执行。 effect 发生在“渲染之后”，不用再去考虑“挂载”还是“更新”。
  React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。
      `,
  4: `和 componentDidMount 或者 componentDidupdate 不同，使用 useEffect 不会阻塞浏览器更新屏幕，响应速度更快，`,
  5: ` useEffect  返回一个函数，这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数。
  可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分`,
  6: `import React, { useState, useEffect } from 'react';

  function Example() {
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      
      document.title =" 点击了" + count + "次";

      return ()={
        //cleanup 
      }
    });
  
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }`,
  7:`useEffect 是不能直接使用 async，await 语法糖 
  //错误用法 ，effect不支持直接 async await 装饰的
  useEffect(async () => {
    // 请求数据
    const res = await getUserInfo(payload);
  }, [res]);
  如果要用异步 effect 可以对 effect 进行包装
  useEffect(() => {
    (async () => {
      setPass(await mockCheck());
    })();
  }, []);
  };
  `

}
export default function useEffect() {
  return (
    <Body title={"useEffect"} data={data} />
  )
}
