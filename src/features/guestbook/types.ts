export interface GuestbookMessage {
  id: string
  author: string
  content: string
  createdAt: string
  replyToId?: string
  replies?: GuestbookMessage[]
}

export interface GuestbookApiResponse {
  messages: GuestbookMessage[]
}

export interface GuestbookCreatePayload {
  author: string
  content: string
  replyToId?: string
}
