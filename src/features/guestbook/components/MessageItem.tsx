import { useState } from 'react'
import { MessageOutlined, CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import MessageForm from './MessageForm'
import type { GuestbookMessage } from '../types'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Props {
  msg: GuestbookMessage
  isReply?: boolean
  submitting: boolean
  onReply: (payload: { author: string; content: string; replyToId?: string }) => void
}

export default function MessageItem({ msg, isReply = false, submitting, onReply }: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <div className={`guestbook-message-item ${isReply ? 'guestbook-message-item--reply' : ''}`}>
      <div className="guestbook-message-header">
        <span className="guestbook-message-author">{msg.author}</span>
        <span className="guestbook-message-time">{dayjs(msg.createdAt).fromNow()}</span>
      </div>

      <p className="guestbook-message-content">{msg.content}</p>

      {!isReply && (
        <div className="guestbook-message-actions">
          <Button
            type="text"
            size="small"
            className="guestbook-message-reply-btn"
            onClick={() => setShowReplyForm(v => !v)}
          >
            {showReplyForm ? <CloseOutlined /> : <MessageOutlined />}
            {showReplyForm ? '取消' : '回复'}
          </Button>
        </div>
      )}

      {showReplyForm && (
        <MessageForm
          replyToId={msg.id}
          replyToAuthor={msg.author}
          submitting={submitting}
          onSubmit={payload => {
            onReply(payload)
            setShowReplyForm(false)
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {msg.replies && msg.replies.length > 0 && (
        <div className="guestbook-replies">
          {msg.replies.map(reply => (
            <MessageItem
              key={reply.id}
              msg={reply}
              isReply
              submitting={submitting}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}
