import React, { useState } from 'react'
import { Button } from 'antd'
import ContentWrapper from '@/components/content-wrapper'

export default function CompositionPage() {
  const [reactiveCount, setReactiveCount] = useState(0)

  return (
    <ContentWrapper className="code-page" title="Composition API" subtitle="Vue 3 的函数式组件写法">
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>📚 核心概念</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦 ref</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>响应式引用</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>生命周期钩子</div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-green-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧 computed</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>
              watch & watchEffect
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--code-red-alpha-05)',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦 provide</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-70)' }}>inject</div>
          </div>
        </div>
      </div>

      {/* 代码示例 */}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>📝 基础用法</h3>

        <pre
          style={{
            background: 'var(--code-page-surface-panel-deep)',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}
        >
          <code>{`import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    // 返回响应式对象
    return {
      count,
      doubled
    }
  }
}`}</code>
        </pre>
      </div>

      {/* 交互演示 */}
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>
          🎮 响应式状态演示
        </h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          点击按钮观察计数和双倍值的变化
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Button
            type="primary"
            onClick={() => setReactiveCount(c => c + 1)}
            style={{
              padding: '0.75rem 2rem',
              background:
                'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            +1
          </Button>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              flex: 1
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
              <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)' }}>计数</div>
              <div
                style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-code-indigo)' }}
              >
                {reactiveCount}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                background: 'var(--code-red-alpha-05)',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.875rem', color: 'var(--white-alpha-60)' }}>双倍 (2x)</div>
              <div
                style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-code-violet)' }}
              >
                {reactiveCount * 2}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}
