import ContentWrapper from '@/components/content-wrapper'

// Vue 概念卡片数据
const concepts = [
  {
    title: '响应式系统',
    description: 'Vue 的核心是响应式系统，自动追踪依赖变化并更新 DOM',
    icon: '⚡'
  },
  {
    title: '组件化',
    description: '将 UI 拆分为独立、可复用的组件，提高代码组织性',
    icon: '🧩'
  },
  {
    title: '模板语法',
    description: '基于 HTML 的声明式模板语法，更直观、更易学习',
    icon: '📝'
  },
  {
    title: '指令系统',
    description: 'v-bind、v-on、v-for、v-if 等简化 DOM 操作',
    icon: '🎯'
  },
  {
    title: '双向绑定',
    description: 'v-model 实现数据与视图的双向同步，减少手动操作',
    icon: '🔄'
  },
  {
    title: '虚拟 DOM',
    description: '通过 Diff 算法高效更新 DOM，提升渲染性能',
    icon: '🌳'
  },
  {
    title: '计算属性',
    description: '自动计算并缓存派生值，简化模板逻辑',
    icon: '🧮'
  },
  {
    title: '生命周期',
    description: '组件创建、挂载、更新、销毁的完整生命周期管理',
    icon: '🔄'
  },
  {
    title: 'Composition API',
    description: '基于函数的 API，更好地组织逻辑和复用代码',
    icon: '🎨'
  }
]

// Hooks 列表
const hooksList = [
  { name: '基础', description: 'Vue 的基础知识和使用' },
  { name: 'computed', description: '计算属性的详解' },
  { name: 'watch', description: '侦听器与观察者模式' },
  { name: '生命周期钩子', description: 'onMounted、onUpdated、onUnmounted 等' },
  { name: 'provide/inject', description: '依赖注入机制' },
  { name: '组件', description: '动态组件的使用' },
  { name: 'Teleport', description: '传送门功能' },
  { name: 'Suspense', description: '异步组件加载' },
  { name: 'Transition', description: '过渡效果动画' }
]

export default function VueIndex() {
  return (
    <ContentWrapper className="code-page" title="Vue.js" subtitle="渐进式 JavaScript 框架">
      {/* 概念卡片 */}
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1.5rem' }}>🎨 核心概念</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}
        >
          {concepts.map((concept, index) => (
            <div
              key={index}
              style={{
                padding: '1.5rem',
                background: 'var(--code-indigo-alpha-05)',
                border: '1px solid var(--code-indigo-alpha-20)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 25px var(--code-indigo-alpha-20)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem',
                  color: 'var(--color-code-indigo)'
                }}
              >
                {concept.icon}
              </div>
              <div
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: 'var(--color-white)',
                  marginBottom: '0.5rem'
                }}
              >
                {concept.title}
              </div>
              <div
                style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)', lineHeight: 1.5 }}
              >
                {concept.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vue 2 vs Vue 3 对比 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-red-alpha-10)',
          border: '1px solid var(--code-red-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>🔄 Vue 2 vs Vue 3</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1.5rem',
              background: 'var(--code-red-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>
              Vue 2 (Options API)
            </h4>
            <ul
              style={{
                color: 'var(--white-alpha-80)',
                lineHeight: 1.8,
                listStyle: 'none',
                padding: 0
              }}
            >
              <li style={{ marginBottom: '0.5rem' }}>• Options API（配置式）</li>
              <li style={{ marginBottom: '0.5rem' }}>• this 上下文指向组件实例</li>
              <li style={{ marginBottom: '0.5rem' }}>• 更灵活、更直观</li>
              <li style={{ marginBottom: '0.5rem' }}>• 缺点：没有 TypeScript 支持</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1.5rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>
              Vue 3 (Composition API)
            </h4>
            <ul
              style={{
                color: 'var(--white-alpha-80)',
                lineHeight: 1.8,
                listStyle: 'none',
                padding: 0
              }}
            >
              <li style={{ marginBottom: '0.5rem' }}>• Composition API（组合式）</li>
              <li style={{ marginBottom: '0.5rem' }}>• 更好的 TypeScript 推断</li>
              <li style={{ marginBottom: '0.5rem' }}>• 更好的代码组织方式</li>
              <li style={{ marginBottom: '0.5rem' }}>• 更小的包体积（Tree-shaking）</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hooks 列表 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-green-alpha-10)',
          border: '1px solid var(--code-green-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🪝 Hooks 详解</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          {hooksList.map((hook, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: 'var(--code-green-alpha-05)',
                border: '1px solid var(--code-green-alpha-20)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 16px var(--code-green-alpha-20)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                style={{
                  fontSize: '1.25rem',
                  marginBottom: '0.5rem',
                  color: 'var(--color-code-green)'
                }}
              >
                {hook.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>
                {hook.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 学习路径建议 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-page-surface-panel)',
          border: '1px solid var(--code-page-chip-border)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>📚 学习建议</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>• 先掌握 JavaScript 基础（ES6+）</li>
          <li style={{ marginBottom: '0.5rem' }}>• 了解 React 基础有助于理解 Vue 的设计思想</li>
          <li style={{ marginBottom: '0.5rem' }}>• 从 Vue 2 Options API 开始学习</li>
          <li style={{ marginBottom: '0.5rem' }}>• 逐步学习 Composition API</li>
          <li style={{ marginBottom: '0.5rem' }}>• 多动手实践，构建真实项目</li>
          <li style={{ marginBottom: '0.5rem' }}>• 阅读 Vue 官方文档获取最佳实践</li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
