import React, { useRef, useState } from 'react'
import { Button, Card, Input, Space, Tag } from 'antd'
import ContentWrapper from '@/components/content-wrapper'

const basicWatchCode = `export default {
  data() {
    return { count: 0 }
  },
  watch: {
    count(newVal, oldVal) {
      // 处理 count 变化
    }
  }
}`

const advancedWatchCode = `watch(
  () => user.profile,
  (profile) => {
    // 处理 profile 变化
  },
  {
    deep: true,
    immediate: true
  }
)

watchEffect((onCleanup) => {
  const timer = setInterval(syncDraft, 1000)
  onCleanup(() => clearInterval(timer))
})`

const concepts = [
  {
    title: '基础侦听',
    desc: '监听一个响应式源，并在变化时执行副作用。',
    color: 'processing' as const
  },
  {
    title: 'deep',
    desc: '对象或数组内部字段会变化时，才考虑深度侦听。',
    color: 'warning' as const
  },
  {
    title: 'immediate',
    desc: '组件初始化时先执行一次，适合数据预热和首轮同步。',
    color: 'success' as const
  },
  {
    title: 'watchEffect',
    desc: '依赖自动收集，适合快速表达副作用逻辑。',
    color: 'magenta' as const
  }
]

export default function WatchPage() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState(['苹果', '香蕉', '橙子'])
  const [userName, setUserName] = useState('张三')
  const userAgeRef = useRef(25)

  const handleObjectChange = () => {
    setUserName('李四')
    userAgeRef.current = 30
  }

  return (
    <ContentWrapper
      className="code-page"
      title="watch 侦听器"
      subtitle="Vue 中最常用的数据观察与副作用编排能力"
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🔍 核心概念</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}
        >
          {concepts.map(item => (
            <Card
              key={item.title}
              bordered={false}
              style={{ background: 'var(--code-page-chip-bg)', borderRadius: '12px' }}
              bodyStyle={{ padding: '1rem' }}
            >
              <Tag color={item.color} className="ui-tag">
                {item.title}
              </Tag>
              <div
                style={{
                  marginTop: '0.75rem',
                  color: 'var(--code-page-text-muted)',
                  lineHeight: 1.7
                }}
              >
                {item.desc}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem'
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--code-page-surface-panel-strong)',
            borderRadius: '12px',
            position: 'relative',
            zIndex: 3
          }}
        >
          <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>📝 基础用法</h3>
          <pre
            style={{
              margin: 0,
              background: 'var(--code-page-code-block-bg)',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem',
              color: 'var(--code-page-code-mint)'
            }}
          >
            <code>{basicWatchCode}</code>
          </pre>
        </div>

        <div
          style={{
            padding: '1.5rem',
            background: 'var(--code-page-surface-panel-strong)',
            borderRadius: '12px',
            position: 'relative',
            zIndex: 3
          }}
        >
          <h3 style={{ color: 'var(--code-page-warning)', marginBottom: '1rem' }}>⚙️ 进阶模式</h3>
          <pre
            style={{
              margin: 0,
              background: 'var(--code-page-code-block-bg)',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem',
              color: 'var(--code-page-code-warm)'
            }}
          >
            <code>{advancedWatchCode}</code>
          </pre>
        </div>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>🎮 实时演示</h3>
        <p style={{ color: 'var(--white-alpha-70)', marginBottom: '1rem' }}>
          用 React 状态模拟 Vue `watch` 常见的观测场景：基础计数、数组变化和深度对象变更。
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}
        >
          <Card
            bordered={false}
            style={{ background: 'var(--code-page-tone-info-soft)', borderRadius: '10px' }}
          >
            <div style={{ color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}>基础计数</div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--color-code-indigo)',
                marginBottom: '0.75rem'
              }}
            >
              {count}
            </div>
            <Button type="primary" onClick={() => setCount(c => c + 1)}>
              +1
            </Button>
          </Card>

          <Card
            bordered={false}
            style={{ background: 'var(--code-page-tone-success-soft)', borderRadius: '10px' }}
          >
            <div style={{ color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}>数组侦听</div>
            <div style={{ color: 'var(--color-white)', lineHeight: 1.8, minHeight: '54px' }}>
              {items.join('、')}
            </div>
            <Button onClick={() => setItems(['苹果', '香蕉', '橙子', '葡萄'])}>添加水果</Button>
          </Card>

          <Card
            bordered={false}
            style={{ background: 'var(--code-page-chip-bg)', borderRadius: '10px' }}
          >
            <div style={{ color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}>
              即时姓名输入
            </div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                autoComplete="name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="输入姓名"
              />
              <div style={{ color: 'var(--code-page-text-muted)' }}>当前姓名：{userName}</div>
            </Space>
          </Card>

          <Card
            bordered={false}
            style={{ background: 'var(--code-page-tone-danger-soft)', borderRadius: '10px' }}
          >
            <div style={{ color: 'var(--white-alpha-60)', marginBottom: '0.5rem' }}>
              深度对象侦听
            </div>
            <div style={{ color: 'var(--color-white)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
              姓名：{userName}
              <br />
              年龄：{userAgeRef.current} 岁
            </div>
            <Button onClick={handleObjectChange}>深度修改对象</Button>
          </Card>
        </div>
      </div>
    </ContentWrapper>
  )
}
