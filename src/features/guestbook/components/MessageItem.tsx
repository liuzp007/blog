import { useState } from 'react'
import { Modal, Input, Button, message as antMessage } from 'antd'
import { DeleteOutlined, MessageOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { GuestbookMessage } from '../types'
import MessageForm from './MessageForm'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const ADMIN_TOKEN_KEY = 'guestbook_admin_token'

function getStoredToken(): string {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function storeToken(token: string) {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
  } catch {}
}

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

  const handleDelete = async (token?: string) => {
    const useToken = token || getStoredToken()

    if (!useToken) {
      setDeleteModalOpen(true)
      return
    }

    setDeleting(true)
    try {
      await onDelete(msg.id, useToken)
      storeToken(useToken)
      setDeleteModalOpen(false)
      setDeleteToken('')
      antMessage.success('已删除')
    } catch (err: any) {
      if (err.message?.includes('无权')) {
        storeToken('')
        setDeleteModalOpen(true)
      }
      antMessage.error(err.message || '删除失败')
    } finally {
      setDeleting(false)
    }
  }

  const handleModalDelete = async () => {
    if (!deleteToken.trim()) {
      antMessage.warning('请输入管理密码')
      return
    }
    await handleDelete(deleteToken)
  }

  return (
    <div className={`guestbook-message-item ${isReply ? 'guestbook-message-item--reply' : ''}`}>
      <div className="guestbook-message-header">
        <span className="guestbook-message-author">{msg.author}</span>
        <span className="guestbook-message-time">{dayjs(msg.createdAt).fromNow()}</span>
        <Button
          type="text"
          size="small"
          className="guestbook-message-action"
          title="删除"
          onClick={() => handleDelete()}
          disabled={deleting}
        >
          <DeleteOutlined />
        </Button>
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

      <Modal
        title="管理员验证"
        open={deleteModalOpen}
        onOk={handleModalDelete}
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
