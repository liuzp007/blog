import{r as o,j as e}from"./vendor-react-CC9qU9RZ.js";import{C as n}from"./index-Q60UGwvo.js";import{B as a,a as i}from"./index-BrgpqR_A.js";import{C as l}from"./index-D4fbOsVa.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const d={1:`Suspense 组件让你可以声明式地"等待"某些内容加载完成
    它可以在数据加载完成前显示 fallback 内容
    配合 React.lazy 和 use() Hook 实现代码分割和数据获取`,2:`// 基本用法
import { Suspense } from 'react'

function Profile() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserProfile />
    </Suspense>
  )
}

// 嵌套 Suspense
<Suspense fallback={<PageSkeleton />}>
  <Suspense fallback={<HeaderSkeleton />}>
    <Header />
  </Suspense>
  <Suspense fallback={<ContentSkeleton />}>
    <Content />
  </Suspense>
</Suspense>`,3:`// 配合 React.lazy 实现代码分割
import { Suspense, lazy } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}`,4:`// 配合 use Hook 读取数据
import { Suspense, use } from 'react'

function UserCard({ userId }) {
  // fetchUser 返回 Promise
  const user = use(fetchUser(userId))

  return (
    <Suspense fallback={<CardSkeleton />}>
      <div className="card">
        <img src={user.avatar} />
        <h3>{user.name}</h3>
      </div>
    </Suspense>
  )
}

// fetchUser 实现
function fetchUser(userId) {
  let user = null
  let status = 'pending'
  const promise = fetch(\`/api/users/\${userId}\`)
    .then(res => res.json())
    .then(data => {
      user = data
      status = 'fulfilled'
    })

  // 缓存 promise，避免重复请求
  cache.set(userId, promise)
  promise.status = status
  promise.user = user
  return promise
}`,5:`// Suspense List - React 18+
import { Suspense } from 'react'

function UserList({ userIds }) {
  return (
    <Suspense fallback={<Spinner />}>
      {userIds.map(id => (
        <UserCard key={id} userId={id} />
      ))}
    </Suspense>
  )
}

// 每个用户可以独立加载，不需要等待全部完成`};function S(){const[r,t]=o.useState(!1);return e.jsxs(n,{className:"code-page",title:"Suspense",subtitle:"声明式异步加载与代码分割",children:[e.jsx(a,{list:d}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"🎮 交互演示"}),e.jsx("p",{style:{color:"var(--white-alpha-70)",marginBottom:"1rem"},children:"点击按钮查看 Suspense 的加载效果"}),e.jsx("button",{onClick:()=>t(!r),style:{padding:"0.75rem 2rem",background:"linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)",border:"none",borderRadius:"8px",color:"white",fontSize:"1rem",cursor:"pointer",transition:"all 0.3s ease",fontWeight:"bold"},onMouseOver:s=>{s.currentTarget.style.transform="translateY(-2px)",s.currentTarget.style.boxShadow="0 10px 25px var(--code-indigo-alpha-30)"},onMouseOut:s=>{s.currentTarget.style.transform="translateY(0)",s.currentTarget.style.boxShadow="none"},children:r?"隐藏示例":"显示示例"})]}),r&&e.jsxs("div",{style:{marginTop:"1.5rem"},children:[e.jsx("h3",{style:{color:"var(--color-code-violet)",margin:"0 0 8px 0"},children:"📦 Lazy Loading 演示"}),e.jsx(l,{language:"tsx",code:`import { Suspense, lazy } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export default function Demo() {
  return (
    <Suspense fallback={<span>嘘，好戏即将开场...</span>}>
      <HeavyComponent />
    </Suspense>
  )
}`})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"💡 使用场景"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"代码分割"}),"：使用 React.lazy 按需加载大型组件"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"数据获取"}),"：配合 use() Hook 实现声明式数据加载"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"层级 fallback"}),"：为不同层级内容设置不同的加载状态"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"图片懒加载"}),"：在图片加载完成前显示占位符"]})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 注意事项"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• Suspense boundary 中的所有组件都必须被 Suspense 包裹"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• Lazy 组件只能作为默认导出"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 服务端渲染时需要特殊处理（使用 fallback 覆盖）"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:'• 避免"闪烁"：确保 fallback 和实际内容高度相似'})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-violet-alpha-10)",border:"1px solid var(--code-violet-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-violet)",marginBottom:"1rem"},children:"🔗 进阶：Suspense 配置"}),e.jsx(i,{code:`// Suspense 配合 use Transition
import { Suspense, useTransition } from 'react'

function SearchResults() {
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState([])

  const handleSearch = (query) => {
    // 标记为低优先级更新
    startTransition(() => {
      setResults(fetchSearchResults(query))
    })
  }

  return (
    <Suspense fallback={<Spinner />}>
      {/* isPending 时，之前的查询结果仍然可见 */}
      <ResultsList items={results} />
      {isPending && <LoadingIndicator />}
    </Suspense>
  )
}

// SuspenseList - 更好的列表渲染
import { SuspenseList } from 'react'

function DataList({ items }) {
  return (
    <SuspenseList fallback={<Skeleton />}>
      {items.map(item => (
        <Suspense fallback={<ItemSkeleton />}>
          <DataItem key={item.id} item={item} />
        </Suspense>
      ))}
    </SuspenseList>
  )
}`})]}),e.jsx("style",{children:`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `})]})}export{S as default};
