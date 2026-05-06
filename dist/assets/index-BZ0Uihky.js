import{r as d,j as e,R as u}from"./vendor-react-CC9qU9RZ.js";import{C as g}from"./index-Q60UGwvo.js";import{B as h,a as x}from"./index-BrgpqR_A.js";import"./clsx-B-dksMZM.js";import"./vendor-ui-DjErHYBs.js";import"./vendor-utils-B3QcCpKH.js";function v(n,c){const[a,l]=d.useState(c),[r,s]=d.useState(!1);return[a,async t=>{s(!0);try{const o=await n(a,t);l(o)}finally{s(!1)}},r]}const f=()=>u.useActionState??v,y=f(),b={1:`useActionState 是 React 19 引入的新 Hook
    用于管理表单或其他需要乐观更新（Optimistic Updates）的场景
    它结合 Server Actions 使用，可以自动处理 pending、error 和 success 状态`,2:`// 基本语法
import { useActionState } from 'react'

function MyForm() {
  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    // 发送数据到服务器
    const response = await submitForm(formData)
    return response
  })

  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={isPending}>提交</button>
    </form>
  )
}`,3:`// useActionState 的状态结构
{
  // 当前状态
  state: any,

  // 用于 form action 的函数
  formAction: (payload: FormData) => void,

  // 是否有正在进行的 action
  pending: boolean,

  // 错误信息
  error: Error | null,

  // 上次成功的结果（如果 action 成功）
  result: any
}`,4:`// 乐观更新示例
function TodoList() {
  const [state, formAction, isPending] = useActionState(async (state, formData) => {
    // 立即更新 UI（乐观更新）
    const optimisticTodo = { id: Date.now(), title: formData.get('title') }

    // 实际提交到服务器
    const response = await addTodo(optimisticTodo)
    return response
  })

  return (
    <form action={formAction}>
      <input name="title" disabled={isPending} />
      <button disabled={isPending}>添加</button>
    </form>
  )
}`,5:`// 结合 Server Actions 的完整示例
'use server'

import { revalidatePath } from 'next/cache'

// Server Action
async function updateProfile(formData: FormData) {
  const name = formData.get('name')
  await db.users.update(session.user.id, { name })

  // 重新验证数据
  revalidatePath('/profile')

  return { success: true, name }
}

// Client Component
function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    // 初始状态
    initialState: { success: false, name: '' }
  })

  if (state.success) {
    return <SuccessMessage name={state.name} />
  }

  return (
    <form action={formAction}>
      <input name="name" defaultValue={state.name} disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? '保存中...' : '保存'}
      </button>
    </form>
  )
}`};function R(){const[n,c]=d.useState(0),[a,l]=d.useState([]),[r,s,i]=y(async(t,o)=>{const m=o.get("todo");return await new Promise(p=>setTimeout(p,1e3)),{success:!0,todo:m}},{success:!1,todo:""});return e.jsxs(g,{className:"code-page",title:"useActionState Hook",subtitle:"React 19 表单状态管理利器",children:[e.jsx(h,{list:b}),e.jsxs("div",{style:{marginTop:"2rem",padding:"1.5rem",background:"var(--code-indigo-alpha-10)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-indigo)",marginBottom:"1rem"},children:"📝 模拟 Server Action"}),e.jsxs("form",{onSubmit:t=>{t.preventDefault();const o=new FormData(t.currentTarget);s(o)},style:{maxWidth:"400px"},children:[e.jsx("div",{style:{marginBottom:"1rem"},children:e.jsx("input",{type:"text",name:"todo",placeholder:"输入待办事项...",defaultValue:r.todo,disabled:i,style:{width:"100%",padding:"0.75rem",background:"var(--code-page-surface-panel)",border:"1px solid var(--code-indigo-alpha-30)",borderRadius:"8px",color:"var(--color-white)",fontSize:"1rem"}})}),e.jsx("button",{type:"submit",disabled:i,style:{width:"100%",padding:"0.75rem",background:i?"var(--code-indigo-alpha-50)":"linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)",border:"none",borderRadius:"8px",color:"var(--color-white)",fontSize:"1rem",cursor:i?"not-allowed":"pointer",fontWeight:"bold",transition:"all 0.3s ease"},children:i?"添加中...":"添加"})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1rem",background:"var(--code-page-surface-panel)",borderRadius:"8px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"0.5rem"},children:[e.jsx("span",{style:{color:"var(--white-alpha-60)"},children:"状态:"}),e.jsx("span",{style:{color:r.success?"var(--color-code-green)":"var(--code-page-warning)",fontWeight:"bold"},children:r.success?"成功 ✓":"等待"})]}),r.todo&&e.jsxs("div",{style:{color:"var(--color-code-green)"},children:['添加的项: "',r.todo,'"']})]}),a.length>0&&e.jsxs("div",{style:{marginTop:"1rem"},children:[e.jsxs("h4",{style:{color:"var(--color-code-violet)",marginBottom:"0.5rem"},children:["已添加 ",n," 项"]}),e.jsx("div",{style:{maxHeight:"200px",overflowY:"auto",background:"var(--code-page-chip-bg-strong)",borderRadius:"8px",padding:"0.5rem"},children:a.map((t,o)=>e.jsxs("div",{style:{padding:"0.5rem",borderBottom:"1px solid var(--code-indigo-alpha-10)",fontSize:"0.875rem"},children:[o+1,". ",t]},o))})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-green-alpha-10)",border:"1px solid var(--code-green-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-green)",marginBottom:"1rem"},children:"💡 Hook 参数"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",color:"var(--white-alpha-80)"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-green-alpha-30)"},children:[e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",color:"var(--color-code-green)"},children:"参数"}),e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",color:"var(--color-code-green)"},children:"说明"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-page-chip-border)"},children:[e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"action"}),e.jsx("td",{style:{padding:"0.75rem"},children:"要执行的异步函数（必填）"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-page-chip-border)"},children:[e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"initialState"}),e.jsx("td",{style:{padding:"0.75rem"},children:"初始状态（可选）"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid var(--code-page-chip-border)"},children:[e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"permalink"}),e.jsx("td",{style:{padding:"0.75rem"},children:"用于 reset 的字符串标识"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.75rem",fontFamily:"monospace"},children:"revert"}),e.jsx("td",{style:{padding:"0.75rem"},children:"是否在 action 完成后重置到初始状态"})]})]})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-violet-alpha-10)",border:"1px solid var(--code-violet-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-violet)",marginBottom:"1rem"},children:"🔄 返回值状态说明"}),e.jsx(x,{code:`// state 对象结构
{
  // 当前状态（最新的返回值）
  state: { success: boolean, name: string },

  // 表单 action 函数（用于 <form>）
  formAction: (formData: FormData) => void,

  // 是否有正在进行的 action
  pending: boolean,

  // 错误信息（如果 action 抛出错误）
  error: Error | null,

  // 上次成功返回的结果
  result: { success: boolean, name: string },

  // 重置函数（将状态重置为 initialState）
  reset: () => void
}

// 使用示例
function MyForm() {
  const [state, formAction, isPending] = useActionState(submitForm)

  if (state.error) {
    return <ErrorMessage error={state.error} />
  }

  return (
    <form action={formAction}>
      <input name="email" disabled={isPending} />
      <button disabled={isPending}>
        {isPending ? '提交中...' : '提交'}
      </button>
    </form>
  )
}

// 处理完成后的重置
if (state.result?.success) {
  // 显示成功消息
  // 稍后调用 state.reset() 重置表单
}`})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-red-alpha-10)",border:"1px solid var(--code-red-alpha-30)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--color-code-red)",marginBottom:"1rem"},children:"⚠️ 注意事项"}),e.jsxs("ul",{style:{color:"var(--white-alpha-80)",lineHeight:1.8,listStyle:"none",padding:0},children:[e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 需要配合 Server Action 或返回 Promise 的函数使用"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• form action 应该绑定到原生 form 元素"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• isPending 在整个 action 期间都为 true"}),e.jsx("li",{style:{marginBottom:"0.5rem"},children:"• 错误会在 state.error 中返回，需要手动处理"})]})]}),e.jsxs("div",{style:{marginTop:"1.5rem",padding:"1.5rem",background:"var(--code-page-surface-panel)",borderRadius:"12px",position:"relative",zIndex:3},children:[e.jsx("h3",{style:{color:"var(--white-alpha-90)",marginBottom:"1rem"},children:"🔗 与其他 Hook 配合"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1rem"},children:[{name:"useFormStatus",desc:"获取表单的详细状态"},{name:"useFormState",desc:"在非 action 场景管理状态"},{name:"useOptimistic",desc:"专门的乐观更新 Hook"},{name:"useServerAction",desc:"直接调用 Server Actions"}].map((t,o)=>e.jsxs("div",{style:{padding:"1rem",background:"var(--code-page-chip-bg-strong)",border:"1px dashed var(--code-page-chip-border)",borderRadius:"8px"},children:[e.jsx("code",{style:{color:"var(--color-code-violet)",fontSize:"0.9rem"},children:t.name}),e.jsx("div",{style:{fontSize:"0.8rem",color:"var(--white-alpha-60)",marginTop:"0.5rem"},children:t.desc})]},o))})]})]})}export{R as default};
