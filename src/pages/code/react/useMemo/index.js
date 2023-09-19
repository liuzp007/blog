import React from 'react'
import Body from "../../../../components/bodyComponent";
let data = {
  1: `useMemo 接受两个参数，第一个参数是一个函数，返回值用于产生保存值，第二个参数是Array,Array里的依赖项发生变化，重新执行第一个函数，产生新的值。`,
  2: `主要作用是缓存，减少不必要的渲染`,
  3: `比如组件外部传入的props改变，该组件会重新渲染，使用useMomo 可以针对某些改变，减低渲染频率
  const total = useMemo(()=>{
    
    return xxx
 },[ props.total ]) //  只有 total 改变的时候，重新计算total的值。`,
  4: `或者是
  //只有当props中，list列表改变的时候，子组件才渲染
const MemoChildList = useMemo(() => <ChildList list={props.list} />, [
  props.list,
]); `,
  5: `优点: 对组件有一定程度的优化 ，不需要再父组件每次更新的时候重新计算，只要在依赖项发生变化的时候计算即可`,

}
export default function UseMemo() {
  return (
    <Body title={"useMemo"} data={data} />
  )
}
