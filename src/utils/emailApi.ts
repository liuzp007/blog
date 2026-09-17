import { supabase } from '@/lib/supabase'

export interface SendEmailPayload {
  name: string
  email: string
  content: string
}

export async function sendEmail(payload: SendEmailPayload): Promise<{ success: boolean }> {
  const { data, error } = await supabase.functions.invoke('notify-message', {
    body: {
      type: 'CONTACT_MESSAGE',
      name: payload.name,
      email: payload.email,
      content: payload.content
    }
  })

  if (error) throw new Error(error.message)
  return data as { success: boolean }
}
