import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `StrictMode 是一个用于突出显示应用中潜在问题的工具
    它不会渲染可见的 UI，而是激活额外的检查和警告
    仅在开发模式下生效，生产环境不影响性能`,
  2: `// 基本用法
import { StrictMode } from 'react'

function App() {
  return (
    <StrictMode>
      <MainComponent />
    </StrictMode>
  )
}

// 只对部分组件启用
function App() {
  return (
    <div>
      <StrictMode>
        <Header />
        <Sidebar />
      </StrictMode>
      <Footer />
    </div>
  )
}`,
  3: `StrictMode 会激活以下检查：
    · 识别不安全的生命周期方法
    · 使用过时的字符串 ref API 发出警告
    · 检测意外的副作用
    · 检测过时的 Context API
    · 确保可复用组件状态不被意外修改`,
  4: `// 检测意外的副作用
function Example() {
  const [count, setCount] = useState(0)

  // ❌ 在渲染时修改外部状态
  useEffect(() => {
    setCount(1) // 每次渲染都触发 effect
  }, []) // 空依赖数组会导致无限循环

  // ✅ StrictMode 会双重调用 effect 来暴露这个问题
  useEffect(() => {
    setCount(1)
  }, [count]) // 正确的依赖
}

// StrictMode 会让组件渲染两次
// 第一次渲染：检测并记录问题
// 第二次渲染：确认修复有效`,
  5: `// 检测过时的 API
// ❌ 使用过时的字符串 ref
class OldComponent extends Component {
  render() {
    return <input ref="myInput" />
  }
}

// ✅ 使用回调 ref 或 useRef
function NewComponent() {
  const inputRef = useRef(null)
  return <input ref={inputRef} />
}

// StrictMode 会警告这些过时用法`
}

export default function StrictModePage() {
  return (
    <ContentWrapper className="code-page" title="React.StrictMode" subtitle="开发时检测潜在问题">
      <BeautifyCodeList list={data} />

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
          🔍 StrictMode 检测项
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}
        >
          {[
            { title: '不安全的生命周期', desc: 'componentWillMount 等已废弃的方法', icon: '⚠️' },
            { title: '过时的 ref API', desc: '字符串 ref 会被警告', icon: '📝' },
            { title: '意外的副作用', desc: 'render 中不应有副作用', icon: '🎭' },
            { title: '过时的 Context API', desc: 'old context 会被警告', icon: '🔄' },
            { title: '可重用组件状态', desc: '检测状态意外修改', icon: '🔒' },
            { title: '双重渲染', desc: '故意渲染两次暴露问题', icon: '👥' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: 'var(--code-indigo-alpha-05)',
                border: '1px solid var(--code-indigo-alpha-20)',
                borderRadius: '8px'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div
                style={{
                  fontWeight: 'bold',
                  color: 'var(--color-code-indigo)',
                  marginBottom: '0.25rem'
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--white-alpha-60)' }}>{item.desc}</div>
            </div>
          ))}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>💡 最佳实践</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>全应用包裹</strong>：在应用最外层添加 StrictMode
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>渐进式采用</strong>：可以从子组件开始，逐步扩大范围
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>关注警告</strong>：严格模式下修复所有控制台警告
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>测试副作用</strong>：确保组件在多次渲染时行为一致
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>不要在生产环境禁用</strong>：帮助捕获早期错误
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 常见问题</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>effect 执行两次</strong>：这是正常的，用于检测副作用
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>构造函数执行两次</strong>：state 初始化应该保证幂等性
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>第三方库警告</strong>：某些库可能不兼容 StrictMode
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>性能影响</strong>：仅开发模式，不影响生产性能
          </li>
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>
          🔗 React 18+ StrictMode 变化
        </h3>
        <BeautifyCode
          code={`// React 18 中 StrictMode 不会再双重调用 constructor
// 但会双重调用 render 和某些 effects

// React 18 对以下的支持：
// 1. Concurrent Features 支持
// 2. Suspense 更好的集成
// 3. 自动批处理（Automatic Batching）

// StrictMode 与 Concurrent Features 配合
import { StrictMode } from 'react'

function App() {
  return (
    <StrictMode>
      <Suspense fallback={<Loading />}>
        <MainApp />
      </Suspense>
    </StrictMode>
  )
}

// 注意：StrictMode 在生产环境中不会运行
if (process.env.NODE_ENV !== 'production') {
  // 启用 StrictMode 的额外开发模式功能
}`}
        />
      </div>

      {/* 性能对比表 */}
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
          📊 StrictMode 影响对比
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: 'var(--white-alpha-80)'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--code-indigo-alpha-30)' }}>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-indigo)' }}
              >
                特性
              </th>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-indigo)' }}
              >
                开发环境
              </th>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-indigo)' }}
              >
                生产环境
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem' }}>额外检查</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>✅ 启用</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-violet)' }}>❌ 无影响</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem' }}>双重渲染</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>✅ 启用</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-violet)' }}>❌ 禁用</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem' }}>双重 effect 调用</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>✅ 启用</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-violet)' }}>❌ 禁用</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>性能开销</td>
              <td style={{ padding: '0.75rem', color: 'var(--code-page-warning)' }}>有额外开销</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>无额外开销</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ContentWrapper>
  )
}
