import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'

const renderObj = {
  A: `jsx经过babel编译后的React.createElement`,
  B: `babel在编译时会判断JSX中标签的首字母：
当首字母为小写时，其被认定为原生DOM标签，createElement的第一个变量被编译为字符串
当首字母为大写时，其被认定为自定义组件，createElement的第一个变量被编译为对象
最终都会通过ReactDOM.render(...)方法进行挂载，如下：
ReactDOM.render(<App/>,getElementById('root'))
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
`
}

export default function Rendering() {
  return (
    <ContentWrapper
      className="code-page"
      title="React 渲染原理"
      subtitle="深入理解 JSX 到 Virtual DOM 的转换过程"
    >
      <BeautifyCodeList list={renderObj} />
    </ContentWrapper>
  )
}
