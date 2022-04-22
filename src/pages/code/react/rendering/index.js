import React from 'react';
import {BeautifyCode, BeautifyCodeList} from '../../../../components/beautifyCode';


let renderObj = {
  A: `jsx经过babel编译后的React.createElement`,
  B: `babel在编译时会判断JSX中标签的首字母：
当首字母为小写时，其被认定为原生D0M标
签，createElement的第一个变量被编译为字符串
。当首字母为大写时，其被认定为自定义组件， createElement的第一个变量被编译为对象
最终都会通过RenderD0M。render(...)方法进行挂载，如下：
reactDOM.render(<App/>,getElementById('root'))
`,
C: `在react中，节点大致可以分成四个类别：
    ·原生标签节点
    ·文本节点
    ·函数组件
    ·类组件
`,
  D: `createElement 接受三个参数 
        type -> 标签
        attributes -> 标签属性，若无则为null
        children -> 标签的子节点
`,
}

export default function Rendering(props) {
  return (
    <div>
      <h2 className='titles' >react的 渲染原理</h2>
      <BeautifyCodeList list={renderObj}/>
    </div>
  )
}

