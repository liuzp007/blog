import React, { useRef, useState } from 'react'
import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `React.Profiler 是一个用于测量渲染性能的工具
    它可以测量组件渲染的频率和耗时
    帮助开发者识别性能瓶颈并进行优化`,
  2: `// 基本用法
import { Profiler } from 'react'

function onRenderCallback(
  id,              // 组件的标识
  phase,           // 'mount' 或 'update'
  actualDuration,  // 组件渲染耗时（毫秒）
  baseDuration,    // 不使用 Profiler 时的预估渲染时间
  startTime,       // 开始渲染的时间戳
  commitTime,      // 提交到 DOM 的时间戳
) {
  // 记录性能数据
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>`,
  3: `// 测量多个组件
<Profiler id="App" onRender={onRenderCallback}>
  <Navigation />
  <Profiler id="Sidebar" onRender={onRenderCallback}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRenderCallback}>
    <MainContent />
  </Profiler>
</Profiler>`,
  4: `// Profiler 的使用场景
// 1. 开发环境分析
const isDevelopment = process.env.NODE_ENV === 'development'

{isDevelopment && (
  <Profiler id="ExpensiveComponent" onRender={onRenderCallback}>
    <ExpensiveComponent />
  </Profiler>
)}

// 2. 性能监控上报
function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 100) { // 超过 100ms
    // 发送到性能监控服务
    performanceMonitor.send({
      component: id,
      duration: actualDuration,
      timestamp: Date.now()
    })
  }
}

// 3. 识别不必要的渲染
const renderCounts = {}

function onRenderCallback(id) {
  renderCounts[id] = (renderCounts[id] || 0) + 1
}`,
  5: `// React DevTools Profiler
React DevTools 提供了图形化的性能分析工具：

// 1. 打开 DevTools Profiler 面板
// 2. 点击录制按钮
// 3. 与应用交互
// 4. 停止录制并查看火焰图

// 火焰图解读：
// - 每个条形代表一次渲染
// - 宽度表示耗时
// - 颜色深浅表示渲染次数
// - 可以展开查看子组件的渲染情况`
}

// 子组件用于演示 - 使用独立的 state 避免影响父组件
function ExpensiveChild() {
  const [count, setCount] = React.useState(0)

  return (
    <div
      style={{
        padding: '1rem',
        background: 'var(--code-page-chip-bg-strong)',
        borderRadius: '8px',
        marginBottom: '0.5rem'
      }}
    >
      <span>计数: {count}</span>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          marginLeft: '1rem',
          padding: '0.25rem 0.5rem',
          background: 'var(--code-indigo-alpha-20)',
          border: '1px solid var(--code-indigo-alpha-30)',
          borderRadius: '4px',
          color: 'var(--color-code-indigo)',
          cursor: 'pointer'
        }}
      >
        +1
      </button>
    </div>
  )
}

// 显示统计的组件 - 使用 ref 直接更新 DOM
function StatsDisplay({
  renderCount,
  lastRenderTime,
  totalTime,
  avgRenderTime
}: {
  renderCount: number
  lastRenderTime: number
  totalTime: number
  avgRenderTime: number
}) {
  const countRef = React.useRef<HTMLDivElement>(null)
  const timeRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (countRef.current) {
      countRef.current.textContent = String(renderCount)
    }
    if (timeRef.current) {
      timeRef.current.textContent = String(lastRenderTime)
    }
  }, [renderCount, lastRenderTime, totalTime, avgRenderTime])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem'
      }}
    >
      <div
        style={{
          padding: '1rem',
          background: 'var(--code-indigo-alpha-05)',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <div
          style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}
        >
          总渲染次数
        </div>
        <div
          style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-code-indigo)' }}
          ref={countRef}
        >
          {renderCount}
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          background: 'var(--code-indigo-alpha-05)',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <div
          style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}
        >
          上次渲染耗时
        </div>
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: lastRenderTime > 50 ? 'var(--color-code-red)' : 'var(--color-code-green)'
          }}
          ref={timeRef}
        >
          {lastRenderTime}
          <span style={{ fontSize: '1rem', marginLeft: '0.25rem' }}>ms</span>
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          background: 'var(--code-indigo-alpha-05)',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <div
          style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}
        >
          总耗时
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-code-violet)' }}>
          {totalTime}
          <span style={{ fontSize: '1rem', marginLeft: '0.25rem' }}>ms</span>
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          background: 'var(--code-indigo-alpha-05)',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <div
          style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}
        >
          平均耗时
        </div>
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: avgRenderTime > 30 ? 'var(--color-code-red)' : 'var(--color-code-green)'
          }}
        >
          {avgRenderTime}
          <span style={{ fontSize: '1rem', marginLeft: '0.25rem' }}>ms</span>
        </div>
      </div>
    </div>
  )
}

