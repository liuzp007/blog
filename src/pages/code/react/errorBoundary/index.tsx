import { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `Error Boundary 是 React 组件，可以捕获其子组件树中任何位置的 JavaScript 错误
    记录错误，并显示备用 UI
    它只能捕获类组件中生命周期函数、构造函数和渲染函数中的错误`,
  2: `// 基本用法
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 可以将错误日志上报给服务器
    logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 可以自定义降级 UI
      return this.props.fallback
    }

    return this.props.children
  }
}

// 使用
<ErrorBoundary fallback={<ErrorPage />}>
  <MyComponent />
</ErrorBoundary>`,
  3: `Error Boundary 无法捕获的场景：
    · 事件处理器（如 onClick、onChange）
    · 异步代码（如 setTimeout、requestAnimationFrame）
    · 服务端渲染
    · 它自身抛出的错误（而非子组件）`,
  4: `// 使用 Error Boundary 包装整个应用
class App extends Component {
  render() {
    return (
      <ErrorBoundary
        FallbackComponent={GlobalErrorFallback}
        onError={(error, errorInfo) => {
          console.error('Error caught:', error, errorInfo)
          // 发送到错误追踪服务
          errorReportingService.capture(error)
        }}
      >
        <MainNavigation />
      </ErrorBoundary>
    )
  }
}

// 分层 Error Boundary
function App() {
  return (
    // 顶层：捕获致命错误，显示整个页面
    <ErrorBoundary fallback={<FatalErrorPage />}>
      <ErrorBoundary fallback={<NavigationError />}>
        <Navigation />
      </ErrorBoundary>

      <ErrorBoundary fallback={<ContentError />}>
        <MainContent />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SidebarError />}>
        <Sidebar />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}`,
  5: `// Error Boundary 配合 Suspense
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function Profile() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Spinner />}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  )
}

// 当 Suspense 抛出 promise rejection 时
// Error Boundary 会捕获并显示 fallback`
}

// 下面的路由示例仅作为文档说明，实际项目中请在路由层集成 ErrorBoundary。

export default function ErrorBoundaryPage() {
  const [hasError, setHasError] = useState(false)

  const triggerError = () => {
    setHasError(true)
  }

  const resetError = () => {
    setHasError(false)
  }

  return (
    <ContentWrapper className="code-page" title="Error Boundary" subtitle="优雅处理组件错误">
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🎮 交互演示</h3>

        {!hasError ? (
          <>
            <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
              点击下方按钮触发错误，查看 Error Boundary 的效果
            </p>
            <button
              onClick={triggerError}
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
              触发错误
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                padding: '2rem',
                background: 'var(--code-red-alpha-10)',
                border: '1px solid var(--code-red-alpha-30)',
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💥</div>
              <h3 style={{ color: 'var(--color-code-red)', marginBottom: '0.5rem' }}>
                哎呀，出错了！
              </h3>
              <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
                Error Boundary 捕获了组件树中的错误
              </p>
              <button
                onClick={resetError}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'var(--code-green-alpha-20)',
                  border: '1px solid var(--code-green-alpha-50)',
                  borderRadius: '8px',
                  color: 'var(--color-code-green)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                重新加载
              </button>
            </div>
            <button
              onClick={resetError}
              style={{
                padding: '0.75rem 2rem',
                background:
                  'linear-gradient(135deg, var(--color-code-green) 0%, var(--color-success-strong) 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              恢复正常状态
            </button>
          </>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>💡 最佳实践</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>分层使用</strong>：不同模块使用独立的 Error Boundary
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>错误上报</strong>：在 componentDidCatch 中将错误发送到追踪服务
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>友好的 fallback</strong>：提供有用的错误信息和恢复选项
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>不要过度使用</strong>：只在关键位置使用，避免掩盖真正的问题
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
          <li style={{ marginBottom: '0.5rem' }}>
            • Error Boundary 无法捕获事件处理器和异步代码中的错误
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 无法捕获服务端渲染中的错误（需要在服务端处理）
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• React 19+：推荐使用函数组件的错误处理方式</li>
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
          🔄 React 19+ 错误处理
        </h3>
        <BeautifyCode
          code={`// React 19 引入了 Error Boundary 的函数组件写法

import { useErrorBoundary } from 'react'

// 使用 useErrorBoundary Hook
function ProfileForm() {
  const [error, resetErrorBoundary] = useErrorBoundary()

  if (error) {
    return (
      <div className="error-fallback">
        <h2>出错了</h2>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>重试</button>
      </div>
    )
  }

  return <form>...</form>
}

// 或者直接作为组件使用
<ErrorBoundary fallback={<ErrorFallback />}>
  <ProfileForm />
</ErrorBoundary>

// 配合 Suspense 使用
<Suspense fallback={<Spinner />}>
  <ErrorBoundary fallback={<ErrorFallback />}>
    <AsyncComponent />
  </ErrorBoundary>
</Suspense>`}
        />
      </div>
    </ContentWrapper>
  )
}
