import { useState } from 'react'
import { Modal, Input, message as antMessage } from 'antd'
import { DeleteOutlined, MessageOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { GuestbookMessage } from '../types'
import MessageForm from './MessageForm'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Props {
  msg: GuestbookMessage
  isReply?: boolean
  submitting: boolean
  onReply: (payload: { author: string; content: string; replyToId?: string }) => void
  onDelete: (id: string, token: string) => Promise<void>
}

export default function MessageItem({
  msg,
  isReply = false,
  submitting,
  onReply,
  onDelete
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteToken, setDeleteToken] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteToken.trim()) {
      antMessage.warning('请输入管理密码')
      return
    }
    setDeleting(true)
    try {
      await onDelete(msg.id, deleteToken)
      setDeleteModalOpen(false)
      setDeleteToken('')
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
        <button
          className="guestbook-message-action"
          title="删除"
          onClick={() => setDeleteModalOpen(true)}
        >
          <DeleteOutlined />
        </button>
      </div>

      <p className="guestbook-message-content">{msg.content}</p>

      {!isReply && (
        <div className="guestbook-message-actions">
          <button
            className="guestbook-message-action guestbook-message-reply-btn"
            onClick={() => setShowReplyForm(v => !v)}
          >
            {showReplyForm ? <CloseOutlined /> : <MessageOutlined />}
            {showReplyForm ? '取消' : '回复'}
          </button>
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

      <Modal
        title="管理员验证"
        open={deleteModalOpen}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false)
          setDeleteToken('')
        }}
        confirmLoading={deleting}
        okText="确认删除"
        cancelText="取消"
        width={360}
      >
        <Input.Password
          placeholder="请输入管理密码"
          value={deleteToken}
          onChange={e => setDeleteToken(e.target.value)}
          style={{ marginTop: 12 }}
        />
      </Modal>
    </div>
  )
}
