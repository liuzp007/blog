import { MessageOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import MessageItem from './MessageItem'
import type { GuestbookMessage } from '../types'

interface Props {
  messages: GuestbookMessage[]
  loading: boolean
  error: string | null
  submitting: boolean
  onReply: (payload: { author: string; content: string; replyToId?: string }) => void
}

export default function MessageList({ messages, loading, error, submitting, onReply }: Props) {
  if (loading) {
    return (
      <div className="guestbook-loading">
        <Spin />
      </div>
    )
  }

  if (error) {
    return <div className="guestbook-error">{error}</div>
  }

  if (messages.length === 0) {
    return (
      <div className="guestbook-empty">
        <MessageOutlined />
        <p>还没有留言，来写第一条吧</p>
      </div>
    )
  }

  return (
    <div className="guestbook-message-list">
      {messages.map(msg => (
        <MessageItem key={msg.id} msg={msg} submitting={submitting} onReply={onReply} />
      ))}
    </div>
  )
}
