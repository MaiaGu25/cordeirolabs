import { useEffect, useState } from 'react'
import { fetchSettings } from '../services/settings.js'
import { contact as localContact } from '../data/contact.js'

function toWhatsAppHref(rawPhone) {
  const digits = (rawPhone || '').replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
}

function toInstagramHref(rawHandle) {
  if (!rawHandle) return null
  if (/^https?:\/\//.test(rawHandle)) return rawHandle
  return `https://instagram.com/${rawHandle.replace(/^@/, '')}`
}

function toInstagramLabel(rawHandle) {
  if (!rawHandle) return ''
  if (/^https?:\/\//.test(rawHandle)) {
    return rawHandle.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '@')
  }
  return rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`
}

function mapSettingsToContact(row) {
  return {
    email: {
      key: 'email',
      label: 'Email',
      value: row.email || localContact.email.value,
      href: row.email ? `mailto:${row.email}` : localContact.email.href,
    },
    phone: {
      key: 'phone',
      label: 'Phone / WhatsApp',
      value: row.phone || localContact.phone.value,
      href: (row.phone && toWhatsAppHref(row.phone)) || localContact.phone.href,
    },
    instagram: {
      key: 'instagram',
      label: 'Instagram',
      value: row.instagram ? toInstagramLabel(row.instagram) : localContact.instagram.value,
      href: (row.instagram && toInstagramHref(row.instagram)) || localContact.instagram.href,
    },
  }
}

// Same fallback pattern as `usePublishedProjects`: local placeholder
// contact details render immediately, and are silently replaced once
// `site_settings` resolves (if Supabase is configured and has a row).
export function useSiteSettings() {
  const [contact, setContact] = useState(localContact)

  useEffect(() => {
    let cancelled = false

    fetchSettings().then(({ data, error }) => {
      if (cancelled || error || !data) return
      setContact(mapSettingsToContact(data))
    })

    return () => {
      cancelled = true
    }
  }, [])

  return contact
}
