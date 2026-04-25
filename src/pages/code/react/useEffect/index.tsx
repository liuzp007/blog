import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `Effect Hook 可以在函数组件中执行副作用操作
  可以看做是componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合`,
  2: `通过使用这个 Hook，可以告诉 React 组件需要在渲染后执行某些操作。React 会保存传递的函数，并且在执行 DOM 更新之后调用。
  也可以在此函数内执行数据获取或调用其他命令式的 API。`,
  3: `默认情况下，useEffect在第一次渲染之后和每次更新之后都会执行。 effect 发生在"渲染之后"，不用再去考虑"挂载"还是"更新"。
  React 保证了每次运行 effect 的同时，DOM 都已经更新完毕`,
  4: `和 componentDidMount 或者 componentDidUpdate 不同，使用 useEffect 不会阻塞浏览器更新屏幕，响应速度更快`,
  5: ` useEffect  返回一个函数，这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数。
  可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分`,
  6: `import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = "点击了 " + count + " 次";
    
    // cleanup 函数
    return () => {
      // 清理副作用
    };
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
  7: `useEffect 是不能直接使用 async，await 语法糖 
//错误用法 ，effect不支持直接 async await 装饰的
useEffect(async () => {
  // 请求数据
  const res = await getUserInfo(payload);
}, [res]);

// 如果要用异步 effect 可以对 effect 进行包装
useEffect(() => {
  (async () => {
    setPass(await mockCheck());
  })();
}, []);`
}

export default function UseEffect() {
  return (
    <ContentWrapper
      className="code-page"
      title="useEffect Hook"
      subtitle="深入理解 React 函数组件中的副作用处理"
    >
      <BeautifyCodeList list={data} />

      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-indigo-alpha-10)',
          border: '1px solid var(--code-indigo-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>💡 最佳实践</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>• 始终在 useEffect 中清理副作用，避免内存泄漏</li>
          <li style={{ marginBottom: '0.5rem' }}>• 合理使用依赖数组，避免无限循环</li>
          <li style={{ marginBottom: '0.5rem' }}>• 异步操作应该包装在 effect 内部的 IIFE 中</li>
          <li style={{ marginBottom: '0.5rem' }}>• 多个相关副作用应该拆分到不同的 useEffect 中</li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
