import{r as o,j as e}from"./vendor-react-CC9qU9RZ.js";import{C as v}from"./index-Q60UGwvo.js";import{B as y}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const f={1:`React 18 引入了并发渲染（Concurrent Rendering）
    它允许 React 中断、暂停或放弃渲染
    使高优先级的更新能够优先处理，提升用户体验`,2:`// useTransition - 标记低优先级更新
import { useTransition } from 'react'

function Search() {
  const [input, setInput] = useState('')
  const [list, setList] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleChange = (e) => {
    // 高优先级：立即更新输入框
    setInput(e.target.value)

    // 低优先级：延迟更新搜索结果
    startTransition(() => {
      setList(filterList(e.target.value))
    })
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList items={list} />
    </div>
  )
}

// isPending 表示 transition 是否在进行中`,3:`// useDeferredValue - 延迟低优先级部分
import { useDeferredValue } from 'react'

function ProductList({ products }) {
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)

  const filtered = products.filter(p =>
    p.name.includes(deferredFilter)
  )

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ProductItems items={filtered} />
    </div>
  )
}

// 当 filter 快速变化时，组件使用旧的 deferred 值保持响应`,4:`// startTransition - 不使用 Hook 的版本
import { startTransition } from 'react'

function updateSearchResults(query) {
  // 这个更新会被标记为 transition
  startTransition(() => {
    setSearchResults(fetchResults(query))
    setPage(1)
  })
}

// 与 setState 配合使用，类似批量更新`,5:`// Transition 的优先级机制
// 用户交互：点击、输入 → 高优先级
// 数据获取、状态更新 → 低优先级

// 示例：输入搜索词
function handleSearch(query) {
  // 立即更新输入框（高优先级）
  setSearchQuery(query)

  // 延迟更新结果（低优先级）
  startTransition(() => {
    setSearchResults(performSearch(query))
  })
}

// React 会优先处理输入框更新
// 保证输入响应，不会因为搜索计算而卡顿`};function C(){const[a,l]=o.useState(""),[c,j]=o.useState([]),[s,p]=o.useState([]),[n,h]=o.useTransition(),[m,g]=o.useState(0),x=r=>{const t=[];for(let i=1;i<=50;i++)r&&i.toString().includes(r)&&t.push(`搜索结果 ${i}: ${r} 匹配项`);return t},u=r=>{l(r),h(()=>{const t=x(r);p(t),g(i=>i+1)})},d=s.length>0?s:c;return e.jsxs(v,{className:"code-page",title:"并发特性 (Concurrent Features)",subtitle:"React 18+ 优先级调度与响应优化",children:[e.jsx(y,{list:f}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"🎮 并发特性演示"}),e.jsxs("p",{style:{color:"var(--white-alpha-70)",marginBottom:"1rem"},children:["输入搜索关键词，体验"," ",e.jsx("code",{style:{background:"var(--code-indigo-alpha-10)",color:"var(--color-code-indigo)",padding:"2px 6px",borderRadius:"4px"},children:"useTransition"})," ","如何保持 UI 响应"]}),e.jsxs("div",{style:{marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{display:"flex",gap:"1rem",marginBottom:"0.5rem",alignItems:"center"},children:[e.jsx("input",{type:"text",value:a,onChange:r=>u(r.target.value),placeholder:"输入 1-50 之间的数字...",style:{flex:1,padding:"0.75rem 1rem",background:"var(--code-page-surface-panel)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"8px",color:"var(--color-white)",fontSize:"1rem"}}),n&&e.jsx("div",{style:{padding:"0.5rem 1rem",background:"var(--code-indigo-alpha-20)",borderRadius:"8px",animation:"pulse 1s infinite"},children:"搜索中..."})]}),e.jsx("div",{style:{padding:"1rem",background:"var(--code-page-surface-panel)",borderRadius:"8px",minHeight:"200px"},children:d.length===0?e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"var(--white-alpha-50)"},children:"输入关键词查看搜索结果"}):e.jsx("div",{style:{maxHeight:"200px",overflowY:"auto"},children:d.map((r,t)=>e.jsx("div",{style:{padding:"0.5rem",borderBottom:"1px solid var(--code-indigo-alpha-10)",fontSize:"0.875rem",color:"var(--white-alpha-80)",animation:`fadeIn 0.2s ease ${t*.05}s forwards`,opacity:0},children:r},t))})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"1rem",marginTop:"1rem"},children:[e.jsxs("div",{style:{padding:"0.75rem",background:"var(--code-indigo-alpha-05)",borderRadius:"6px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.75rem",color:"var(--white-alpha-60)"},children:"搜索次数"}),e.jsx("div",{style:{fontSize:"1.25rem",fontWeight:"bold",color:"var(--color-code-indigo)"},children:m})]}),e.jsxs("div",{style:{padding:"0.75rem",background:"var(--code-indigo-alpha-05)",borderRadius:"6px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.75rem",color:"var(--white-alpha-60)"},children:"结果数量"}),e.jsx("div",{style:{fontSize:"1.25rem",fontWeight:"bold",color:"var(--color-code-green)"},children:s.length})]}),e.jsxs("div",{style:{padding:"0.75rem",background:"var(--code-indigo-alpha-05)",borderRadius:"6px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.75rem",color:"var(--white-alpha-60)"},children:"状态"}),e.jsx("div",{style:{fontSize:"1rem",fontWeight:"bold",color:n?"var(--code-page-warning)":"var(--color-code-green)"},children:n?"处理中":"就绪"})]})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 使用注意事项"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"Transition 是可中断的"}),"：高优先级更新会中断正在进行的 transition"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"状态一致性"}),"：transition 期间读取的 state 可能是过期的"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"服务器渲染"}),"：SSR 时需要特殊处理并发特性"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"兼容性"}),"：需要 React 18+ 和支持并发的渲染器"]})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"💡 适用场景"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1rem"},children:[{icon:"🔍",title:"搜索输入",desc:"输入时立即更新，结果延迟计算"},{icon:"📋",title:"列表过滤",desc:"大量数据过滤使用 deferred"},{icon:"🎨",title:"图表渲染",desc:"复杂图表延迟重绘"},{icon:"📝",title:"表单输入",desc:"输入即时响应，提交使用 transition"},{icon:"🖼️",title:"图片加载",desc:"缩略图过滤使用 deferred"},{icon:"📊",title:"数据面板",desc:"实时数据 deferred 更新"}].map((r,t)=>e.jsxs("div",{style:{padding:"1rem",background:"var(--code-green-alpha-05)",border:"1px solid var(--code-green-alpha-20)",borderRadius:"8px"},children:[e.jsx("div",{style:{fontSize:"1.5rem",marginBottom:"0.5rem"},children:r.icon}),e.jsx("div",{style:{fontWeight:"bold",color:"var(--color-code-green)",marginBottom:"0.25rem"},children:r.title}),e.jsx("div",{style:{fontSize:"0.8rem",color:"var(--white-alpha-60)"},children:r.desc})]},t))})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-violet-alpha-10)",border:"1px solid var(--code-violet-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-violet)",marginBottom:"1rem"},children:"🔗 API 对比"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",color:"var(--white-alpha-80)"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-violet-alpha-30)"},children:[e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",color:"var(--color-code-violet)"},children:"Hook"}),e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",color:"var(--color-code-violet)"},children:"用途"}),e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",color:"var(--color-code-violet)"},children:"返回值"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-page-chip-border)"},children:[e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"useTransition"}),e.jsx("td",{style:{padding:"0.75rem"},children:"标记低优先级更新"}),e.jsx("td",{style:{padding:"0.75rem"},children:"[isPending, startTransition]"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-page-chip-border)"},children:[e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"useDeferredValue"}),e.jsx("td",{style:{padding:"0.75rem"},children:"延迟值的更新"}),e.jsx("td",{style:{padding:"0.75rem"},children:"延迟版本的值"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"useId"}),e.jsx("td",{style:{padding:"0.75rem"},children:"稳定 ID 生成（React 19）"}),e.jsx("td",{style:{padding:"0.75rem"},children:"唯一 ID"})]})]})]})]}),e.jsx("style",{children:`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `})]})}export{C as default};