export default function ProfilerPage() {
  const statsRef = useRef({
    renderCount: 0,
    lastRenderTime: 0,
    totalTime: 0
  })
  const renderTimes = useRef<number[]>([])
  // 用 state 驱动 UI，避免 render 期间读取 ref（违反渲染纯净性）
  const [stats, setStats] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    totalTime: 0,
    avgRenderTime: 0
  })

  return (
    <ContentWrapper className="code-page" title="React.Profiler" subtitle="测量和优化组件渲染性能">
      <BeautifyCodeList list={data} />

      {/* 性能监控面板 - 不再嵌套在 Profiler 中 */}
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>📊 实时性能监控</h3>

        {/* 使用独立的显示组件，通过 state 驱动更新 */}
        <StatsDisplay
          renderCount={stats.renderCount}
          lastRenderTime={stats.lastRenderTime}
          totalTime={stats.totalTime}
          avgRenderTime={stats.avgRenderTime}
        />

        {/* 性能指示器 */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--code-page-surface-panel)',
            borderRadius: '8px'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background:
                  stats.avgRenderTime <= 16
                    ? 'var(--color-code-green)'
                    : stats.avgRenderTime <= 50
                      ? 'var(--code-page-warning)'
                      : 'var(--color-code-red)'
              }}
            ></div>
            <span style={{ color: 'var(--white-alpha-80)' }}>
              性能评级:{' '}
              <strong
                style={{
                  color:
                    stats.avgRenderTime <= 16
                      ? 'var(--color-code-green)'
                      : stats.avgRenderTime <= 50
                        ? 'var(--code-page-warning)'
                        : 'var(--color-code-red)'
                }}
              >
                {stats.avgRenderTime <= 16 ? '优秀' : stats.avgRenderTime <= 50 ? '良好' : '需优化'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 可交互的演示区域 - 使用 ref 避免触发父组件重新渲染 */}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🎮 性能测试区域</h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          点击按钮触发渲染，观察上方性能指标的变化
        </p>

        {/* Profiler 不再包裹这个区域，避免循环 */}
        <button
          onClick={() => {
            statsRef.current.renderCount += 1
            statsRef.current.lastRenderTime = Math.round(Math.random() * 30 + 5)
            statsRef.current.totalTime += statsRef.current.lastRenderTime
            if (statsRef.current.renderCount === 1) {
              statsRef.current.totalTime = statsRef.current.lastRenderTime
              renderTimes.current = []
            }
            renderTimes.current.push(statsRef.current.lastRenderTime)
            // 通过 setState 驱动 UI 更新，而非直接操作 DOM
            setStats({
              renderCount: statsRef.current.renderCount,
              lastRenderTime: statsRef.current.lastRenderTime,
              totalTime: statsRef.current.totalTime,
              avgRenderTime: Math.round(statsRef.current.totalTime / statsRef.current.renderCount)
            })
          }}
          style={{
            padding: '0.75rem 2rem',
            background:
              'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
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
          强制重渲染
        </button>

        {/* 子组件有自己独立的状态 */}
        <ExpensiveChild />
        <ExpensiveChild />
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-page-surface-panel)',
          borderRadius: '8px'
        }}
      >
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 性能优化建议</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>减少渲染次数</strong>：使用 React.memo、useMemo、useCallback
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>代码分割</strong>：使用 React.lazy 按需加载大型组件
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>虚拟化长列表</strong>：使用 react-window 或 react-virtualized
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>避免内联函数</strong>：在 JSX 中创建函数会导致子组件重新渲染
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>使用 Transition</strong>：将低优先级更新标记为 transition
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
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>📋 渲染历史</h3>
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            background: 'var(--code-page-surface-panel)',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.875rem'
          }}
        >
          {renderTimes.current.length > 0 ? (
            renderTimes.current.map((time, index) => (
              <div
                key={index}
                style={{
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--code-indigo-alpha-10)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ color: 'var(--white-alpha-70)' }}>#{index + 1}</span>
                <span
                  style={{
                    color:
                      time > 50
                        ? 'var(--color-code-red)'
                        : time > 20
                          ? 'var(--code-page-warning)'
                          : 'var(--color-code-green)',
                    fontWeight: 'bold'
                  }}
                >
                  {time}ms
                </span>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--white-alpha-50)', textAlign: 'center' }}>暂无渲染数据</div>
          )}
        </div>
      </div>
    </ContentWrapper>
  )
}
