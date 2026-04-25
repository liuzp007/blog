import React, { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'

// 兼容 Hook：在 React 18 环境下模拟 useActionState 的最小行为
// 返回 [state, formAction, pending]
function useActionStateCompat<S>(
  action: (prevState: S, formData: FormData) => Promise<S> | S,
  initialState: S
) {
  const [state, setState] = useState<S>(initialState)
  const [pending, setPending] = useState(false)

  const formAction = async (formData: FormData) => {
    setPending(true)
    try {
      const next = await action(state, formData)
      setState(next)
    } finally {
      setPending(false)
    }
  }

  return [state, formAction, pending] as const
}

// 选择原生或兼容实现（React 19 原生，React 18 使用本地兼容版）
const resolveUseActionState = () => {
  const anyReact = React as unknown as {
    useActionState?: <S>(
      a: (prev: S, formData: FormData) => Promise<S> | S,
      initial?: S
    ) => readonly [S, (fd: FormData) => void, boolean]
  }
  return anyReact.useActionState ?? (useActionStateCompat as any)
}
const useActionState = resolveUseActionState()

const data = {
  1: `useActionState 是 React 19 引入的新 Hook
    用于管理表单或其他需要乐观更新（Optimistic Updates）的场景
    它结合 Server Actions 使用，可以自动处理 pending、error 和 success 状态`,
  2: `// 基本语法
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
}`,
  3: `// useActionState 的状态结构
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
}`,
  4: `// 乐观更新示例
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
}`,
  5: `// 结合 Server Actions 的完整示例
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
}`
}

// 页面组件（默认导出）
export default function UseActionStatePage() {
  const [count, _setCount] = useState(0)
  const [todos, _setTodos] = useState<string[]>([])
  const [serverState, formAction, isPending] = useActionState(
    async (_state: { success: boolean; todo: string }, formData: FormData) => {
      const text = formData.get('todo') as string
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true, todo: text }
    },
    { success: false, todo: '' }
  )

  return (
    <ContentWrapper
      className="code-page"
      title="useActionState Hook"
      subtitle="React 19 表单状态管理利器"
    >
      <BeautifyCodeList list={data} />

      {/* 交互演示 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-indigo-alpha-10)',
          border: '1px solid var(--code-indigo-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>
          📝 模拟 Server Action
        </h3>

        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            ;(formAction as (fd: FormData) => void)(fd)
          }}
          style={{ maxWidth: '400px' }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              name="todo"
              placeholder="输入待办事项..."
              defaultValue={serverState.todo}
              disabled={isPending}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--code-page-surface-panel)',
                border: '1px solid var(--code-indigo-alpha-30)',
                borderRadius: '8px',
                color: 'var(--color-white)',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: isPending
                ? 'var(--code-indigo-alpha-50)'
                : 'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--color-white)',
              fontSize: '1rem',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {isPending ? '添加中...' : '添加'}
          </button>
        </form>

        {/* 状态展示 */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--code-page-surface-panel)',
            borderRadius: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--white-alpha-60)' }}>状态:</span>
            <span
              style={{
                color: serverState.success ? 'var(--color-code-green)' : 'var(--code-page-warning)',
                fontWeight: 'bold'
              }}
            >
              {serverState.success ? '成功 ✓' : '等待'}
            </span>
          </div>
          {serverState.todo && (
            <div style={{ color: 'var(--color-code-green)' }}>
              添加的项: &quot;{serverState.todo}&quot;
            </div>
          )}
        </div>

        {/* Todo 列表 */}
        {todos.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--color-code-violet)', marginBottom: '0.5rem' }}>
              已添加 {count} 项
            </h4>
            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                background: 'var(--code-page-chip-bg-strong)',
                borderRadius: '8px',
                padding: '0.5rem'
              }}
            >
              {todos.map((todo, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem',
                    borderBottom: '1px solid var(--code-indigo-alpha-10)',
                    fontSize: '0.875rem'
                  }}
                >
                  {index + 1}. {todo}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-green-alpha-10)',
          border: '1px solid var(--code-green-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>💡 Hook 参数</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: 'var(--white-alpha-80)'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--code-green-alpha-30)' }}>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-green)' }}
              >
                参数
              </th>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-green)' }}
              >
                说明
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>action</td>
              <td style={{ padding: '0.75rem' }}>要执行的异步函数（必填）</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>initialState</td>
              <td style={{ padding: '0.75rem' }}>初始状态（可选）</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>permalink</td>
              <td style={{ padding: '0.75rem' }}>用于 reset 的字符串标识</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>revert</td>
              <td style={{ padding: '0.75rem' }}>是否在 action 完成后重置到初始状态</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-violet-alpha-10)',
          border: '1px solid var(--code-violet-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>
          🔄 返回值状态说明
        </h3>
        <BeautifyCode
          code={`// state 对象结构
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
}`}
        />
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-red-alpha-10)',
          border: '1px solid var(--code-red-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 注意事项</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • 需要配合 Server Action 或返回 Promise 的函数使用
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• form action 应该绑定到原生 form 元素</li>
          <li style={{ marginBottom: '0.5rem' }}>• isPending 在整个 action 期间都为 true</li>
          <li style={{ marginBottom: '0.5rem' }}>• 错误会在 state.error 中返回，需要手动处理</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-page-surface-panel)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--white-alpha-90)', marginBottom: '1rem' }}>
          🔗 与其他 Hook 配合
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          {[
            { name: 'useFormStatus', desc: '获取表单的详细状态' },
            { name: 'useFormState', desc: '在非 action 场景管理状态' },
            { name: 'useOptimistic', desc: '专门的乐观更新 Hook' },
            { name: 'useServerAction', desc: '直接调用 Server Actions' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: 'var(--code-page-chip-bg-strong)',
                border: '1px dashed var(--code-page-chip-border)',
                borderRadius: '8px'
              }}
            >
              <code style={{ color: 'var(--color-code-violet)', fontSize: '0.9rem' }}>
                {item.name}
              </code>
              <div
                style={{ fontSize: '0.8rem', color: 'var(--white-alpha-60)', marginTop: '0.5rem' }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentWrapper>
  )
}
