import { useEffect, useRef, useState } from 'react'
import { createProject, fetchProjectById, updateProject } from '../services/projects.js'
import { pathFromPublicUrl, removeProjectImage, uploadProjectImage, validateImageFile } from '../services/storage.js'
import { slugify } from '../lib/slugify.js'
import GalleryManager from './GalleryManager.jsx'

const CATEGORIES = ['Brand Identity', 'Social Media', 'Event Design']

const EMPTY_FORM = {
  title: '',
  slug: '',
  category: CATEGORIES[0],
  year: new Date().getFullYear(),
  location: '',
  short_description: '',
  concept_project: false,
  display_order: 0,
  published: false,
}

function friendlySaveError(error) {
  if (error?.code === '23505') return 'That slug is already in use. Please choose a different one.'
  return 'Could not save project. Please try again.'
}

// `projectId`: null = creating a new project, a string = editing that id.
export default function ProjectEditor({ projectId, onDone }) {
  const isNew = projectId === null

  const [project, setProject] = useState(null) // set once the row exists in Supabase
  const [form, setForm] = useState(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverError, setCoverError] = useState('')
  const coverInputRef = useRef(null)
  const savedTimeoutRef = useRef(null)

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    fetchProjectById(projectId).then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError || !data) {
        setError('Could not load this project.')
      } else {
        setProject(data)
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          category: data.category ?? CATEGORIES[0],
          year: data.year ?? new Date().getFullYear(),
          location: data.location ?? '',
          short_description: data.short_description ?? '',
          concept_project: Boolean(data.concept_project),
          display_order: data.display_order ?? 0,
          published: Boolean(data.published),
        })
        setSlugTouched(true) // don't let title edits silently rewrite an existing slug
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [projectId, isNew])

  useEffect(() => () => clearTimeout(savedTimeoutRef.current), [])

  function flashSaved() {
    setSaved(true)
    clearTimeout(savedTimeoutRef.current)
    savedTimeoutRef.current = setTimeout(() => setSaved(false), 2000)
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleTitleChange(value) {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }))
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')

    const title = form.title.trim()
    const slug = slugify(form.slug || form.title)

    if (!title) {
      setError('Title is required.')
      return
    }
    if (!slug) {
      setError('Slug could not be generated. Please enter a title or a slug.')
      return
    }

    const payload = {
      title,
      slug,
      category: form.category,
      year: form.year === '' ? null : Number(form.year),
      location: form.location.trim(),
      short_description: form.short_description.trim(),
      concept_project: form.concept_project,
      display_order: form.display_order === '' ? 0 : Number(form.display_order),
      published: form.published,
    }

    setSaving(true)

    if (!project) {
      const { data, error: createError } = await createProject(payload)
      setSaving(false)
      if (createError) {
        setError(friendlySaveError(createError))
        return
      }
      setProject(data)
      setForm((f) => ({ ...f, slug: data.slug }))
      flashSaved()
      return
    }

    const { data, error: updateError } = await updateProject(project.id, payload)
    setSaving(false)
    if (updateError) {
      setError(friendlySaveError(updateError))
      return
    }
    setProject(data)
    setForm((f) => ({ ...f, slug: data.slug }))
    flashSaved()
  }

  async function handleCoverChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !project) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setCoverError(validationError)
      return
    }

    setCoverError('')
    setCoverUploading(true)

    const { data, error: uploadError } = await uploadProjectImage(project.id, file, { prefix: 'cover' })
    if (uploadError) {
      setCoverError('Could not upload cover image. Please try again.')
      setCoverUploading(false)
      return
    }

    const previousUrl = project.cover_image
    const { data: updated, error: updateError } = await updateProject(project.id, { cover_image: data.url })
    setCoverUploading(false)

    if (updateError) {
      setCoverError('Could not save cover image. Please try again.')
      return
    }

    setProject(updated)

    const previousPath = pathFromPublicUrl(previousUrl)
    if (previousPath) removeProjectImage(previousPath)
  }

  async function persistGallery(nextGallery) {
    const { data, error: saveError } = await updateProject(project.id, { gallery: nextGallery })
    if (!saveError) setProject(data)
    return { error: saveError }
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <p className="admin-hint">Loading project…</p>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h1>{project ? 'Edit Project' : 'New Project'}</h1>
        <button type="button" className="admin-btn" onClick={onDone}>
          Cancel
        </button>
      </div>

      <form className="admin-form" onSubmit={handleSave}>
        <label className="admin-field">
          <span className="admin-field__label">Title</span>
          <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Slug</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              updateField('slug', e.target.value)
            }}
            onBlur={(e) => updateField('slug', slugify(e.target.value))}
            required
          />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Category</span>
          <select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="admin-form__row">
          <label className="admin-field">
            <span className="admin-field__label">Year</span>
            <input
              type="number"
              value={form.year}
              onChange={(e) => updateField('year', e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Display Order</span>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => updateField('display_order', e.target.value)}
            />
          </label>
        </div>

        <label className="admin-field">
          <span className="admin-field__label">Location</span>
          <input type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)} />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Short Description</span>
          <textarea
            rows={3}
            value={form.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
          />
        </label>

        <div className="admin-form__row">
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.concept_project}
              onChange={(e) => updateField('concept_project', e.target.checked)}
            />
            Concept Project
          </label>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => updateField('published', e.target.checked)}
            />
            Published
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form__actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Project'}
          </button>
          {saved && <span className="admin-saved">Saved.</span>}
        </div>
      </form>

      {project && (
        <>
          <div className="admin-field">
            <span className="admin-field__label">Cover Image</span>
            <div className="admin-cover">
              {project.cover_image ? (
                <img src={project.cover_image} alt="" className="admin-cover__preview" />
              ) : (
                <div className="admin-cover__empty">No cover yet</div>
              )}
              <div className="admin-cover__controls">
                <button
                  type="button"
                  className="admin-btn"
                  disabled={coverUploading}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverUploading ? 'Uploading…' : project.cover_image ? 'Replace Cover' : 'Upload Cover'}
                </button>
                <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverChange} />
                {coverError && <p className="admin-error">{coverError}</p>}
              </div>
            </div>
          </div>

          <GalleryManager projectId={project.id} gallery={project.gallery ?? []} onChange={persistGallery} />
        </>
      )}

      {!project && (
        <p className="admin-hint">Save the project once to unlock cover and gallery uploads.</p>
      )}
    </div>
  )
}
