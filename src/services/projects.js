import { supabase } from '../lib/supabase.js'

const TABLE = 'projects'
const NOT_CONFIGURED = () => ({ data: null, error: new Error('Supabase is not configured.') })

// Public site: only published work, in display order.
export async function fetchPublishedProjects() {
  if (!supabase) return NOT_CONFIGURED()
  return supabase.from(TABLE).select('*').eq('published', true).order('display_order', { ascending: true })
}

// Admin: everything, including drafts, in display order.
export async function fetchAllProjects() {
  if (!supabase) return NOT_CONFIGURED()
  return supabase.from(TABLE).select('*').order('display_order', { ascending: true })
}

export async function fetchProjectById(id) {
  if (!supabase) return NOT_CONFIGURED()
  return supabase.from(TABLE).select('*').eq('id', id).single()
}

export async function createProject(payload) {
  if (!supabase) return NOT_CONFIGURED()
  return supabase.from(TABLE).insert(payload).select().single()
}

export async function updateProject(id, payload) {
  if (!supabase) return NOT_CONFIGURED()
  return supabase.from(TABLE).update(payload).eq('id', id).select().single()
}

const GRID_SIZE_CYCLE = ['lg', 'sm', 'md', 'lg', 'sm', 'md']

// The public grid's card-size rhythm (`size: "lg" | "md" | "sm"`) isn't a
// column in `projects` — it's derived from display order so the editorial
// grid keeps its big/small rhythm without needing a schema change. If the
// studio later wants per-project control over card size, that would mean
// adding a `size` column and reading it here instead.
export function mapSupabaseProjectToCard(row, index) {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    cover: row.cover_image,
    shortDescription: row.short_description,
    conceptProject: Boolean(row.concept_project),
    size: GRID_SIZE_CYCLE[index % GRID_SIZE_CYCLE.length],
  }
}
