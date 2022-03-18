import React from 'react';
import BeautifyCode from '../../../components/beautifyCode';

const A = `jsx经过babel编译后的React.createElement`
const B = `createElement 接受三个参数 
        type -> 标签
        attributes -> 标签属性，若无则为null
        children -> 标签的子节点
`
const C = ``

export default function Rendering(props) {
  return (
    <div>
      <h2 className='titles'>react的 渲染原理</h2>
      <BeautifyCode code={A} />
      <BeautifyCode code={B} />
      <BeautifyCode code={C} />
    </div>
  )
}

