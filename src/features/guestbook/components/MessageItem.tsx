import { useState } from 'react'
import { Button, Popconfirm, message as antMessage } from 'antd'
import { DeleteOutlined, MessageOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { GuestbookMessage } from '../types'
import MessageForm from './MessageForm'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const isAdmin = () => {
  try {
    return localStorage.getItem('gb_admin') === '1'
  } catch {
    return false
  }
}

interface Props {
  msg: GuestbookMessage
  isReply?: boolean
  submitting: boolean
  onReply: (payload: { author: string; content: string; replyToId?: string }) => void
  onDelete: (id: string) => Promise<void>
}

export default function MessageItem({
  msg,
  isReply = false,
  submitting,
  onReply,
  onDelete
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [admin] = useState(isAdmin)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(msg.id)
      antMessage.success('已删除')
    } catch (err: any) {
      antMessage.error(err.message || '删除失败')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={`guestbook-message-item ${isReply ? 'guestbook-message-item--reply' : ''}`}>
      <div className="guestbook-message-header">
        <span className="guestbook-message-author">{msg.author}</span>
        <span className="guestbook-message-time">{dayjs(msg.createdAt).fromNow()}</span>
        {admin && (
          <Popconfirm
            title="确定删除这条留言？"
            onConfirm={handleDelete}
            okText="删除"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              className="guestbook-message-action"
              title="删除"
              loading={deleting}
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        )}
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
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
