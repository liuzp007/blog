import{j as e}from"./vendor-react-CC9qU9RZ.js";import{C as t}from"./index-Q60UGwvo.js";import{a as r}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const o="render 函数在类组件中有着绝对的地位，创建虚拟 DOM，进行 diff 算法，更新 DOM 树都在此进行",d=`- componentWillMount
- shouldComponentUpdate
- componentWillUpdate
- componentDidUpdate

以上钩子的执行都会触发 render 函数的执行

render 函数必须是纯函数：
- 不修改 state
- 不直接操作 DOM
- 不做网络请求
- 相同输入总是返回相同输出

import React, { Component } from 'react'

export default class MyComponent extends Component {
  // shouldComponentUpdate 钩子返回 false 则不会触发 render
  shouldComponentUpdate(nextProps, nextState) {
    // 可以在这里决定是否需要重新渲染
    return this.props.value !== nextProps.value;
  }

  render() {
    return (
      <div>
        {this.props.value}
      </div>
    )
  }
}`;function p(){return e.jsxs(t,{className:"code-page",title:"render 方法",subtitle:"类组件的核心渲染函数",children:[e.jsx(r,{code:o}),e.jsx(r,{code:d}),e.jsxs("div",{className:"relative z-[3] mt-8 rounded-xl border border-[var(--code-indigo-alpha-30)] bg-[var(--code-indigo-alpha-10)] p-6",children:[e.jsx("h3",{className:"mb-4 text-[var(--color-code-indigo)]",children:"💡 render 的作用"}),e.jsxs("ul",{className:"list-none space-y-2 p-0 leading-[1.8] text-[var(--white-alpha-80)]",children:[e.jsx("li",{children:"• 读取 this.props 和 this.state"}),e.jsx("li",{children:"• 返回一个 React 元素（JSX、字符串、数组、Fragment 等）"}),e.jsx("li",{children:"• 可以返回 null 表示不渲染任何内容"}),e.jsx("li",{children:"• 不要在 render 中修改 state 或执行副作用"})]})]}),e.jsxs("div",{className:"relative z-[3] mt-6 rounded-xl border border-[var(--code-red-alpha-30)] bg-[var(--code-red-alpha-10)] p-6",children:[e.jsx("h3",{className:"mb-4 text-[var(--color-code-red)]",children:"⚠️ 常见错误"}),e.jsxs("ul",{className:"list-none space-y-2 p-0 leading-[1.8] text-[var(--white-alpha-80)]",children:[e.jsx("li",{children:"• 在 render 中调用 setState（死循环）"}),e.jsx("li",{children:"• 直接修改 props（props 是只读的）"}),e.jsx("li",{children:"• 在 render 中执行副作用（Ajax、setTimeout）"})]})]}),e.jsxs("div",{className:"relative z-[3] mt-6 rounded-xl border border-[var(--code-green-alpha-30)] bg-[var(--code-green-alpha-10)] p-6",children:[e.jsx("h3",{className:"mb-4 text-[var(--color-code-green)]",children:"🔄 函数组件等价"}),e.jsx(r,{code:`// 函数组件本身就是 render 函数
function MyComponent({ value }) {
  // 函数的返回值就是 render 的返回值
  return (
    <div>
      {value}
    </div>
  );
}

// 函数组件的优点：
// 1. 没有 this 指向问题
// 2. 更容易测试
// 3. 更好的代码提示
// 4. 可以使用 Hooks`})]})]})}export{p as default};
