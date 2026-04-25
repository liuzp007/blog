import { useState, createContext } from 'react'
import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'
import CodeBlock from '@/components/code-block'

const data = {
  1: `Context 提供了一种在组件树中跨层级传递数据的方式
    避免了"prop drilling"（属性逐层传递）的问题
    适用于：主题、语言、用户信息、路由等全局状态`,
  2: `// 创建 Context
const MyContext = createContext(defaultValue)

// 使用 Provider 包裹组件树
<MyContext.Provider value={/* 某个值 */}>
  <Component />
</MyContext.Provider>

// 在子组件中读取
const value = useContext(MyContext)`,
  3: `Context 的工作原理：
    · Context 对象包含 Provider 组件
    · Provider 接收一个 value 属性
    · 当 value 变化时，所有消费该 Context 的组件都会重新渲染
    · 可以使用 defaultValue 避免 Provider 缺失时的错误`,
  4: `// 创建多个 Context
const ThemeContext = createContext('light')
const UserContext = createContext({ name: 'Guest' })

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value={{ name: 'Alice' }}>
        <Main />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

// 在组件中使用
function Main() {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)

  return <div className={theme}>Hello, {user.name}</div>
}`,
  5: `// 性能优化：拆分 Context
// ❌ 不好的做法：所有状态放在一个 Context
const AppContext = createContext({
  user: null,
  theme: 'light',
  language: 'zh',
  settings: {},
  // ... 很多其他状态
})
// 任何一个变化都会导致所有消费者重新渲染

// ✅ 好的做法：拆分为多个 Context
const UserContext = createContext(null)
const ThemeContext = createContext('light')
const LanguageContext = createContext('zh')
// 只有使用该 Context 的组件才会在其变化时重新渲染`
}

// 说明：原先在此处定义了示例组件 ThemedButton（使用 ThemeContext）
// 为避免示例代码被编译参与运行且引用未定义的上下文，改为仅在 CodeBlock 中展示。

// Context 实例必须提升到组件外部，避免每次渲染重建导致所有消费者重新渲染
const ThemeContext = createContext('light')
const CountContext = createContext(0)

export default function ContextPage() {
  const [theme, setTheme] = useState('light')
  const [count, setCount] = useState(0)

  return (
    <ContentWrapper className="code-page" title="Context API" subtitle="跨组件层级共享状态">
      <BeautifyCodeList list={data} />

      {/* 交互式演示 */}
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🎮 交互演示</h3>

        <ThemeContext.Provider value={theme}>
          <CountContext.Provider value={count}>
            <div
              style={{
                padding: '1.5rem',
                background: 'var(--code-page-surface-panel)',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
                当前主题:{' '}
                <strong
                  style={{
                    color:
                      theme === 'dark' ? 'var(--color-code-violet)' : 'var(--code-page-warning)'
                  }}
                >
                  {theme}
                </strong>
              </p>
              <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
                当前计数:{' '}
                <strong style={{ color: 'var(--color-code-indigo)', fontSize: '2rem' }}>
                  {count}
                </strong>
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <button
                  onClick={() => setCount(c => c - 1)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--danger-soft-alpha-20)',
                    border: '1px solid var(--danger-soft-alpha-30)',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <button
                  onClick={() => setCount(c => c + 1)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--code-green-alpha-20)',
                    border: '1px solid var(--code-green-alpha-50)',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
                style={{
                  padding: '0.75rem 2rem',
                  background:
                    theme === 'dark'
                      ? 'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)'
                      : 'linear-gradient(135deg, var(--code-page-warning) 0%, var(--color-accent-orange) 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                切换主题
              </button>
            </div>
          </CountContext.Provider>
        </ThemeContext.Provider>
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 性能陷阱</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>单一 Context 问题</strong>：Context 值变化时，所有消费者都会重新渲染
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>对象引用问题</strong>：每次渲染创建新对象会导致不必要的更新
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>解决方案</strong>：拆分 Context 或使用 useMemo 缓存 value
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ color: 'var(--color-code-green)', margin: '0 0 8px 0' }}>💡 性能优化技巧</h3>
        <CodeBlock
          language="tsx"
          code={`// ❌ 不好的做法：每次渲染创建新的 value 对象
function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  return (
    // 每次 App 渲染都会创建新对象，导致消费者重新渲染
    <Context.Provider value={{ user, theme }}>
      <Child />
    </Context.Provider>
  )
}

// ✅ 好的做法：使用 useMemo 稳定引用
function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  const value = useMemo(() => ({ user, theme }), [user, theme])

  return (
    <Context.Provider value={value}>
      <Child />
    </Context.Provider>
  )
}

// ✅ 更好的做法：拆分 Context
const UserContext = createContext(null)
const ThemeContext = createContext('light')

function App() {
  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <Child />
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}

// 子组件按需消费，减少不必要的渲染
const Child = memo(function Child() {
  const theme = useContext(ThemeContext) // 只在 theme 变化时重新渲染
  return <div className={theme}>...</div>
})`}
        />
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>🔗 高级用法</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>Context.displayName</strong>：设置调试名称，便于 React DevTools 调试
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>条件消费</strong>：结合自定义 Hook 实现条件读取
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>与 Redux 配合</strong>：Context 只用于 UI 相关状态，业务状态用 Redux 管理
          </li>
        </ul>
        <CodeBlock
          language="tsx"
          code={`// 设置 displayName 便于调试
ThemeContext.displayName = 'ThemeContext'

// 自定义 Hook 添加条件逻辑
function useTheme() {
  const theme = useContext(ThemeContext)

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => {}
  }
}

// 使用
function Button() {
  const { theme, isDark } = useTheme()
  return <button className={isDark ? 'dark' : 'light'}>{theme}</button>
}`}
        />
      </div>
    </ContentWrapper>
  )
}
