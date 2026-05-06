import{j as e}from"./vendor-react-CC9qU9RZ.js";import{C as r}from"./index-Q60UGwvo.js";import{B as o,a as s}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const i={1:"useMemo 接受两个参数，第一个参数是一个函数，返回值用于产生保存值，第二个参数是Array,Array里的依赖项发生变化，重新执行第一个函数，产生新的值。",2:"主要作用是缓存计算结果，减少不必要的渲染和重复计算",3:`比如组件外部传入的props改变，该组件会重新渲染，使用useMemo 可以针对某些改变，减低渲染频率
  const total = useMemo(()=>{
    return props.list.reduce((sum, item) => sum + item.value, 0)
  },[ props.list ]) //  只有 list 改变的时候，重新计算total的值。`,4:`或者缓存组件本身
//只有当props中，list列表改变的时候，子组件才渲染
const MemoChildList = useMemo(() => <ChildList list={props.list} />, [
  props.list,
]); `,5:"优点: 对组件有一定程度的优化，不需要在父组件每次更新的时候重新计算，只要在依赖项发生变化的时候计算即可"};function p(){return e.jsxs(r,{className:"code-page",title:"useMemo Hook",subtitle:"缓存计算结果，优化性能",children:[e.jsx(o,{list:i}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"💡 适用场景"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 昂贵的计算：排序、过滤、大量数据运算等"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 引用相等：需要保持对象/数组引用稳定（如 useEffect 依赖）"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 防止子组件不必要渲染：配合 React.memo 使用"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 常见误区"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:'• 不要为了"优化"而包装所有计算，useMemo 本身也有开销'}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 简单计算（如基础算术）不需要 useMemo"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 依赖数组必须准确，否则可能导致数据过期"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"📝 实际示例"}),e.jsx(s,{code:`// 昂贵的过滤和排序操作
const filteredAndSortedUsers = useMemo(() => {
  return users
    .filter(user => user.age > 18)
    .sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// 缓存传递给子组件的数据
const childProps = useMemo(() => ({
  data: expensiveData,
  config: { theme: 'dark' }
}), [expensiveData]);`})]})]})}export{p as default};
