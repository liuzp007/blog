import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://roxkmzuaqkbtbmysvibz.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJveGttenVhcWtidGJteXN2aWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMzcxNDEsImV4cCI6MjA5NjcxMzE0MX0.52JueHiHRjuJ67PTC584er-Plzi6jxMwFSNhatU_ONI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
