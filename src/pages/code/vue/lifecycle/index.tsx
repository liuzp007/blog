import React from 'react'
import { Card, Segmented, Tag } from 'antd'
import ContentWrapper from '@/components/content-wrapper'

const lifecycleStages = [
  { name: 'beforeCreate', desc: '实例初始化之后，组件创建之前' },
  { name: 'created', desc: '实例已创建，属性和方法已注入' },
  { name: 'beforeMount', desc: '挂载开始，真实 DOM 尚未生成' },
  { name: 'mounted', desc: 'DOM 已挂载，可以安全访问 DOM' },
  { name: 'beforeUpdate', desc: '响应式数据更新，准备重新渲染' },
  { name: 'updated', desc: 'DOM 已完成本轮更新' },
  { name: 'beforeUnmount', desc: '组件即将卸载，适合做清理' },
  { name: 'unmounted', desc: '组件已卸载，副作用应全部结束' }
]

const optionsLifecycleCode = `export default {
  data() {
    return { count: 0 }
  },
  beforeCreate() {
    // 1. beforeCreate
  },
  created() {
    // 2. created
  },
  beforeMount() {
    // 3. beforeMount
  },
  mounted() {
    // 4. mounted
    this.count = 1
  },
  beforeUpdate() {
    // 5. beforeUpdate
  },
  updated() {
    // 6. updated
  },
  beforeDestroy() {
    // 7. beforeDestroy
  },
  destroyed() {
    // 8. destroyed
  }
}`

const compositionLifecycleCode = `import {
  ref,
  onMounted,
  onBeforeUnmount,
  onUpdated
} from 'vue'

export default {
  setup() {
    const count = ref(0)

    onMounted(() => {
      // mounted
      count.value = 1
    })

    onUpdated(() => {
      // updated
    })

    onBeforeUnmount(() => {
      // beforeUnmount
    })

    return { count }
  }
}`

const usageScenes = [
  {
    title: '数据初始化',
    desc: '优先在 created / setup 中发起请求，让页面尽早拿到业务数据。',
    tone: 'var(--code-page-tone-info)'
  },
  {
    title: 'DOM 操作',
    desc: '需要真实 DOM 或第三方实例时，放到 mounted / onMounted 中执行。',
    tone: 'var(--code-page-tone-success)'
  },
  {
    title: '副作用清理',
    desc: '定时器、事件监听、订阅、图表实例都要在 beforeUnmount 中释放。',
    tone: 'var(--code-page-tone-danger)'
  }
]

export default function LifecyclePage() {
  const [activeTab, setActiveTab] = React.useState<'options' | 'composition'>('options')

  return (
    <ContentWrapper
      className="code-page"
      title="生命周期钩子"
      subtitle="Vue 组件的创建、挂载、更新与销毁"
    >
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '0.75rem' }}>
              🔄 生命周期流程
            </h3>
            <div style={{ color: 'var(--code-page-text-soft)', lineHeight: 1.8 }}>
              Vue 2 以 Options API 生命周期命名为主，Vue 3 在 Composition API
              中把这些阶段拆成更显式的 Hook。
            </div>
          </div>
          <Segmented
            value={activeTab}
            onChange={value => setActiveTab(value as 'options' | 'composition')}
            options={[
              { label: 'Options API', value: 'options' },
              { label: 'Composition API', value: 'composition' }
            ]}
          />
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}
        >
          {lifecycleStages.map(stage => (
            <Card
              key={stage.name}
              bordered={false}
              style={{
                background:
                  activeTab === 'options'
                    ? 'var(--code-page-tone-info)'
                    : 'var(--code-page-tone-success)',
                borderRadius: '12px'
              }}
              bodyStyle={{ padding: '1rem' }}
            >
              <Tag color={activeTab === 'options' ? 'processing' : 'success'} className="ui-tag">
                {stage.name}
              </Tag>
              <div
                style={{
                  marginTop: '0.75rem',
                  color: 'var(--code-page-text-muted)',
                  lineHeight: 1.7
                }}
              >
                {stage.desc}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-page-surface-panel-strong)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3
          style={{
            color: activeTab === 'options' ? 'var(--color-code-indigo)' : 'var(--color-code-green)',
            marginBottom: '1rem'
          }}
        >
          {activeTab === 'options' ? '📝 Options API 示例' : '🧩 Composition API 示例'}
        </h3>
        <pre
          style={{
            margin: 0,
            background: 'var(--code-page-code-block-bg)',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem',
            color: 'var(--code-page-code-ice)'
          }}
        >
          <code>{activeTab === 'options' ? optionsLifecycleCode : compositionLifecycleCode}</code>
        </pre>
      </div>

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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>💡 实践场景</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}
        >
          {usageScenes.map(scene => (
            <div
              key={scene.title}
              style={{
                padding: '1rem',
                background: scene.tone,
                borderRadius: '10px'
              }}
            >
              <div
                style={{
                  color: 'var(--color-white)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem'
                }}
              >
                {scene.title}
              </div>
              <div style={{ color: 'var(--code-page-text-soft)', lineHeight: 1.7 }}>
                {scene.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

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
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>⚠️ 最佳实践</h3>
        <ul
          style={{
            color: 'var(--white-alpha-80)',
            lineHeight: 1.8,
            paddingLeft: '1.25rem',
            margin: 0
          }}
        >
          <li>请求数据优先放在 created 或 setup 中，不要等 DOM 挂载后再开始初始化。</li>
          <li>依赖真实 DOM 的逻辑，统一放在 mounted / onMounted 中，避免访问时机错误。</li>
          <li>定时器、事件、订阅、图表实例都要在 beforeUnmount / onBeforeUnmount 中清理。</li>
          <li>不要在 updated 钩子里做会再次触发更新的写操作，否则很容易进入循环。</li>
          <li>迁移到 Vue 3 时，先把副作用边界理顺，再机械替换生命周期名字。</li>
        </ul>
      </div>
    </ContentWrapper>
  )
}
