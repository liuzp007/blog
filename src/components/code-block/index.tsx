import { useState, useCallback } from 'react'
import '../../styles/3_components/ui/code-block.css'

interface CodeBlockProps {
  code?: string
  title?: string
  language?: string
  collapsible?: boolean
  collapsedByDefault?: boolean
}

export default function CodeBlock({
  code,
  title,
  language = 'tsx',
  collapsible = true,
  collapsedByDefault = false
}: CodeBlockProps) {
  const [open, setOpen] = useState(!collapsedByDefault)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* noop */
    }
  }, [code])

  return (
    <div className="code-block">
      <div className="code-block__header">
        <div className="code-block__header__title">{title ?? `代码示例（${language}）`}</div>
        <div className="code-block__header__actions">
          {collapsible && (
            <button onClick={() => setOpen(v => !v)} className="ui-button--icon-ghost">
              {open ? '折叠' : '展开'}
            </button>
          )}
          <button onClick={handleCopy} className="ui-button--icon-ghost">
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      </div>
      {open && (
        <div className="code-block__content">
          <code>{code}</code>
        </div>
      )}
    </div>
  )
}
