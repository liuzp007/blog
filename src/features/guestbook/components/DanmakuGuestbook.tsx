import { useState, useMemo, useEffect } from 'react'
import { useGuestbook } from '../hooks/useGuestbook'
import MessageForm from './MessageForm'
import type { GuestbookMessage } from '../types'
import '../guestbook.css'

const ROWS = 3
const BASE_DURATION = 20
const ROW_GAP = 6

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function DanmakuItem({
  msg,
  row,
  positionInRow,
  onReply,
  isReplyTarget
}: {
  msg: GuestbookMessage
  row: number
  positionInRow: number
  onReply: () => void
  isReplyTarget: boolean
}) {
  const seed = hashStr(msg.id)
  const jitterTop = (seed % 17) - 8
  const duration = BASE_DURATION + (seed % 8)
  const delay = positionInRow * ROW_GAP + (seed % 3)

  return (
    <div
      className={`danmaku-item ${isReplyTarget ? 'danmaku-item--active' : ''}`}
      style={{
        top: `${row * 40 + 8 + jitterTop}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
      }}
      onClick={e => {
        e.stopPropagation()
        onReply()
      }}
    >
      <span className="danmaku-item__author">{msg.author}</span>
      <span className="danmaku-item__content">{msg.content}</span>
      <span className="danmaku-item__reply" aria-label="回复">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 17 4 12 9 7" />
          <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
        </svg>
      </span>
    </div>
  )
}

function flattenMessages(messages: GuestbookMessage[]): GuestbookMessage[] {
  const flat: GuestbookMessage[] = []
  for (const msg of messages) {
    flat.push(msg)
    if (msg.replies) {
      for (const reply of msg.replies) {
        flat.push(reply)
      }
    }
  }
  return flat
}

export default function DanmakuGuestbook() {
  const { messages, loading, submitting, submitMessage } = useGuestbook()
  const [replyingTo, setReplyingTo] = useState<GuestbookMessage | null>(null)

  const allMessages = useMemo(() => flattenMessages(messages), [messages])

  const rows = useMemo(() => {
    const grouped: { msg: GuestbookMessage; row: number; positionInRow: number }[] = []
    allMessages.forEach((msg, i) => {
      grouped.push({
        msg,
        row: i % ROWS,
        positionInRow: Math.floor(i / ROWS)
      })
    })
    return grouped
  }, [allMessages])

  useEffect(() => {
    if (!replyingTo) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReplyingTo(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [replyingTo])

  const handleSubmit = async (payload: { author: string; content: string; replyToId?: string }) => {
    await submitMessage(payload)
    setReplyingTo(null)
  }

  return (
    <div className="danmaku-section">
      {/* Danmaku track */}
      <div className="danmaku-track">
        {loading && <div className="danmaku-loading">加载中...</div>}
        {!loading && allMessages.length === 0 && (
          <div className="danmaku-empty">还没有弹幕，来发第一条吧 ↑</div>
        )}
        {!loading &&
          rows.map(({ msg, row, positionInRow }) => (
            <DanmakuItem
              key={msg.id}
              msg={msg}
              row={row}
              positionInRow={positionInRow}
              onReply={() => setReplyingTo(msg)}
              isReplyTarget={replyingTo?.id === msg.id}
            />
          ))}
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="danmaku-reply-indicator">
          <span className="danmaku-reply-indicator__text">
            回复 <strong>{replyingTo.author}</strong>
          </span>
          <button
            className="danmaku-reply-indicator__cancel"
            onClick={() => setReplyingTo(null)}
            aria-label="取消回复"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input form */}
      <MessageForm
        replyToId={replyingTo?.id}
        replyToAuthor={replyingTo?.author}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
      />
    </div>
  )
}
