import { useReducer } from 'react'
import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，
  并返回当前的 state 以及与其配套的 dispatch 方法。`,
  2: `某些场景下，useReducer 会比 useState 更适用，
  例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等`,
  3: `React 会确保 dispatch 函数的标识是稳定的，并且不会在组件重新渲染时改变`,
  4: `const [state, dispatch] = useReducer(reducer, { value: 0 })`,
  5: `const reducer = (state, action) => {
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
}`,
  6: `dispatch({
    type: 'add',
    value: state.value
})`
}

const reducer = (state: { value: number }, action: { type: string }) => {
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
}

export default function UseReducer() {
  const [state, dispatch] = useReducer(reducer, { value: 0 })

  const changeValue = (type: string) => {
    dispatch({
      type
    })
  }

  return (
    <ContentWrapper className="code-page" title="useReducer Hook" subtitle="复杂状态管理的利器">
      <BeautifyCodeList list={data} />

      {/* Interactive Demo */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-indigo-alpha-10)',
          border: '1px solid var(--code-indigo-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3,
          textAlign: 'center'
        }}
      >
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1.5rem' }}>🎮 交互演示</h3>
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'var(--color-code-indigo)',
            marginBottom: '1.5rem',
            fontFamily: 'Fira Code, monospace'
          }}
        >
          {state.value}
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => changeValue('sub')}
            style={{
              padding: '0.75rem 2rem',
              background:
                'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 'bold'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 25px var(--code-indigo-alpha-30)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            减少
          </button>
          <button
            onClick={() => changeValue('add')}
            style={{
              padding: '0.75rem 2rem',
              background:
                'linear-gradient(135deg, var(--color-code-green) 0%, var(--color-success-strong) 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 'bold'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 25px var(--code-green-alpha-30)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            增加
          </button>
        </div>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>💡 适用场景</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>• state 逻辑复杂且包含多个子值</li>
          <li style={{ marginBottom: '0.5rem' }}>• 下一个 state 依赖于之前的 state</li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 需要优化深层组件的性能（使用 context + dispatch）
          </li>
        </ul>
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
          <li style={{ marginBottom: '0.5rem' }}>• Reducer 必须是纯函数，不能有副作用</li>
          <li style={{ marginBottom: '0.5rem' }}>• 总是返回新的 state 对象，不要修改原 state</li>
          <li style={{ marginBottom: '0.5rem' }}>• 记得处理 default 分支，返回原 state</li>
        </ul>
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>🔗 进阶用法</h3>
        <BeautifyCode
          code={`// 惰性初始化 state（仅初始化时执行）
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
}`}
        />
      </div>
    </ContentWrapper>
  )
}
