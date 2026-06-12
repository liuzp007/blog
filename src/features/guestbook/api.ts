import { supabase } from '@/lib/supabase'
import { normalizeWhitespace, hasMaliciousContent } from '@/utils/sanitize'
import type { GuestbookMessage, GuestbookCreatePayload } from './types'

interface DbRow {
  id: string
  author: string
  content: string
  reply_to_id: string | null
  created_at: string
  is_deleted: boolean
}

function toMessage(row: DbRow): GuestbookMessage {
  return {
    id: row.id,
    author: row.author,
    content: row.content,
    createdAt: row.created_at,
    replyToId: row.reply_to_id ?? undefined
  }
}

function buildTree(messages: GuestbookMessage[]): GuestbookMessage[] {
  const roots: GuestbookMessage[] = []
  const map = new Map<string, GuestbookMessage>()

  for (const msg of messages) {
    map.set(msg.id, { ...msg, replies: [] })
  }

  for (const msg of messages) {
    const node = map.get(msg.id)!
    if (msg.replyToId && map.has(msg.replyToId)) {
      map.get(msg.replyToId)!.replies!.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

export async function fetchMessages(): Promise<GuestbookMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  const rows = (data as DbRow[]).map(toMessage)
  return buildTree(rows)
}

export async function createMessage(payload: GuestbookCreatePayload): Promise<GuestbookMessage> {
  const author = normalizeWhitespace(payload.author).slice(0, 30)
  const content = normalizeWhitespace(payload.content).slice(0, 500)

  if (!author || !content) throw new Error('内容不能为空')
  if (hasMaliciousContent(author) || hasMaliciousContent(content)) {
    throw new Error('内容包含不允许的字符')
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      author,
      content,
      reply_to_id: payload.replyToId ?? null
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return toMessage(data as DbRow)
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from('messages').update({ is_deleted: true }).eq('id', id)
  if (error) throw new Error(error.message)
}
