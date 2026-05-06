import{r as s,j as e}from"./vendor-react-CC9qU9RZ.js";import{C as i}from"./index-Q60UGwvo.js";import{B as n,a as d}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const l={1:`useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，
  并返回当前的 state 以及与其配套的 dispatch 方法。`,2:`某些场景下，useReducer 会比 useState 更适用，
  例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等`,3:"React 会确保 dispatch 函数的标识是稳定的，并且不会在组件重新渲染时改变",4:"const [state, dispatch] = useReducer(reducer, { value: 0 })",5:`const reducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return {
                ...state,
                value: state.value + 1
            }
        case 'sub':
            return {
                ...state,
                value: state.value - 1
            }
        default:
            return state
    }
}`,6:`dispatch({
    type: 'add',
    value: state.value
})`},c=(r,o)=>{switch(o.type){case"add":return{...r,value:r.value+1};case"sub":return{...r,value:r.value-1};default:return r}};function v(){const[r,o]=s.useReducer(c,{value:0}),a=t=>{o({type:t})};return e.jsxs(i,{className:"code-page",title:"useReducer Hook",subtitle:"复杂状态管理的利器",children:[e.jsx(n,{list:l}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3,textAlign:"center"},children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1.5rem"},children:"🎮 交互演示"}),e.jsx("div",{style:{fontSize:"3rem",fontWeight:"bold",color:"var(--color-code-indigo)",marginBottom:"1.5rem",fontFamily:"Fira Code, monospace"},children:r.value}),e.jsxs("div",{style:{display:"flex",gap:"1rem",justifyContent:"center"},children:[e.jsx("button",{onClick:()=>a("sub"),style:{padding:"0.75rem 2rem",background:"linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)",border:"none",borderRadius:"8px",color:"white",fontSize:"1rem",cursor:"pointer",transition:"all 0.3s ease",fontWeight:"bold"},onMouseOver:t=>{t.currentTarget.style.transform="translateY(-2px)",t.currentTarget.style.boxShadow="0 10px 25px var(--code-indigo-alpha-30)"},onMouseOut:t=>{t.currentTarget.style.transform="translateY(0)",t.currentTarget.style.boxShadow="none"},children:"减少"}),e.jsx("button",{onClick:()=>a("add"),style:{padding:"0.75rem 2rem",background:"linear-gradient(135deg, var(--color-code-green) 0%, var(--color-success-strong) 100%)",border:"none",borderRadius:"8px",color:"white",fontSize:"1rem",cursor:"pointer",transition:"all 0.3s ease",fontWeight:"bold"},onMouseOver:t=>{t.currentTarget.style.transform="translateY(-2px)",t.currentTarget.style.boxShadow="0 10px 25px var(--code-green-alpha-30)"},onMouseOut:t=>{t.currentTarget.style.transform="translateY(0)",t.currentTarget.style.boxShadow="none"},children:"增加"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"💡 适用场景"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• state 逻辑复杂且包含多个子值"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 下一个 state 依赖于之前的 state"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 需要优化深层组件的性能（使用 context + dispatch）"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 注意事项"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• Reducer 必须是纯函数，不能有副作用"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 总是返回新的 state 对象，不要修改原 state"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 记得处理 default 分支，返回原 state"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-violet-alpha-10)",border:"1px solid var(--code-violet-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-violet)",marginBottom:"1rem"},children:"🔗 进阶用法"}),e.jsx(d,{code:`// 惰性初始化 state（仅初始化时执行）
const [state, dispatch] = useReducer(reducer, initialState, init);

// 使用 Immer 简化不可变更新
import { produce } from 'immer';
const reducer = produce((draft, action) => {
  switch (action.type) {
    case 'add':
      draft.value += 1; // 可以直接修改！
      break;
  }
});

// 结合 useContext 实现全局状态
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}`})]})]})}export{v as default};
