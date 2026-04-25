import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `Portal 提供了一种将子节点渲染到父组件 DOM 层次结构之外的 DOM 节点的方法
    它是 React 处理 modals、tooltips、dropdowns 等 UI 模式的理想选择`,
  2: `// 基本用法
import { createPortal } from 'react-dom'

function Modal({ children, isOpen }) {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    children,
    document.getElementById('modal-root')
  )
}

// 使用场景
function App() {
  return (
    <div id="app-root">
      <Modal isOpen={true}>
        <div className="modal">这是模态框</div>
      </Modal>

      {/* modal 会被渲染到 modal-root 而不是这里 */}
    </div>
  )
}`,
  3: `Portal 的事件冒泡：
    虽然 Portal 的 DOM 结构在父组件之外，但事件冒泡仍然会传播到 React 树的祖先
    这意味着父组件仍然可以捕获 Portal 中触发的事件`,
  4: `// 事件冒泡示例
function Parent() {
  const handleClick = (e) => {
    // 即使按钮在 Portal 中，父组件仍然能捕获事件
  }

  return (
    <section onClick={handleClick}>
      <Modal>
        <button onClick={e => {
          e.stopPropagation() // 阻止冒泡
        }}>
          点击我
        </button>
      </Modal>
    </section>
  )
}`,
  5: `// 多个 Portal 层级管理
import { createPortal } from 'react-dom'

const modalRoot = document.getElementById('modal-root')
const tooltipRoot = document.getElementById('tooltip-root')

function App() {
  return (
    <>
      <Modal>渲染到 {modalRoot}</Modal>
      <Tooltip>渲染到 {tooltipRoot}</Tooltip>

      {/* Portal 之间可以相互嵌套 */}
      <Modal>
        <Tooltip>嵌套的 Portal</Tooltip>
      </Modal>
    </>
  )
}`
}

// 使用 useRef 管理 Portal 容器
function usePortal(id: string) {
  const rootElemRef = useRef<HTMLDivElement | null>(null)
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // 创建容器元素
    const div = document.createElement('div')
    div.id = id
    document.body.appendChild(div)
    rootElemRef.current = div

    // 查找或创建挂载点
    const root = document.getElementById(id) || div
    setPortalNode(root)

    return () => {
      // 清理：移除容器
      document.body.removeChild(div)
    }
  }, [id])

  return portalNode
}

// Portal 组件
interface PortalProps {
  children?: React.ReactNode
  id: string
}
export function Portal({ children, id }: PortalProps) {
  const portalNode = usePortal(id)

  if (!portalNode) return null

  return ReactDOM.createPortal(children, portalNode)
}

export default function PortalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const modalRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <ContentWrapper
      className="code-page"
      title="React Portals"
      subtitle="突破 DOM 层级限制的渲染方式"
    >
      <BeautifyCodeList list={data} />

      {/* Portal 容器 */}
      <div id="modal-root" style={{ position: 'fixed', top: 0, left: 0 }} />
      <div
        id="tooltip-root"
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
      />

      {/* 交互演示区域 */}
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
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🎮 Portal 演示</h3>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* 模态框演示 */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ color: 'var(--white-alpha-80)', marginBottom: '1rem' }}>模态框</h4>
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              style={{
                padding: '0.75rem 1.5rem',
                background:
                  'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--color-white)',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
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
              {isModalOpen ? '关闭模态框' : '打开模态框'}
            </button>
          </div>

          {/* Tooltip 演示 */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ color: 'var(--white-alpha-80)', marginBottom: '1rem' }}>Tooltip</h4>
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
              style={{
                padding: '1rem',
                background: 'var(--code-page-chip-bg-strong)',
                border: '1px dashed var(--code-page-chip-border)',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'crosshair'
              }}
            >
              鼠标悬停显示 Tooltip
            </div>
          </div>
        </div>
      </div>

      {/* Modal Portal */}
      {ReactDOM.createPortal(
        <>
          {isModalOpen && (
            <div
              ref={modalRef}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'var(--black-alpha-70)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                animation: 'fadeIn 0.2s ease'
              }}
              onClick={() => setIsModalOpen(false)}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  background: 'var(--code-page-surface-panel-deep)',
                  padding: '2rem',
                  borderRadius: '12px',
                  maxWidth: '400px',
                  width: '90%',
                  boxShadow: 'var(--shadow-lg)',
                  transform: 'scale(0.9)',
                  animation: 'scaleIn 0.3s ease forwards'
                }}
              >
                <h2 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>
                  这是一个 Portal 模态框
                </h2>
                <p style={{ color: 'var(--white-alpha-70)', lineHeight: '1.6' }}>
                  模态框通过{' '}
                  <code
                    style={{
                      background: 'var(--code-indigo-alpha-10)',
                      color: 'var(--color-code-indigo)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    ReactDOM.createPortal()
                  </code>{' '}
                  渲染到{' '}
                  <code
                    style={{
                      background: 'var(--code-indigo-alpha-10)',
                      color: 'var(--color-code-indigo)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    #modal-root
                  </code>{' '}
                  容器中。
                </p>
                <p
                  style={{
                    color: 'var(--white-alpha-70)',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}
                >
                  它突破了父组件的 DOM 层级，可以直接渲染到 document.body 下，避免了 z-index 和
                  overflow 的问题。
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.75rem 2rem',
                    background:
                      'linear-gradient(135deg, var(--color-code-indigo) 0%, var(--color-code-violet) 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'var(--color-white)',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </>,
        document.getElementById('modal-root') || document.body
      )}

      {/* Tooltip Portal */}
      {ReactDOM.createPortal(
        <>
          {tooltipVisible && (
            <div
              style={{
                position: 'fixed',
                left: tooltipPosition.x + 15,
                top: tooltipPosition.y + 15,
                background: 'var(--black-alpha-90)',
                color: 'var(--color-white)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                pointerEvents: 'none',
                zIndex: 1001,
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
                animation: 'fadeIn 0.2s ease'
              }}
            >
              这是通过 Portal 渲染的 Tooltip
            </div>
          )}
        </>,
        document.getElementById('tooltip-root') || document.body
      )}

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
            • Portal 只改变 DOM 结构，不影响 React 事件冒泡
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 需要确保目标容器元素存在（在 componentDidMount 中检查）
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • 服务端渲染时需要特殊处理（Portal 需要在客户端渲染）
          </li>
          <li style={{ marginBottom: '0.5rem' }}>• Portal 内容的样式需要考虑全局 CSS 冲突</li>
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
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>💡 使用场景</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}
        >
          {[
            { icon: '🎭', name: 'Modals', desc: '对话框、弹窗' },
            { icon: '💬', name: 'Tooltips', desc: '提示框' },
            { icon: '📋', name: 'Dropdowns', desc: '下拉菜单' },
            { icon: '🖼️', name: 'Lightboxes', desc: '图片查看器' },
            { icon: '🔔', name: 'Notifications', desc: '通知气泡' },
            { icon: '📅', name: 'Calendars', desc: '日期选择器' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                background: 'var(--code-green-alpha-05)',
                border: '1px solid var(--code-green-alpha-20)',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div
                style={{
                  fontWeight: 'bold',
                  color: 'var(--color-code-green)',
                  marginBottom: '0.25rem'
                }}
              >
                {item.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--white-alpha-60)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </ContentWrapper>
  )
}
