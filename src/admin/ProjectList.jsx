import { useEffect, useState } from 'react'
import { fetchAllProjects, updateProject } from '../services/projects.js'

export default function ProjectList({ onEdit, onNew }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchAllProjects().then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError) setError('Could not load projects. Please try again.')
      setProjects(data ?? [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function togglePublished(project) {
    setPendingId(project.id)
    setError('')
    const { error: updateError } = await updateProject(project.id, { published: !project.published })
    if (updateError) {
      setError('Could not update this project. Please try again.')
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p)),
      )
    }
    setPendingId(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h1>Projects</h1>
        <button type="button" className="admin-btn admin-btn--primary" onClick={onNew}>
          + New Project
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-hint">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="admin-hint">No projects yet. Create the first one.</p>
      ) : (
        <ul className="admin-list">
          {projects.map((project) => (
            <li key={project.id} className="admin-list__row">
              <div className="admin-list__thumb">
                {project.cover_image ? (
                  <img src={project.cover_image} alt="" loading="lazy" />
                ) : (
                  <span className="admin-list__thumb-empty" aria-hidden="true" />
                )}
              </div>

              <div className="admin-list__info">
                <p className="admin-list__title">{project.title || 'Untitled project'}</p>
                <p className="admin-list__meta">
                  {project.category || '—'} · Order {project.display_order ?? 0}
                  {project.concept_project && <span className="admin-tag">Concept</span>}
                </p>
              </div>

              <span className={`admin-status ${project.published ? 'is-published' : 'is-draft'}`}>
                {project.published ? 'Published' : 'Draft'}
              </span>

              <div className="admin-list__actions">
                <button type="button" className="admin-btn" onClick={() => onEdit(project.id)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  disabled={pendingId === project.id}
                  onClick={() => togglePublished(project)}
                >
                  {project.published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
