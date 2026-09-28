// "Café Nova" -> "cafe-nova", "NOMA" -> "noma". Used both to auto-generate a
// slug from a project title and to sanitize whatever the admin types
// manually into the slug field.
export function slugify(text) {
  return (text ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
