import { supabase } from '@/lib/supabase'

export interface SendEmailPayload {
  subject: string
  html: string
  to?: string
  from?: string
}

export async function sendEmail(payload: SendEmailPayload): Promise<{ success: boolean }> {
  const { data, error } = await supabase.functions.invoke('notify-message', {
    body: {
      type: 'SEND_EMAIL',
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      from: payload.from
    }
  })

  if (error) throw new Error(error.message)
  return data as { success: boolean }
}
