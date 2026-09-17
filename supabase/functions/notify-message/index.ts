const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:8081', 'http://127.0.0.1:8081']
const REQUEST_LIMIT = 5
const REQUEST_WINDOW_MS = 60 * 60 * 1000
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function getAllowedOrigins(): string[] {
  const configured = Deno.env.get('SITE_ORIGIN')
  return configured ? [...DEFAULT_ALLOWED_ORIGINS, configured] : DEFAULT_ALLOWED_ORIGINS
}

function getCorsHeaders(req: Request): Record<string, string> | null {
  const origin = req.headers.get('Origin')
  if (!origin || !getAllowedOrigins().includes(origin)) return null

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
    Vary: 'Origin'
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isRateLimited(req: Request): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const current = requestCounts.get(ip)

  if (!current || current.resetAt <= now) {
    requestCounts.set(ip, { count: 1, resetAt: now + REQUEST_WINDOW_MS })
    return false
  }

  current.count += 1
  return current.count > REQUEST_LIMIT
}

Deno.serve(async req => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return corsHeaders
      ? new Response('ok', { headers: corsHeaders })
      : new Response(null, { status: 403 })
  }

  if (req.method !== 'POST' || !corsHeaders) {
    return new Response(null, { status: 403 })
  }

  if (isRateLimited(req)) {
    return new Response(JSON.stringify({ success: false, error: 'Too many requests' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const payload = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL')
    const NOTIFY_FROM = Deno.env.get('NOTIFY_FROM') || '信号站 <onboarding@resend.dev>'

    if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email service is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (payload?.type !== 'CONTACT_MESSAGE') {
      return new Response(JSON.stringify({ success: false, error: 'Invalid message type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const name = String(payload.name || '').trim().slice(0, 30)
    const email = String(payload.email || '').trim().slice(0, 100)
    const content = String(payload.content || '').trim().slice(0, 500)

    if (!name || !content || !isEmail(email)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid contact payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const escapedName = escapeHtml(name)
    const escapedEmail = escapeHtml(email)
    const escapedContent = escapeHtml(content).replaceAll('\n', '<br>')
    const html = `
      <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2>新的联系邮件</h2>
        <p><strong>${escapedName}</strong></p>
        <p>回复邮箱：${escapedEmail}</p>
        <p>${escapedContent}</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_EMAIL],
        reply_to: email,
        subject: '新的联系邮件',
        html
      })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ success: false, error: 'Email delivery failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Unexpected server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
