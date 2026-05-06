import type { GuestbookMessage, GuestbookCreatePayload } from './types'

const API_BASE = '/api/guestbook'

export async function fetchMessages(): Promise<GuestbookMessage[]> {
  const res = await fetch(API_BASE)
  if (!res.ok) throw new Error('获取留言失败')
  const data = await res.json()
  return data.messages ?? []
}

export async function createMessage(payload: GuestbookCreatePayload): Promise<GuestbookMessage> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || '发布失败')
  }
  const data = await res.json()
  return data.message
}

export async function deleteMessage(id: string, token: string): Promise<void> {
  const res = await fetch(API_BASE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ id })
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || '删除失败')
  }
}
