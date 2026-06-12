const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info'
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
    const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL')!

    let to: string[]
    let subject: string
    let html: string
    let from: string

    if (payload.type === 'SEND_EMAIL') {
      to = [payload.to || NOTIFY_EMAIL]
      subject = payload.subject
      html = payload.html
      from = payload.from || '信号站 <onboarding@resend.dev>'
    } else {
      return new Response('ignored', { status: 200, headers: corsHeaders })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, subject, html })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ success: false, error: err }), {
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
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
