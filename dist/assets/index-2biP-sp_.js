import{r as a,j as e}from"./vendor-react-CC9qU9RZ.js";import{C as d}from"./index-Q60UGwvo.js";import{B as l,a as c}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const m={1:`use Hook 是 React 19 引入的全新 API，用于在组件中读取资源
    它可以像读取 state 一样，在渲染期间读取 Context、Promise 等资源
    支持的指令包括：context、deferred、subscribe、selector、optimistic`,2:`// 基本语法
import { use } from 'react'

// 读取 Context
const theme = use(Context)

// 读取 Promise
const data = use(Promise)
const { data, error } = use(Promise)`,3:`use Hook 可以配合 Suspense 和 Transition 使用
    当资源未就绪时，组件会 Suspense
    数据准备好后自动重新渲染
    这是 React 19 实现更优雅异步加载的核心机制`,4:`// use 读取 Context
import { use, createContext } from 'react'

const ThemeContext = createContext('light')

function Button() {
  const theme = use(ThemeContext)
  return <button className={theme}>Click</button>
}

// 等价于 useContext，但可以在 Transition 中工作
// 并且可以结合 selector 使用

// 使用 selector
const value = use(Context, (value) => value.theme)`,5:`// use 读取 Promise
import { use, Suspense } from 'react'

function UserCard({ userIdPromise }) {
  const user = use(userIdPromise)

  return (
    <Suspense fallback={<Spinner />}>
      <div>{user.name}</div>
    </Suspense>
  )
}`,6:`use Hook 的优势：
    · 可以在 Transition 中中断（对于 Promise）
    · 更简洁的 API，无需处理 pending/loaded 状态
    · 与 Suspense 无缝集成
    · 支持 selector 函数进行派生计算`};function y(){const[t,s]=a.useState(""),i={promise:`// Promise 示例
import { use, Suspense } from 'react'

function Profile({ userId }) {
  // 直接使用 use 读取 Promise
  const user = use(fetchUser(userId))

  return (
    <Suspense fallback={<Skeleton />}>
      <div className="profile">
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>
    </Suspense>
  )
}`,context:`// Context with selector
import { use, createContext } from 'react'

const UserContext = createContext({
  user: null,
  theme: 'light'
})

function Welcome() {
  // 只订阅 theme 值的变化
  const theme = use(
    UserContext,
    (context) => context.theme
  )

  return <div className={theme}>Welcome!</div>
}`,deferred:`// Deferred value
import { use, Suspense } from 'react'

function SearchResults({ queryPromise }) {
  const deferredQuery = use(queryPromise)

  return (
    <div>
      <h2>搜索: {deferredQuery}</h2>
      {/* 如果 queryPromise 还在 pending，显示 Spinner */}
      <Suspense fallback={<Spinner />}>
        <ResultsList />
      </Suspense>
    </div>
  )
}`};return e.jsxs(d,{className:"code-page",title:"use Hook",subtitle:"React 19 全新资源读取 API",children:[e.jsx(l,{list:m}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"💡 use Hook 支持的指令"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",gap:"1rem"},children:[{name:"context",desc:"读取 Context 值"},{name:"deferred",desc:"延迟显示的值"},{name:"promise",desc:"读取 Promise 结果"},{name:"subscribe",desc:"订阅外部数据源"},{name:"selector",desc:"派生计算（仅 context）"},{name:"optimistic",desc:"乐观 UI 更新"}].map((o,n)=>e.jsxs("div",{onClick:()=>s(i[o.name]||""),style:{padding:"1rem",background:"var(--code-indigo-alpha-05)",border:"1px solid var(--code-indigo-alpha-20)",borderRadius:"8px",cursor:"pointer",transition:"all 0.2s ease"},onMouseOver:r=>{r.currentTarget.style.background="var(--indigo-alpha-15)",r.currentTarget.style.borderColor="var(--code-indigo-alpha-40)"},onMouseOut:r=>{r.currentTarget.style.background="var(--code-indigo-alpha-05)",r.currentTarget.style.borderColor="var(--code-indigo-alpha-20)"},children:[e.jsxs("code",{style:{color:"var(--color-code-indigo)",fontSize:"0.9rem",fontWeight:"bold"},children:["use(",o.name,")"]}),e.jsx("div",{style:{fontSize:"0.8rem",color:"var(--white-alpha-60)",marginTop:"0.25rem"},children:o.desc})]},n))})]}),t&&e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"📝 代码示例"}),e.jsx(c,{code:t})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 使用注意事项"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• use 只能在组件顶层调用，不能在条件语句中使用"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 读取的资源（如 Promise）应该被缓存，避免重复创建"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 与 Suspense 配合使用时，需要正确设置 fallback"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• selector 函数应该是纯函数，避免不必要的重新计算"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-violet-alpha-10)",border:"1px solid var(--code-violet-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-violet)",marginBottom:"1rem"},children:"🔗 与传统 API 对比"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",color:"var(--white-alpha-80)"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-violet-alpha-30)"},children:[e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",color:"var(--color-code-violet)"},children:"场景"}),e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",color:"var(--color-code-violet)"},children:"旧 API"}),e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",color:"var(--color-code-violet)"},children:"use Hook"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-page-chip-border)"},children:[e.jsx("td",{style:{padding:"0.75rem"},children:"读取 Context"}),e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"useContext()"}),e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace",color:"var(--color-code-violet)"},children:"use(Context)"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-page-chip-border)"},children:[e.jsx("td",{style:{padding:"0.75rem"},children:"读取 Promise"}),e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"Suspense + useEffect"}),e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace",color:"var(--color-code-violet)"},children:"use(Promise)"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.75rem"},children:"条件渲染"}),e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"if (loading) return <Spinner>"}),e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace",color:"var(--color-code-violet)"},children:"<Suspense fallback={<Spinner}>"})]})]})]})]})]})}export{y as default};
