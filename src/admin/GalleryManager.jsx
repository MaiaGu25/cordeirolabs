import { useRef, useState } from 'react'
import { removeProjectImage, uploadProjectImage, validateImageFile } from '../services/storage.js'

// `gallery` is the array currently saved on the project; `onChange` persists
// a new array to Supabase and returns `{ error }`. This component never
// talks to Supabase directly for the project row — only for storage.
export default function GalleryManager({ projectId, gallery, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [busyIndex, setBusyIndex] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  async function handleFiles(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (files.length === 0) return

    setError('')
    setUploading(true)

    let nextGallery = gallery
    let uploadFailed = false

    for (const file of files) {
      const validationError = validateImageFile(file)
      if (validationError) {
        setError(validationError)
        continue
      }
      const { data, error: uploadError } = await uploadProjectImage(projectId, file, { prefix: 'gallery' })
      if (uploadError) {
        uploadFailed = true
        continue
      }
      nextGallery = [...nextGallery, { url: data.url, path: data.path, alt: '', order: nextGallery.length }]
    }

    if (uploadFailed) setError('Could not upload one or more images. Please try again.')

    if (nextGallery !== gallery) {
      const { error: saveError } = await onChange(nextGallery)
      if (saveError) setError('Could not save the gallery. Please try again.')
    }

    setUploading(false)
  }

  async function handleRemove(index) {
    const target = gallery[index]
    setBusyIndex(index)
    setError('')

    const nextGallery = gallery.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i }))
    const { error: saveError } = await onChange(nextGallery)

    if (saveError) {
      setError('Could not update the gallery. Please try again.')
    } else if (target?.path) {
      removeProjectImage(target.path)
    }

    setBusyIndex(null)
  }

  async function handleMove(index, direction) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= gallery.length) return

    const next = [...gallery]
    ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
    const reordered = next.map((item, i) => ({ ...item, order: i }))

    setBusyIndex(index)
    setError('')
    const { error: saveError } = await onChange(reordered)
    if (saveError) setError('Could not reorder the gallery. Please try again.')
    setBusyIndex(null)
  }

  return (
    <div className="admin-field">
      <div className="admin-gallery__head">
        <span className="admin-field__label">Project Gallery</span>
        <button
          type="button"
          className="admin-btn"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : '+ Add Images'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      </div>

      {error && <p className="admin-error">{error}</p>}

      {gallery.length === 0 ? (
        <p className="admin-hint">No gallery images yet.</p>
      ) : (
        <ul className="admin-gallery__grid">
          {gallery.map((item, index) => (
            <li key={item.path || item.url} className="admin-gallery__item">
              <img src={item.url} alt={item.alt || ''} loading="lazy" />
              <div className="admin-gallery__actions">
                <button
                  type="button"
                  disabled={index === 0 || busyIndex !== null}
                  onClick={() => handleMove(index, -1)}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === gallery.length - 1 || busyIndex !== null}
                  onClick={() => handleMove(index, 1)}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-btn--danger"
                  disabled={busyIndex !== null}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
