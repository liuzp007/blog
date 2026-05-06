import{r as n,j as o,a as s}from"./vendor-react-CC9qU9RZ.js";import{C as h}from"./index-Q60UGwvo.js";import{B as g}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const x={1:`Portal 提供了一种将子节点渲染到父组件 DOM 层次结构之外的 DOM 节点的方法
    它是 React 处理 modals、tooltips、dropdowns 等 UI 模式的理想选择`,2:`// 基本用法
import { createPortal } from 'react-dom'

function Modal({ children, isOpen }) {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    children,
    document.getElementById('modal-root')
  )
}

// 使用场景
function App() {
  return (
    <div id="app-root">
      <Modal isOpen={true}>
        <div className="modal">这是模态框</div>
      </Modal>

      {/* modal 会被渲染到 modal-root 而不是这里 */}
    </div>
  )
}`,3:`Portal 的事件冒泡：
    虽然 Portal 的 DOM 结构在父组件之外，但事件冒泡仍然会传播到 React 树的祖先
    这意味着父组件仍然可以捕获 Portal 中触发的事件`,4:`// 事件冒泡示例
function Parent() {
  const handleClick = (e) => {
    // 即使按钮在 Portal 中，父组件仍然能捕获事件
  }

  return (
    <section onClick={handleClick}>
      <Modal>
        <button onClick={e => {
          e.stopPropagation() // 阻止冒泡
        }}>
          点击我
        </button>
      </Modal>
    </section>
  )
}`,5:`// 多个 Portal 层级管理
import { createPortal } from 'react-dom'

const modalRoot = document.getElementById('modal-root')
const tooltipRoot = document.getElementById('tooltip-root')

function App() {
  return (
    <>
      <Modal>渲染到 {modalRoot}</Modal>
      <Tooltip>渲染到 {tooltipRoot}</Tooltip>

      {/* Portal 之间可以相互嵌套 */}
      <Modal>
        <Tooltip>嵌套的 Portal</Tooltip>
      </Modal>
    </>
  )
}`};function u(r){const a=n.useRef(null),[i,l]=n.useState(null);return n.useEffect(()=>{const t=document.createElement("div");t.id=r,document.body.appendChild(t),a.current=t;const d=document.getElementById(r)||t;return l(d),()=>{document.body.removeChild(t)}},[r]),i}function M({children:r,id:a}){const i=u(a);return i?s.createPortal(r,i):null}function R(){const[r,a]=n.useState(!1),[i,l]=n.useState(!1),[t,d]=n.useState({x:0,y:0}),c=n.useRef(null),p=e=>{d({x:e.clientX,y:e.clientY})};return o.jsxs(h,{className:"code-page",title:"React Portals",subtitle:"突破 DOM 层级限制的渲染方式",children:[o.jsx(g,{list:x}),o.jsx("div",{id:"modal-root",style:{position:"fixed",top:0,left:0}}),o.jsx("div",{id:"tooltip-root",style:{position:"fixed",top:0,left:0,pointerEvents:"none"}}),o.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[o.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"🎮 Portal 演示"}),o.jsxs("div",{style:{display:"flex",gap:"2rem",flexWrap:"wrap"},children:[o.jsxs("div",{style:{flex:1,minWidth:"200px"},children:[o.jsx("h4",{style:{color:"var(--white-alpha-80)",marginBottom:"1rem"},children:"模态框"}),o.jsx("button",{onClick:()=>a(!r),style:{padding:"0.75rem 1.5rem",background:"linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)",border:"none",borderRadius:"8px",color:"var(--color-white)",cursor:"pointer",fontWeight:"bold",transition:"all 0.3s ease"},onMouseOver:e=>{e.currentTarget.style.transform="translateY(-2px)",e.currentTarget.style.boxShadow="0 10px 25px var(--code-indigo-alpha-30)"},onMouseOut:e=>{e.currentTarget.style.transform="translateY(0)",e.currentTarget.style.boxShadow="none"},children:r?"关闭模态框":"打开模态框"})]}),o.jsxs("div",{style:{flex:1,minWidth:"200px"},children:[o.jsx("h4",{style:{color:"var(--white-alpha-80)",marginBottom:"1rem"},children:"Tooltip"}),o.jsx("div",{onMouseMove:p,onMouseEnter:()=>l(!0),onMouseLeave:()=>l(!1),style:{padding:"1rem",background:"var(--code-page-chip-bg-strong)",border:"1px dashed var(--code-page-chip-border)",borderRadius:"8px",textAlign:"center",cursor:"crosshair"},children:"鼠标悬停显示 Tooltip"})]})]})]}),s.createPortal(o.jsx(o.Fragment,{children:r&&o.jsx("div",{ref:c,style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"var(--black-alpha-70)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3,animation:"fadeIn 0.2s ease"},onClick:()=>a(!1),children:o.jsxs("div",{onClick:e=>e.stopPropagation(),style:{background:"var(--code-page-surface-panel-deep)",padding:"2rem",borderRadius:"12px",maxWidth:"400px",width:"90%",boxShadow:"var(--shadow-lg)",transform:"scale(0.9)",animation:"scaleIn 0.3s ease forwards"},children:[o.jsx("h2",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"这是一个 Portal 模态框"}),o.jsxs("p",{style:{color:"var(--white-alpha-70)",lineHeight:"1.6"},children:["模态框通过"," ",o.jsx("code",{style:{background:"var(--code-indigo-alpha-10)",color:"var(--color-code-indigo)",padding:"2px 6px",borderRadius:"4px"},children:"ReactDOM.createPortal()"})," ","渲染到"," ",o.jsx("code",{style:{background:"var(--code-indigo-alpha-10)",color:"var(--color-code-indigo)",padding:"2px 6px",borderRadius:"4px"},children:"#modal-root"})," ","容器中。"]}),o.jsx("p",{style:{color:"var(--white-alpha-70)",lineHeight:"1.6",marginBottom:"1.5rem"},children:"它突破了父组件的 DOM 层级，可以直接渲染到 document.body 下，避免了 z-index 和 overflow 的问题。"}),o.jsx("button",{onClick:()=>a(!1),style:{padding:"0.75rem 2rem",background:"linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)",border:"none",borderRadius:"8px",color:"var(--color-white)",cursor:"pointer",fontWeight:"bold"},children:"关闭"})]})})}),document.getElementById("modal-root")||document.body),s.createPortal(o.jsx(o.Fragment,{children:i&&o.jsx("div",{style:{position:"fixed",left:t.x+15,top:t.y+15,background:"var(--black-alpha-90)",color:"var(--color-white)",padding:"0.5rem 1rem",borderRadius:"6px",fontSize:"0.875rem",pointerEvents:"none",zIndex:1001,whiteSpace:"nowrap",boxShadow:"var(--shadow-sm)",animation:"fadeIn 0.2s ease"},children:"这是通过 Portal 渲染的 Tooltip"})}),document.getElementById("tooltip-root")||document.body),o.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[o.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 注意事项"}),o.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[o.jsx("li",{style:{marginBottom:"0.5rem"},children:"• Portal 只改变 DOM 结构，不影响 React 事件冒泡"}),o.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 需要确保目标容器元素存在（在 componentDidMount 中检查）"}),o.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 服务端渲染时需要特殊处理（Portal 需要在客户端渲染）"}),o.jsx("li",{style:{marginBottom:"0.5rem"},children:"• Portal 内容的样式需要考虑全局 CSS 冲突"})]})]}),o.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[o.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"💡 使用场景"}),o.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",gap:"1rem"},children:[{icon:"🎭",name:"Modals",desc:"对话框、弹窗"},{icon:"💬",name:"Tooltips",desc:"提示框"},{icon:"📋",name:"Dropdowns",desc:"下拉菜单"},{icon:"🖼️",name:"Lightboxes",desc:"图片查看器"},{icon:"🔔",name:"Notifications",desc:"通知气泡"},{icon:"📅",name:"Calendars",desc:"日期选择器"}].map((e,m)=>o.jsxs("div",{style:{padding:"1rem",background:"var(--code-green-alpha-05)",border:"1px solid var(--code-green-alpha-20)",borderRadius:"8px",textAlign:"center"},children:[o.jsx("div",{style:{fontSize:"2rem",marginBottom:"0.5rem"},children:e.icon}),o.jsx("div",{style:{fontWeight:"bold",color:"var(--color-code-green)",marginBottom:"0.25rem"},children:e.name}),o.jsx("div",{style:{fontSize:"0.8rem",color:"var(--white-alpha-60)"},children:e.desc})]},m))})]}),o.jsx("style",{children:`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `})]})}export{M as Portal,R as default};
