const KV_KEY = 'guestbook:messages'
const MAX_CONTENT = 500
const MAX_AUTHOR = 30

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=UTF-8' }
  })
}

function sanitize(str, maxLen) {
  if (typeof str !== 'string') return ''
  return str.trim().slice(0, maxLen)
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

async function getMessages(kv) {
  const data = await kv.get(KV_KEY, 'json')
  return Array.isArray(data) ? data : []
}

async function putMessages(kv, messages) {
  await kv.put(KV_KEY, JSON.stringify(messages))
}

export async function onRequest({ request, env }) {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (!env.GUESTBOOK_KV) {
      return json({ error: 'KV 存储未绑定，请在控制台绑定 GUESTBOOK_KV' }, 500)
    }

    if (request.method === 'GET') {
      const messages = await getMessages(env.GUESTBOOK_KV)
      return json({ messages })
    }

    if (request.method === 'POST') {
      let body
      try {
        body = await request.json()
      } catch {
        return json({ error: '无效的请求数据' }, 400)
      }

      const author = sanitize(body.author, MAX_AUTHOR)
      const content = sanitize(body.content, MAX_CONTENT)
      const replyToId = body.replyToId

      if (!author) return json({ error: '请输入昵称' }, 400)
      if (!content) return json({ error: '请输入留言内容' }, 400)

      const messages = await getMessages(env.GUESTBOOK_KV)
      const newMsg = {
        id: generateId(),
        author,
        content,
        createdAt: new Date().toISOString()
      }

      if (replyToId) {
        const parent = messages.find(m => m.id === replyToId)
        if (!parent) return json({ error: '回复的留言不存在' }, 404)
        newMsg.replyToId = replyToId
        if (!parent.replies) parent.replies = []
        parent.replies.push(newMsg)
      } else {
        messages.unshift(newMsg)
      }

      await putMessages(env.GUESTBOOK_KV, messages)
      return json({ message: newMsg }, 201)
    }

    if (request.method === 'DELETE') {
      const authHeader = request.headers.get('Authorization') || ''
      const token = authHeader.replace('Bearer ', '')
      if (!token || token !== env.ADMIN_TOKEN) {
        return json({ error: '无权操作' }, 403)
      }

      let body
      try {
        body = await request.json()
      } catch {
        return json({ error: '无效的请求数据' }, 400)
      }

      if (!body.id) return json({ error: '缺少留言 ID' }, 400)

      const messages = await getMessages(env.GUESTBOOK_KV)
      let found = false

      const filtered = messages.filter(msg => {
        if (msg.id === body.id) {
          found = true
          return false
        }
        if (msg.replies) {
          const prevLen = msg.replies.length
          msg.replies = msg.replies.filter(r => r.id !== body.id)
          if (msg.replies.length < prevLen) found = true
        }
        return true
      })

      if (!found) return json({ error: '留言不存在' }, 404)

      await putMessages(GUESTBOOK_KV, filtered)
      return json({ success: true })
    }

    return json({ error: 'Method not allowed' }, 405)
  } catch (err) {
    return json({ error: '服务器错误: ' + (err.message || String(err)) }, 500)
  }
}
