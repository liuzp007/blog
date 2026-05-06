import{r as l,j as e,R as d}from"./vendor-react-CC9qU9RZ.js";import{C as c}from"./index-Q60UGwvo.js";import{B as m}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const p={1:`React.Profiler 是一个用于测量渲染性能的工具
    它可以测量组件渲染的频率和耗时
    帮助开发者识别性能瓶颈并进行优化`,2:`// 基本用法
import { Profiler } from 'react'

function onRenderCallback(
  id,              // 组件的标识
  phase,           // 'mount' 或 'update'
  actualDuration,  // 组件渲染耗时（毫秒）
  baseDuration,    // 不使用 Profiler 时的预估渲染时间
  startTime,       // 开始渲染的时间戳
  commitTime,      // 提交到 DOM 的时间戳
) {
  // 记录性能数据
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>`,3:`// 测量多个组件
<Profiler id="App" onRender={onRenderCallback}>
  <Navigation />
  <Profiler id="Sidebar" onRender={onRenderCallback}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRenderCallback}>
    <MainContent />
  </Profiler>
</Profiler>`,4:`// Profiler 的使用场景
// 1. 开发环境分析
const isDevelopment = process.env.NODE_ENV === 'development'

{isDevelopment && (
  <Profiler id="ExpensiveComponent" onRender={onRenderCallback}>
    <ExpensiveComponent />
  </Profiler>
)}

// 2. 性能监控上报
function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 100) { // 超过 100ms
    // 发送到性能监控服务
    performanceMonitor.send({
      component: id,
      duration: actualDuration,
      timestamp: Date.now()
    })
  }
}

// 3. 识别不必要的渲染
const renderCounts = {}

function onRenderCallback(id) {
  renderCounts[id] = (renderCounts[id] || 0) + 1
}`,5:`// React DevTools Profiler
React DevTools 提供了图形化的性能分析工具：

// 1. 打开 DevTools Profiler 面板
// 2. 点击录制按钮
// 3. 与应用交互
// 4. 停止录制并查看火焰图

// 火焰图解读：
// - 每个条形代表一次渲染
// - 宽度表示耗时
// - 颜色深浅表示渲染次数
// - 可以展开查看子组件的渲染情况`};function s(){const[r,t]=d.useState(0);return e.jsxs("div",{style:{padding:"1rem",background:"var(--code-page-chip-bg-strong)",borderRadius:"8px",marginBottom:"0.5rem"},children:[e.jsxs("span",{children:["计数: ",r]}),e.jsx("button",{onClick:()=>t(o=>o+1),style:{marginLeft:"1rem",padding:"0.25rem 0.5rem",background:"var(--code-indigo-alpha-20)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"4px",color:"var(--color-code-indigo)",cursor:"pointer"},children:"+1"})]})}function g({renderCount:r,lastRenderTime:t,totalTime:o,avgRenderTime:a}){const n=d.useRef(null),i=d.useRef(null);return d.useEffect(()=>{n.current&&(n.current.textContent=String(r)),i.current&&(i.current.textContent=String(t))},[r,t,o,a]),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",gap:"1rem"},children:[e.jsxs("div",{style:{padding:"1rem",background:"var(--code-indigo-alpha-05)",borderRadius:"8px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.875rem",color:"var(--white-alpha-60)",marginBottom:"0.5rem"},children:"总渲染次数"}),e.jsx("div",{style:{fontSize:"2rem",fontWeight:"bold",color:"var(--color-code-indigo)"},ref:n,children:r})]}),e.jsxs("div",{style:{padding:"1rem",background:"var(--code-indigo-alpha-05)",borderRadius:"8px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.875rem",color:"var(--white-alpha-60)",marginBottom:"0.5rem"},children:"上次渲染耗时"}),e.jsxs("div",{style:{fontSize:"2rem",fontWeight:"bold",color:t>50?"var(--color-code-red)":"var(--color-code-green)"},ref:i,children:[t,e.jsx("span",{style:{fontSize:"1rem",marginLeft:"0.25rem"},children:"ms"})]})]}),e.jsxs("div",{style:{padding:"1rem",background:"var(--code-indigo-alpha-05)",borderRadius:"8px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.875rem",color:"var(--white-alpha-60)",marginBottom:"0.5rem"},children:"总耗时"}),e.jsxs("div",{style:{fontSize:"2rem",fontWeight:"bold",color:"var(--color-code-violet)"},children:[o,e.jsx("span",{style:{fontSize:"1rem",marginLeft:"0.25rem"},children:"ms"})]})]}),e.jsxs("div",{style:{padding:"1rem",background:"var(--code-indigo-alpha-05)",borderRadius:"8px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.875rem",color:"var(--white-alpha-60)",marginBottom:"0.5rem"},children:"平均耗时"}),e.jsxs("div",{style:{fontSize:"2rem",fontWeight:"bold",color:a>30?"var(--color-code-red)":"var(--color-code-green)"},children:[a,e.jsx("span",{style:{fontSize:"1rem",marginLeft:"0.25rem"},children:"ms"})]})]})]})}function j(){const r=l.useRef({renderCount:0,lastRenderTime:0,totalTime:0}),t=l.useRef([]),[o,a]=l.useState({renderCount:0,lastRenderTime:0,totalTime:0,avgRenderTime:0});return e.jsxs(c,{className:"code-page",title:"React.Profiler",subtitle:"测量和优化组件渲染性能",children:[e.jsx(m,{list:p}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"📊 实时性能监控"}),e.jsx(g,{renderCount:o.renderCount,lastRenderTime:o.lastRenderTime,totalTime:o.totalTime,avgRenderTime:o.avgRenderTime}),e.jsx("div",{style:{marginTop:"1.5rem",padding:"1rem",background:"var(--code-page-surface-panel)",borderRadius:"8px"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"},children:[e.jsx("div",{style:{width:"12px",height:"12px",borderRadius:"50%",background:o.avgRenderTime<=16?"var(--color-code-green)":o.avgRenderTime<=50?"var(--code-page-warning)":"var(--color-code-red)"}}),e.jsxs("span",{style:{color:"var(--white-alpha-80)"},children:["性能评级:"," ",e.jsx("strong",{style:{color:o.avgRenderTime<=16?"var(--color-code-green)":o.avgRenderTime<=50?"var(--code-page-warning)":"var(--color-code-red)"},children:o.avgRenderTime<=16?"优秀":o.avgRenderTime<=50?"良好":"需优化"})]})]})})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"🎮 性能测试区域"}),e.jsx("p",{style:{color:"var(--white-alpha-70)",marginBottom:"1rem"},children:"点击按钮触发渲染，观察上方性能指标的变化"}),e.jsx("button",{onClick:()=>{r.current.renderCount+=1,r.current.lastRenderTime=Math.round(Math.random()*30+5),r.current.totalTime+=r.current.lastRenderTime,r.current.renderCount===1&&(r.current.totalTime=r.current.lastRenderTime,t.current=[]),t.current.push(r.current.lastRenderTime),a({renderCount:r.current.renderCount,lastRenderTime:r.current.lastRenderTime,totalTime:r.current.totalTime,avgRenderTime:Math.round(r.current.totalTime/r.current.renderCount)})},style:{padding:"0.75rem 2rem",background:"linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)",border:"none",borderRadius:"8px",color:"white",fontSize:"1rem",cursor:"pointer",fontWeight:"bold",transition:"transform 0.3s ease, box-shadow 0.3s ease"},onMouseOver:n=>{n.currentTarget.style.transform="translateY(-2px)",n.currentTarget.style.boxShadow="0 10px 25px var(--code-indigo-alpha-30)"},onMouseOut:n=>{n.currentTarget.style.transform="translateY(0)",n.currentTarget.style.boxShadow="none"},children:"强制重渲染"}),e.jsx(s,{}),e.jsx(s,{})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-page-surface-panel)",borderRadius:"8px"},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 性能优化建议"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"减少渲染次数"}),"：使用 React.memo、useMemo、useCallback"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"代码分割"}),"：使用 React.lazy 按需加载大型组件"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"虚拟化长列表"}),"：使用 react-window 或 react-virtualized"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"避免内联函数"}),"：在 JSX 中创建函数会导致子组件重新渲染"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• ",e.jsx("strong",{children:"使用 Transition"}),"：将低优先级更新标记为 transition"]})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-violet-alpha-10)",border:"1px solid var(--code-violet-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-violet)",marginBottom:"1rem"},children:"📋 渲染历史"}),e.jsx("div",{style:{maxHeight:"200px",overflowY:"auto",background:"var(--code-page-surface-panel)",borderRadius:"8px",padding:"1rem",fontSize:"0.875rem"},children:t.current.length>0?t.current.map((n,i)=>e.jsxs("div",{style:{padding:"0.5rem",borderBottom:"1px solid var(--code-indigo-alpha-10)",fontSize:"0.8rem",display:"flex",justifyContent:"space-between"},children:[e.jsxs("span",{style:{color:"var(--white-alpha-70)"},children:["#",i+1]}),e.jsxs("span",{style:{color:n>50?"var(--color-code-red)":n>20?"var(--code-page-warning)":"var(--color-code-green)",fontWeight:"bold"},children:[n,"ms"]})]},i)):e.jsx("div",{style:{color:"var(--white-alpha-50)",textAlign:"center"},children:"暂无渲染数据"})})]})]})}export{j as default};
