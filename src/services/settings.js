import { supabase } from '../lib/supabase.js'

const TABLE = 'site_settings'
const NOT_CONFIGURED = () => ({ data: null, error: new Error('Supabase is not configured.') })

// `site_settings` is a single-row table. `maybeSingle` returns `data: null`
// instead of erroring when the row doesn't exist yet.
export async function fetchSettings() {
  if (!supabase) return NOT_CONFIGURED()
  return supabase.from(TABLE).select('*').maybeSingle()
}

export async function updateSettings(id, payload) {
  if (!supabase) return NOT_CONFIGURED()
  return supabase.from(TABLE).update(payload).eq('id', id).select().single()
}

// Used only the first time Settings is saved, if the row doesn't exist yet.
export async function createSettings(payload) {
  if (!supabase) return NOT_CONFIGURED()
  return supabase.from(TABLE).insert(payload).select().single()
}
