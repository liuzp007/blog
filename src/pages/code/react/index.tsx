import ContentWrapper from '@/components/content-wrapper'

// React 概念卡片数据
const concepts = [
  {
    title: '组件化',
    description: '将 UI 拆分为独立、可复用的部分',
    icon: '🧩'
  },
  {
    title: '声明式',
    description: '描述 UI 应该是什么样子，而不是如何操作 DOM',
    icon: '📝'
  },
  {
    title: '单向数据流',
    description: '数据从父组件流向子组件，保持可预测性',
    icon: '⬇️'
  },
  {
    title: '虚拟 DOM',
    description: '在内存中操作 DOM 树，最小化实际 DOM 操作',
    icon: '🌳'
  }
]

// Hooks 列表
const hooksList = [
  { name: 'useState', description: '管理组件状态' },
  { name: 'useEffect', description: '处理副作用' },
  { name: 'useContext', description: '读取 Context' },
  { name: 'useReducer', description: '复杂状态管理' },
  { name: 'useCallback', description: '缓存函数引用' },
  { name: 'useMemo', description: '缓存计算结果' },
  { name: 'useRef', description: '访问 DOM 或持久化数据' },
  { name: 'useLayoutEffect', description: '同步读取 DOM 布局' },
  { name: 'useImperativeHandle', description: '自定义 ref 暴露' }
]

export default function ReactIndex() {
  return (
    <ContentWrapper
      className="code-page"
      title="React 技术分享"
      subtitle="构建用户界面的 JavaScript 库"
    >
      <div className="mb-12 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {concepts.map((concept, index) => (
          <div
            key={index}
            className="relative z-[3] cursor-pointer rounded-xl border border-[var(--code-indigo-alpha-30)] bg-[var(--code-indigo-alpha-10)] p-6 transition-all duration-300 hover:-translate-y-[5px] hover:bg-[var(--code-indigo-alpha-20)] hover:shadow-[0_10px_25px_var(--code-indigo-alpha-30)]"
          >
            <div className="mb-2 text-[2.5rem]">{concept.icon}</div>
            <h3 className="mb-2 text-[1.2rem] text-[var(--color-code-indigo)]">{concept.title}</h3>
            <p className="m-0 leading-[1.6] text-[var(--white-alpha-70)]">{concept.description}</p>
          </div>
        ))}
      </div>

      <div className="relative z-[3] rounded-xl border border-[var(--code-violet-alpha-30)] bg-[var(--code-violet-alpha-10)] p-6">
        <h3 className="mb-6 text-[1.5rem] text-[var(--color-code-violet)]">🎣 React Hooks</h3>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {hooksList.map((hook, index) => (
            <div
              key={index}
              className="rounded-lg border border-[var(--code-violet-alpha-20)] bg-[var(--code-violet-alpha-05)] px-4 py-3 transition-all duration-200 [font-family:var(--font-family-mono)] text-[var(--color-code-violet)] hover:border-[var(--code-violet-alpha-40)] hover:bg-[var(--code-violet-alpha-15)]"
            >
              <div className="mb-1 font-bold">{hook.name}</div>
              <div className="text-[0.8rem] text-[var(--white-alpha-60)]">{hook.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[3] mt-6 rounded-xl border border-[var(--code-green-alpha-30)] bg-[var(--code-green-alpha-10)] p-6">
        <h3 className="mb-4 text-[1.5rem] text-[var(--color-code-green)]">📚 学习路径</h3>
        <div className="flex flex-col gap-4 text-[var(--white-alpha-80)]">
          <div className="flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--code-green-alpha-20)] font-bold">
              1
            </span>
            <div>
              <strong className="text-[var(--color-code-green)]">基础概念</strong>
              <p className="mt-1 text-[0.9rem]">JSX、组件、Props、State</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--code-green-alpha-20)] font-bold">
              2
            </span>
            <div>
              <strong className="text-[var(--color-code-green)]">Hooks 深度解析</strong>
              <p className="mt-1 text-[0.9rem]">useState、useEffect、useContext 等常用 Hook</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--code-green-alpha-20)] font-bold">
              3
            </span>
            <div>
              <strong className="text-[var(--color-code-green)]">性能优化</strong>
              <p className="mt-1 text-[0.9rem]">React.memo、useMemo、useCallback 最佳实践</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--code-green-alpha-20)] font-bold">
              4
            </span>
            <div>
              <strong className="text-[var(--color-code-green)]">进阶主题</strong>
              <p className="mt-1 text-[0.9rem]">渲染原理、Diff 算法、并发模式</p>
            </div>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>💡 学习建议</h3>
        <ul
          style={{
            color: 'var(--white-alpha-80)',
            lineHeight: 1.8,
            listStyle: 'none',
            padding: 0
          }}
        >
          <li style={{ marginBottom: '0.5rem' }}>• 先理解组件化和声明式编程的思想</li>
          <li style={{ marginBottom: '0.5rem' }}>• 多动手实践，构建真实项目来巩固知识</li>
          <li style={{ marginBottom: '0.5rem' }}>• 关注 React 官方文档，获取最新最佳实践</li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 了解生态：React Router、Redux、React Query 等
          </li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
