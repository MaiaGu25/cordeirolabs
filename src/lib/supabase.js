import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to initialize the Supabase client:', error)
  }
} else {
  console.warn(
    'Supabase environment variables are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
      'The public site will fall back to local data and /admin will be unusable until they are set in .env.local.',
  )
}

// `null` when Supabase isn't configured or failed to initialize — every
// caller (services, hooks) checks this and degrades gracefully instead of
// throwing, so a missing/broken Supabase setup never breaks the public site.
export const supabase = client
export const isSupabaseConfigured = Boolean(client)
