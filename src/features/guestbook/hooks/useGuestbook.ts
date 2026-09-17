import { useState, useEffect, useCallback } from 'react'
import { fetchMessages, createMessage } from '../api'
import type { GuestbookMessage, GuestbookCreatePayload } from '../types'

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '发布失败')
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [])

  return {
    messages,
    loading,
    error,
    submitting,
    submitMessage,
    refresh: load
  }
}
