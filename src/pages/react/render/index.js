import React from 'react';
import BeautifyCode from '../../../components/beautifyCode';

const rendercode = `render 函数在类组件中  有着绝对的地位 创建 虚拟dom，进行diff算法，更新dom树都在此进行`
const render = `- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate
- componentDidUpdate 

以上钩子的执行都会触发render函数的执行



import React, { Component } from 'react'

export default class index extends Component {
  render() { // shouldComponentUpdate 钩子并不是每次执行都会触发render 需要判断shouldComponentUpdate执行的返回结果
    return (
      <div>index</div>
    )
  }
}
`

export default function Render(props) {
  return (
    <div>
      <h2 className='titles'>render是最常用的 react-dom的api ,用于渲染一个react元素</h2>
      <BeautifyCode code={rendercode} />
      <BeautifyCode code={render} />
    </div>
  )
}

