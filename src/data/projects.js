// Portfolio data. While CordeiroLabs builds its first real client roster,
// entries can be marked as `conceptProject: true` — the UI surfaces this as
// a "Concept" tag so provisional work is never presented as a real client.
//
// Shape is deliberately case-study-ready: once individual project pages
// exist (e.g. `/work/<slug>`), this same array can power them without
// changing its structure — just update the values.
//
// size: controls the card footprint in the editorial grid ("lg" | "md" | "sm")

export const projects = [
  {
    slug: 'noma',
    title: 'NOMA',
    category: 'Brand Identity',
    year: 2025,
    location: 'Oslo, NO',
    cover: 'https://picsum.photos/seed/noma-cover/1000/1250',
    gallery: [
      'https://picsum.photos/seed/noma-1/1400/1750',
      'https://picsum.photos/seed/noma-2/1400/1050',
    ],
    shortDescription: 'A quiet, confident identity for a modern dining concept.',
    conceptProject: true,
    size: 'lg',
  },
  {
    slug: 'mora',
    title: 'MORA',
    category: 'Brand Identity',
    year: 2025,
    location: 'Lisbon, PT',
    cover: 'https://picsum.photos/seed/mora-cover/900/700',
    gallery: [
      'https://picsum.photos/seed/mora-1/1400/1050',
      'https://picsum.photos/seed/mora-2/1400/1750',
    ],
    shortDescription: 'Editorial branding for an independent skincare label.',
    conceptProject: true,
    size: 'sm',
  },
  {
    slug: 'kova',
    title: 'KOVA',
    category: 'Social Media',
    year: 2026,
    location: 'Berlin, DE',
    cover: 'https://picsum.photos/seed/kova-cover/900/900',
    gallery: [
      'https://picsum.photos/seed/kova-1/1400/1400',
      'https://picsum.photos/seed/kova-2/1400/1050',
    ],
    shortDescription: 'A bold content system for a streetwear collective.',
    conceptProject: true,
    size: 'md',
  },
  {
    slug: 'pulse',
    title: 'PULSE',
    category: 'Social Media',
    year: 2026,
    location: 'Toronto, CA',
    cover: 'https://picsum.photos/seed/pulse-cover/1000/1250',
    gallery: [
      'https://picsum.photos/seed/pulse-1/1400/1750',
      'https://picsum.photos/seed/pulse-2/1400/1050',
    ],
    shortDescription: 'Ongoing content direction for a boutique fitness brand.',
    conceptProject: true,
    size: 'lg',
  },
  {
    slug: 'shift',
    title: 'SHIFT',
    category: 'Event Design',
    year: 2026,
    location: 'New York, US',
    cover: 'https://picsum.photos/seed/shift-cover/900/700',
    gallery: [
      'https://picsum.photos/seed/shift-1/1400/1050',
      'https://picsum.photos/seed/shift-2/1400/1750',
    ],
    shortDescription: 'Visual direction for an annual design summit.',
    conceptProject: true,
    size: 'sm',
  },
  {
    slug: 'nova',
    title: 'NØVA',
    category: 'Event Design',
    year: 2026,
    location: 'Milan, IT',
    cover: 'https://picsum.photos/seed/nova-cover/900/900',
    gallery: [
      'https://picsum.photos/seed/nova-1/1400/1400',
      'https://picsum.photos/seed/nova-2/1400/1050',
    ],
    shortDescription: 'Launch identity and staging for a music showcase.',
    conceptProject: true,
    size: 'md',
  },
]
