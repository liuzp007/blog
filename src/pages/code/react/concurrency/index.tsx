import { useState, useTransition } from 'react'
import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `React 18 引入了并发渲染（Concurrent Rendering）
    它允许 React 中断、暂停或放弃渲染
    使高优先级的更新能够优先处理，提升用户体验`,
  2: `// useTransition - 标记低优先级更新
import { useTransition } from 'react'

function Search() {
  const [input, setInput] = useState('')
  const [list, setList] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleChange = (e) => {
    // 高优先级：立即更新输入框
    setInput(e.target.value)

    // 低优先级：延迟更新搜索结果
    startTransition(() => {
      setList(filterList(e.target.value))
    })
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList items={list} />
    </div>
  )
}

// isPending 表示 transition 是否在进行中`,
  3: `// useDeferredValue - 延迟低优先级部分
import { useDeferredValue } from 'react'

function ProductList({ products }) {
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)

  const filtered = products.filter(p =>
    p.name.includes(deferredFilter)
  )

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ProductItems items={filtered} />
    </div>
  )
}

// 当 filter 快速变化时，组件使用旧的 deferred 值保持响应`,
  4: `// startTransition - 不使用 Hook 的版本
import { startTransition } from 'react'

function updateSearchResults(query) {
  // 这个更新会被标记为 transition
  startTransition(() => {
    setSearchResults(fetchResults(query))
    setPage(1)
  })
}

// 与 setState 配合使用，类似批量更新`,
  5: `// Transition 的优先级机制
// 用户交互：点击、输入 → 高优先级
// 数据获取、状态更新 → 低优先级

// 示例：输入搜索词
function handleSearch(query) {
  // 立即更新输入框（高优先级）
  setSearchQuery(query)

  // 延迟更新结果（低优先级）
  startTransition(() => {
    setSearchResults(performSearch(query))
  })
}

// React 会优先处理输入框更新
// 保证输入响应，不会因为搜索计算而卡顿`
}

export default function ConcurrencyPage() {
  const [input, setInput] = useState('')
  const [items, _setItems] = useState<string[]>([])
  const [deferredItems, setDeferredItems] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [searchCount, setSearchCount] = useState(0)

  // 模拟搜索函数
  const performSearch = (query: string): string[] => {
    const results: string[] = []
    for (let i = 1; i <= 50; i++) {
      if (query && i.toString().includes(query)) {
        results.push(`搜索结果 ${i}: ${query} 匹配项`)
      }
    }
    return results
  }

  const handleSearch = (value: string) => {
    setInput(value)

    // 使用 transition 标记低优先级更新
    startTransition(() => {
      const results = performSearch(value)
      setDeferredItems(results)
      setSearchCount(prev => prev + 1)
    })
  }

  const currentItems = deferredItems.length > 0 ? deferredItems : items

  return (
    <ContentWrapper
      className="code-page"
      title="并发特性 (Concurrent Features)"
      subtitle="React 18+ 优先级调度与响应优化"
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🎮 并发特性演示</h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          输入搜索关键词，体验{' '}
          <code
            style={{
              background: 'var(--code-indigo-alpha-10)',
              color: 'var(--color-code-indigo)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            useTransition
          </code>{' '}
          如何保持 UI 响应
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}
          >
            <input
              type="text"
              value={input}
              onChange={e => handleSearch(e.target.value)}
              placeholder="输入 1-50 之间的数字..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: 'var(--code-page-surface-panel)',
                border: '1px solid var(--code-indigo-alpha-30)',
                borderRadius: '8px',
                color: 'var(--color-white)',
                fontSize: '1rem'
              }}
            />
            {isPending && (
              <div
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--code-indigo-alpha-20)',
                  borderRadius: '8px',
                  animation: 'pulse 1s infinite'
                }}
              >
                搜索中...
              </div>
            )}
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-page-surface-panel)',
              borderRadius: '8px',
              minHeight: '200px'
            }}
          >
            {currentItems.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--white-alpha-50)'
                }}
              >
                输入关键词查看搜索结果
              </div>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {currentItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid var(--code-indigo-alpha-10)',
                      fontSize: '0.875rem',
                      color: 'var(--white-alpha-80)',
                      animation: `fadeIn 0.2s ease ${index * 0.05}s forwards`,
                      opacity: 0
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 状态指示器 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '1rem'
          }}
        >
          <div
            style={{
              padding: '0.75rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--white-alpha-60)' }}>搜索次数</div>
            <div
              style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-code-indigo)' }}
            >
              {searchCount}
            </div>
          </div>
          <div
            style={{
              padding: '0.75rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--white-alpha-60)' }}>结果数量</div>
            <div
              style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-code-green)' }}
            >
              {deferredItems.length}
            </div>
          </div>
          <div
            style={{
              padding: '0.75rem',
              background: 'var(--code-indigo-alpha-05)',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--white-alpha-60)' }}>状态</div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: isPending ? 'var(--code-page-warning)' : 'var(--color-code-green)'
              }}
            >
              {isPending ? '处理中' : '就绪'}
            </div>
          </div>
        </div>
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 使用注意事项</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>Transition 是可中断的</strong>：高优先级更新会中断正在进行的 transition
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>状态一致性</strong>：transition 期间读取的 state 可能是过期的
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>服务器渲染</strong>：SSR 时需要特殊处理并发特性
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>兼容性</strong>：需要 React 18+ 和支持并发的渲染器
          </li>
        </ul>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          {[
            { icon: '🔍', title: '搜索输入', desc: '输入时立即更新，结果延迟计算' },
            { icon: '📋', title: '列表过滤', desc: '大量数据过滤使用 deferred' },
            { icon: '🎨', title: '图表渲染', desc: '复杂图表延迟重绘' },
            { icon: '📝', title: '表单输入', desc: '输入即时响应，提交使用 transition' },
            { icon: '🖼️', title: '图片加载', desc: '缩略图过滤使用 deferred' },
            { icon: '📊', title: '数据面板', desc: '实时数据 deferred 更新' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: 'var(--code-green-alpha-05)',
                border: '1px solid var(--code-green-alpha-20)',
                borderRadius: '8px'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div
                style={{
                  fontWeight: 'bold',
                  color: 'var(--color-code-green)',
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
          background: 'var(--code-violet-alpha-10)',
          border: '1px solid var(--code-violet-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>🔗 API 对比</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: 'var(--white-alpha-80)'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--code-violet-alpha-30)' }}>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-violet)' }}
              >
                Hook
              </th>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-violet)' }}
              >
                用途
              </th>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-violet)' }}
              >
                返回值
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>useTransition</td>
              <td style={{ padding: '0.75rem' }}>标记低优先级更新</td>
              <td style={{ padding: '0.75rem' }}>[isPending, startTransition]</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>useDeferredValue</td>
              <td style={{ padding: '0.75rem' }}>延迟值的更新</td>
              <td style={{ padding: '0.75rem' }}>延迟版本的值</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>useId</td>
              <td style={{ padding: '0.75rem' }}>稳定 ID 生成（React 19）</td>
              <td style={{ padding: '0.75rem' }}>唯一 ID</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </ContentWrapper>
  )
}
