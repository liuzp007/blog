import { useState, useEffect, useCallback } from 'react'
import type { GuestbookMessage, GuestbookCreatePayload } from '../types'
import { fetchMessages, createMessage, deleteMessage as apiDelete } from '../api'

export function useGuestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchMessages()
      setMessages(data)
    } catch {
      setError('无法加载留言，请稍后再试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const submitMessage = useCallback(async (payload: GuestbookCreatePayload) => {
    setSubmitting(true)
    try {
      const msg = await createMessage(payload)
      if (payload.replyToId) {
        setMessages(prev =>
          prev.map(m =>
            m.id === payload.replyToId ? { ...m, replies: [...(m.replies || []), msg] } : m
          )
        )
      } else {
        setMessages(prev => [msg, ...prev])
      }
      return msg
    } catch (err: any) {
      setError(err.message || '发布失败')
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [])

  const removeMessage = useCallback(async (id: string) => {
    await apiDelete(id)
    setMessages(prev =>
      prev
        .filter(m => m.id !== id)
        .map(m => ({
          ...m,
          replies: m.replies?.filter(r => r.id !== id) || []
        }))
    )
  }, [])

  return {
    messages,
    loading,
    error,
    submitting,
    submitMessage,
    removeMessage,
    refresh: load
  }
}
