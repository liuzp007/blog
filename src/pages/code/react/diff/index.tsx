import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'
import img01 from '@/assets/img/01.png'

const list = {
  B: ` 通过 createElement 生成虚拟DOM树  
    如果是第一次渲染 直接进行虚拟DOM转换真实DOM，
    如果不是=>将本次的虚拟DOM和上次的虚拟DOM进行比较 然后进行更新`,
  C: ` 虚拟DOM 其实就是 一个树状结构的Object 对象  只对比同一层级下子节点的变化`,
  A: `diff算法主要基于三个规律
    
    · DOM节点的跨成层级移动的操作特别少
    · 拥有相同类的两个组件将会生成类似的树形结构，拥有不同类的两个组件生成不同的树形结构
    · 对于同一层级的一组子节点，可以通过唯一的id进行区分
    
    如下说明：
    ·diff 算法只会在相同层级中进行比较，如果发现节点不存在，将会将该节点以及全部子节点删除
    ·如果出现跨层级移动的操作，那么会删除该节点以及其子节点，然后再移动后的位置创建
    ·如果是同类组件，会对比其VM数，如果知道VM 没有任何变化，可以通过设置shouldComponentUpdate()
      该钩子需要返回布尔值 true 更新 反之不更新
    ·如果不是同类的组件，会将其以及其子节点全部替换，不会进行对比
    ·当处于同一层级，有三个操作（移动、插入、删除），react使用唯一的key值来区分，这样就可以区分用户的操作
    `
}

export default function Diff() {
  return (
    <ContentWrapper
      className="code-page"
      title="React Diff 算法"
      subtitle="理解虚拟DOM的差异化更新机制"
    >
      <BeautifyCodeList list={list} />
      <div
        style={{
          marginTop: '2rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 3
        }}
      >
        <img
          src={img01}
          alt="React 渲染流程图"
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 10px 30px var(--black-alpha-30)'
          }}
        />
      </div>
    </ContentWrapper>
  )
}
