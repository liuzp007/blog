import{j as e}from"./vendor-react-CC9qU9RZ.js";import{C as r}from"./index-Q60UGwvo.js";import{B as o}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";const t={1:`如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，
  以此通过记忆组件渲染结果的方式来提高组件的性能表现。
  这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。`,2:`React.memo 仅检查 props 变更。如果函数组件被 React.memo 包裹，
  且其实现中拥有 useState，useReducer 或 useContext 的 Hook，
  当 state 或 context 发生变化时，它仍会重新渲染。`,3:`默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，
  那么请将自定义的比较函数通过第二个参数传入来实现。
  function MyComponent(props) {
    /* 使用 props 渲染 */
  }
  function areEqual(prevProps, nextProps) {
    /*
    如果把 nextProps 传入 render 方法的返回结果与
    将 prevProps 传入 render 方法的返回结果一致则返回 true，
    否则返回 false
    */
  }
  export default React.memo(MyComponent, areEqual);`,4:`与 class 组件中 shouldComponentUpdate() 方法不同的是，
  如果 props 相等，areEqual 会返回 true；如果 props 不相等，则返回 false。
  这与 shouldComponentUpdate 方法的返回值相反。 `,5:'仅作为性能优化的方式而存在。但请不要依赖它来"阻止"渲染，因为这会产生 未知bug。'};function p(){return e.jsxs(r,{className:"code-page",title:"React.memo",subtitle:"组件渲染性能优化利器",children:[e.jsx(o,{list:t}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"🎯 使用场景"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 纯展示型组件，相同 props 总是渲染相同结果"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 父组件频繁重新渲染，但子组件 props 很少变化"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 大型列表渲染，每个列表项都可以用 memo 包裹"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 注意事项"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• memo 包裹的组件仍会在内部 state/context 变化时重新渲染"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 默认浅比较：对象/数组引用变化才会触发重渲染"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:'• 自定义比较函数返回 true 表示"props 相等，不重渲染"'}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 过度使用可能适得其反，比较本身也有性能开销"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"🔗 配合使用"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• 与"," ",e.jsx("code",{style:{background:"var(--code-page-pink-soft)",color:"var(--code-page-pink)",padding:"2px 6px",borderRadius:"4px"},children:"useCallback"})," ","配合：保持函数引用稳定"]}),e.jsxs("li",{style:{marginBottom:"0.5rem"},children:["• 与"," ",e.jsx("code",{style:{background:"var(--code-page-pink-soft)",color:"var(--code-page-pink)",padding:"2px 6px",borderRadius:"4px"},children:"useMemo"})," ","配合：保持对象/数组引用稳定"]})]})]})]})}export{p as default};
