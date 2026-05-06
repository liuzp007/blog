import{R as d,j as e}from"./vendor-react-CC9qU9RZ.js";import{S as n,v as a,w as i}from"./vendor-ui-DjErHYBs.js";import{C as s}from"./index-Q60UGwvo.js";import"./clsx-B-dksMZM.js";const c=[{name:"beforeCreate",desc:"实例初始化之后，组件创建之前"},{name:"created",desc:"实例已创建，属性和方法已注入"},{name:"beforeMount",desc:"挂载开始，真实 DOM 尚未生成"},{name:"mounted",desc:"DOM 已挂载，可以安全访问 DOM"},{name:"beforeUpdate",desc:"响应式数据更新，准备重新渲染"},{name:"updated",desc:"DOM 已完成本轮更新"},{name:"beforeUnmount",desc:"组件即将卸载，适合做清理"},{name:"unmounted",desc:"组件已卸载，副作用应全部结束"}],l=`export default {
  data() {
    return { count: 0 }
  },
  beforeCreate() {
    // 1. beforeCreate
  },
  created() {
    // 2. created
  },
  beforeMount() {
    // 3. beforeMount
  },
  mounted() {
    // 4. mounted
    this.count = 1
  },
  beforeUpdate() {
    // 5. beforeUpdate
  },
  updated() {
    // 6. updated
  },
  beforeDestroy() {
    // 7. beforeDestroy
  },
  destroyed() {
    // 8. destroyed
  }
}`,p=`import {
  ref,
  onMounted,
  onBeforeUnmount,
  onUpdated
} from 'vue'

export default {
  setup() {
    const count = ref(0)

    onMounted(() => {
      // mounted
      count.value = 1
    })

    onUpdated(() => {
      // updated
    })

    onBeforeUnmount(() => {
      // beforeUnmount
    })

    return { count }
  }
}`,m=[{title:"数据初始化",desc:"优先在 created / setup 中发起请求，让页面尽早拿到业务数据。",tone:"var(--code-page-tone-info)"},{title:"DOM 操作",desc:"需要真实 DOM 或第三方实例时，放到 mounted / onMounted 中执行。",tone:"var(--code-page-tone-success)"},{title:"副作用清理",desc:"定时器、事件监听、订阅、图表实例都要在 beforeUnmount 中释放。",tone:"var(--code-page-tone-danger)"}];function v(){const[r,t]=d.useState("options");return e.jsxs(s,{className:"code-page",title:"生命周期钩子",subtitle:"Vue 组件的创建、挂载、更新与销毁",children:[e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"0.75rem"},children:"🔄 生命周期流程"}),e.jsx("div",{style:{color:"var(--code-page-text-soft)",lineHeight:1.8},children:"Vue 2 以 Options API 生命周期命名为主，Vue 3 在 Composition API 中把这些阶段拆成更显式的 Hook。"})]}),e.jsx(n,{value:r,onChange:o=>t(o),options:[{label:"Options API",value:"options"},{label:"Composition API",value:"composition"}]})]}),e.jsx("div",{style:{marginTop:"1.5rem",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"1rem"},children:c.map(o=>e.jsxs(a,{bordered:!1,style:{background:r==="options"?"var(--code-page-tone-info)":"var(--code-page-tone-success)",borderRadius:"12px"},bodyStyle:{padding:"1rem"},children:[e.jsx(i,{color:r==="options"?"processing":"success",className:"ui-tag",children:o.name}),e.jsx("div",{style:{marginTop:"0.75rem",color:"var(--code-page-text-muted)",lineHeight:1.7},children:o.desc})]},o.name))})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-page-surface-panel-strong)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:r==="options"?"var(--color-code-indigo)":"var(--color-code-green)",marginBottom:"1rem"},children:r==="options"?"📝 Options API 示例":"🧩 Composition API 示例"}),e.jsx("pre",{style:{margin:0,background:"var(--code-page-code-block-bg)",padding:"1rem",borderRadius:"8px",overflow:"auto",fontSize:"0.875rem",color:"var(--code-page-code-ice)"},children:e.jsx("code",{children:r==="options"?l:p})})]}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"💡 实践场景"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"1rem"},children:m.map(o=>e.jsxs("div",{style:{padding:"1rem",background:o.tone,borderRadius:"10px"},children:[e.jsx("div",{style:{color:"var(--color-white)",fontSize:"1rem",fontWeight:700,marginBottom:"0.5rem"},children:o.title}),e.jsx("div",{style:{color:"var(--code-page-text-soft)",lineHeight:1.7},children:o.desc})]},o.title))})]}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 最佳实践"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,paddingLeft:"1.25rem",margin:0},children:[e.jsx("li",{children:"请求数据优先放在 created 或 setup 中，不要等 DOM 挂载后再开始初始化。"}),e.jsx("li",{children:"依赖真实 DOM 的逻辑，统一放在 mounted / onMounted 中，避免访问时机错误。"}),e.jsx("li",{children:"定时器、事件、订阅、图表实例都要在 beforeUnmount / onBeforeUnmount 中清理。"}),e.jsx("li",{children:"不要在 updated 钩子里做会再次触发更新的写操作，否则很容易进入循环。"}),e.jsx("li",{children:"迁移到 Vue 3 时，先把副作用边界理顺，再机械替换生命周期名字。"})]})]})]})}export{v as default};
