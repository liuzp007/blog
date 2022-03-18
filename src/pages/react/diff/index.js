import React from 'react';
import BeautifyCode from '../../../components/beautifyCode';

const A = `React基于两个假设：

两个相同的组件产生类似的DOM结构，不同组件产生不同DOM结构
对于同一层次的一组子节点，它们可以通过唯一的id区分
`
const B = ` 通过 createElement 生成虚拟DOM树  
    如果是第一次渲染 直接进行虚拟DOM转换真实DOM，
    如果不是=>将本次的虚拟DOM和上次的虚拟DOM进行比较 然后进行更新
            `
const C = ` 虚拟DOM 其实就是 一个树状结构的Object 对象  只会对比同一层级 `

export default function diff(props) {
  return (
    <div>
      <h2 className='titles'>diff 算法</h2>
      <BeautifyCode code={A} />
      <BeautifyCode code={B} />
      <BeautifyCode code={C} />
    </div>
  )
}

