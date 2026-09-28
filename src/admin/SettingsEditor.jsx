import { useEffect, useRef, useState } from 'react'
import { createSettings, fetchSettings, updateSettings } from '../services/settings.js'

export default function SettingsEditor() {
  const [record, setRecord] = useState(null) // the saved row, if one exists yet
  const [form, setForm] = useState({ email: '', phone: '', instagram: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const savedTimeoutRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetchSettings().then(({ data, error: fetchError }) => {
      if (cancelled) return
      if (fetchError) setError('Could not load settings.')
      if (data) {
        setRecord(data)
        setForm({ email: data.email ?? '', phone: data.phone ?? '', instagram: data.instagram ?? '' })
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => () => clearTimeout(savedTimeoutRef.current), [])

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    const { data, error: saveError } = record
      ? await updateSettings(record.id, form)
      : await createSettings(form)

    setSaving(false)

    if (saveError) {
      setError('Could not save settings. Please try again.')
      return
    }

    setRecord(data)
    setSaved(true)
    clearTimeout(savedTimeoutRef.current)
    savedTimeoutRef.current = setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <p className="admin-hint">Loading settings…</p>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h1>Settings</h1>
      </div>

      <form className="admin-form" onSubmit={handleSave}>
        <label className="admin-field">
          <span className="admin-field__label">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="hello@cordeirolabs.com"
          />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Phone / WhatsApp</span>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+00 00000-0000"
          />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Instagram</span>
          <input
            type="text"
            value={form.instagram}
            onChange={(e) => updateField('instagram', e.target.value)}
            placeholder="@cordeirolabs"
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form__actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span className="admin-saved">Saved.</span>}
        </div>
      </form>
    </div>
  )
}
