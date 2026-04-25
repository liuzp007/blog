import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode } from '@/components/beautify-code'

const rendercode = `render 函数在类组件中有着绝对的地位，创建虚拟 DOM，进行 diff 算法，更新 DOM 树都在此进行`

const render = `- componentWillMount
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
}`

export default function Render() {
  return (
    <ContentWrapper className="code-page" title="render 方法" subtitle="类组件的核心渲染函数">
      <BeautifyCode code={rendercode} />
      <BeautifyCode code={render} />

      <div className="relative z-[3] mt-8 rounded-xl border border-[var(--code-indigo-alpha-30)] bg-[var(--code-indigo-alpha-10)] p-6">
        <h3 className="mb-4 text-[var(--color-code-indigo)]">💡 render 的作用</h3>
        <ul className="list-none space-y-2 p-0 leading-[1.8] text-[var(--white-alpha-80)]">
          <li>• 读取 this.props 和 this.state</li>
          <li>• 返回一个 React 元素（JSX、字符串、数组、Fragment 等）</li>
          <li>• 可以返回 null 表示不渲染任何内容</li>
          <li>• 不要在 render 中修改 state 或执行副作用</li>
        </ul>
      </div>

      <div className="relative z-[3] mt-6 rounded-xl border border-[var(--code-red-alpha-30)] bg-[var(--code-red-alpha-10)] p-6">
        <h3 className="mb-4 text-[var(--color-code-red)]">⚠️ 常见错误</h3>
        <ul className="list-none space-y-2 p-0 leading-[1.8] text-[var(--white-alpha-80)]">
          <li>• 在 render 中调用 setState（死循环）</li>
          <li>• 直接修改 props（props 是只读的）</li>
          <li>• 在 render 中执行副作用（Ajax、setTimeout）</li>
        </ul>
      </div>

      <div className="relative z-[3] mt-6 rounded-xl border border-[var(--code-green-alpha-30)] bg-[var(--code-green-alpha-10)] p-6">
        <h3 className="mb-4 text-[var(--color-code-green)]">🔄 函数组件等价</h3>
        <BeautifyCode
          code={`// 函数组件本身就是 render 函数
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
// 4. 可以使用 Hooks`}
        />
      </div>
    </ContentWrapper>
  )
}
