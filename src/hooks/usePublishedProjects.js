import { useEffect, useState } from 'react'
import { fetchPublishedProjects, mapSupabaseProjectToCard } from '../services/projects.js'
import { projects as localProjects } from '../data/projects.js'

// Temporary fallback while the real portfolio is still being populated in
// Supabase: render local mock projects immediately (no empty/loading state
// on first paint) and silently swap to Supabase's published projects if
// there are any once the fetch resolves. If Supabase has no published rows
// yet, the local set simply stays.
//
// To remove this fallback later: delete this hook's local-data branch and
// have `Portfolio.jsx` read `fetchPublishedProjects()` directly (and delete
// `src/data/projects.js`).
export function usePublishedProjects() {
  const [projects, setProjects] = useState(localProjects)
  const [source, setSource] = useState('local')

  useEffect(() => {
    let cancelled = false

    fetchPublishedProjects().then(({ data, error }) => {
      if (cancelled) return
      if (!error && data && data.length > 0) {
        setProjects(data.map(mapSupabaseProjectToCard))
        setSource('supabase')
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { projects, source }
}
