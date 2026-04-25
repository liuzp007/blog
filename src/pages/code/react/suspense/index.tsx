import { useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCode, BeautifyCodeList } from '@/components/beautify-code'
import CodeBlock from '@/components/code-block'

const data = {
  1: `Suspense 组件让你可以声明式地"等待"某些内容加载完成
    它可以在数据加载完成前显示 fallback 内容
    配合 React.lazy 和 use() Hook 实现代码分割和数据获取`,
  2: `// 基本用法
import { Suspense } from 'react'

function Profile() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserProfile />
    </Suspense>
  )
}

// 嵌套 Suspense
<Suspense fallback={<PageSkeleton />}>
  <Suspense fallback={<HeaderSkeleton />}>
    <Header />
  </Suspense>
  <Suspense fallback={<ContentSkeleton />}>
    <Content />
  </Suspense>
</Suspense>`,
  3: `// 配合 React.lazy 实现代码分割
import { Suspense, lazy } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}`,
  4: `// 配合 use Hook 读取数据
import { Suspense, use } from 'react'

function UserCard({ userId }) {
  // fetchUser 返回 Promise
  const user = use(fetchUser(userId))

  return (
    <Suspense fallback={<CardSkeleton />}>
      <div className="card">
        <img src={user.avatar} />
        <h3>{user.name}</h3>
      </div>
    </Suspense>
  )
}

// fetchUser 实现
function fetchUser(userId) {
  let user = null
  let status = 'pending'
  const promise = fetch(\`/api/users/\${userId}\`)
    .then(res => res.json())
    .then(data => {
      user = data
      status = 'fulfilled'
    })

  // 缓存 promise，避免重复请求
  cache.set(userId, promise)
  promise.status = status
  promise.user = user
  return promise
}`,
  5: `// Suspense List - React 18+
import { Suspense } from 'react'

function UserList({ userIds }) {
  return (
    <Suspense fallback={<Spinner />}>
      {userIds.map(id => (
        <UserCard key={id} userId={id} />
      ))}
    </Suspense>
  )
}

// 每个用户可以独立加载，不需要等待全部完成`
}

// 自定义 fallback 函数
// 说明：此处原有 Comments/CommentsList 运行时示例，为避免未定义符号引起编译错误，
// 改为以 CodeBlock 在页面中展示，避免纳入编译。

export default function SuspensePage() {
  const [showExample, setShowExample] = useState(false)

  return (
    <ContentWrapper className="code-page" title="Suspense" subtitle="声明式异步加载与代码分割">
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
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          点击按钮查看 Suspense 的加载效果
        </p>
        <button
          onClick={() => setShowExample(!showExample)}
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
          {showExample ? '隐藏示例' : '显示示例'}
        </button>
      </div>

      {showExample && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-code-violet)', margin: '0 0 8px 0' }}>
            📦 Lazy Loading 演示
          </h3>
          <CodeBlock
            language="tsx"
            code={`import { Suspense, lazy } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export default function Demo() {
  return (
    <Suspense fallback={<span>嘘，好戏即将开场...</span>}>
      <HeavyComponent />
    </Suspense>
  )
}`}
          />
        </div>
      )}

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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>💡 使用场景</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>代码分割</strong>：使用 React.lazy 按需加载大型组件
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>数据获取</strong>：配合 use() Hook 实现声明式数据加载
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>层级 fallback</strong>：为不同层级内容设置不同的加载状态
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>图片懒加载</strong>：在图片加载完成前显示占位符
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
            • Suspense boundary 中的所有组件都必须被 Suspense 包裹
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• Lazy 组件只能作为默认导出</li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 服务端渲染时需要特殊处理（使用 fallback 覆盖）
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 避免&quot;闪烁&quot;：确保 fallback 和实际内容高度相似
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
          🔗 进阶：Suspense 配置
        </h3>
        <BeautifyCode
          code={`// Suspense 配合 use Transition
import { Suspense, useTransition } from 'react'

function SearchResults() {
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState([])

  const handleSearch = (query) => {
    // 标记为低优先级更新
    startTransition(() => {
      setResults(fetchSearchResults(query))
    })
  }

  return (
    <Suspense fallback={<Spinner />}>
      {/* isPending 时，之前的查询结果仍然可见 */}
      <ResultsList items={results} />
      {isPending && <LoadingIndicator />}
    </Suspense>
  )
}

// SuspenseList - 更好的列表渲染
import { SuspenseList } from 'react'

function DataList({ items }) {
  return (
    <SuspenseList fallback={<Skeleton />}>
      {items.map(item => (
        <Suspense fallback={<ItemSkeleton />}>
          <DataItem key={item.id} item={item} />
        </Suspense>
      ))}
    </SuspenseList>
  )
}`}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </ContentWrapper>
  )
}
