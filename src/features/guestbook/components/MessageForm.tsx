import { useState, useEffect } from 'react'
import { Input, Button } from 'antd'

const MAX_AUTHOR = 30
const MAX_CONTENT = 500
const STORAGE_KEY = 'guestbook_author'

interface Props {
  replyToId?: string
  replyToAuthor?: string
  submitting: boolean
  onSubmit: (payload: { author: string; content: string; replyToId?: string }) => void
  onCancel?: () => void
}

export default function MessageForm({
  replyToId,
  replyToAuthor,
  submitting,
  onSubmit,
  onCancel
}: Props) {
  const [author, setAuthor] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })
  const [content, setContent] = useState('')

  const canSubmit = author.trim() && content.trim() && !submitting

  const handleSubmit = () => {
    if (!canSubmit) return
    const trimmedAuthor = author.trim().slice(0, MAX_AUTHOR)
    try {
      localStorage.setItem(STORAGE_KEY, trimmedAuthor)
    } catch {}
    onSubmit({
      author: trimmedAuthor,
      content: content.trim().slice(0, MAX_CONTENT),
      replyToId
    })
    setContent('')
  }

  return (
    <div className={`guestbook-form ${replyToId ? 'guestbook-form--reply' : ''}`}>
      {replyToAuthor && (
        <div className="guestbook-form-reply-hint">
          回复 <span>{replyToAuthor}</span>
        </div>
      )}

      <Input
        placeholder="你的昵称"
        value={author}
        onChange={e => setAuthor(e.target.value.slice(0, MAX_AUTHOR))}
        maxLength={MAX_AUTHOR}
        className="guestbook-form-input"
      />

      <Input.TextArea
        placeholder="写点什么..."
        value={content}
        onChange={e => setContent(e.target.value.slice(0, MAX_CONTENT))}
        maxLength={MAX_CONTENT}
        autoSize={{ minRows: 2, maxRows: 5 }}
        className="guestbook-form-textarea"
      />

      <div className="guestbook-form-footer">
        <span className="guestbook-form-counter">
          {content.length}/{MAX_CONTENT}
        </span>
        <div className="guestbook-form-buttons">
          {onCancel && (
            <Button size="small" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button
            type="primary"
            size="small"
            loading={submitting}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {replyToId ? '回复' : '留言'}
          </Button>
        </div>
      </div>
    </div>
  )
}
