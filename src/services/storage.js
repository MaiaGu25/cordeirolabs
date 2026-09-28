import { supabase } from '../lib/supabase.js'

const BUCKET = 'portfolio'
const MAX_SOURCE_BYTES = 15 * 1024 * 1024 // 15MB ceiling on the original upload
const MAX_DIMENSION = 2400 // px, longest edge — generous for a portfolio cover
const OUTPUT_QUALITY = 0.86
const PUBLIC_URL_MARKER = '/storage/v1/object/public/' + BUCKET + '/'

// --- Validation ---------------------------------------------------------

export function validateImageFile(file) {
  if (!file) return 'No file selected.'
  if (!file.type || !file.type.startsWith('image/')) return 'Please select an image file.'
  if (file.size > MAX_SOURCE_BYTES) return 'Image is too large. Please choose a file under 15MB.'
  return null
}

// --- Client-side processing ---------------------------------------------
//
// Before upload, every image is redrawn onto a canvas capped at
// MAX_DIMENSION on its longest edge and re-encoded as WebP at ~86% quality
// (falling back to JPEG, then to the original file, if the browser can't
// encode WebP). This is the only processing done — no cropping, no color
// changes — and it's enough to stop a 10-15MB phone photo from being
// stored and served at full size for a thumbnail.

async function loadImageSource(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file)
    } catch {
      // fall through to the <img> based loader below
    }
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (event) => {
      URL.revokeObjectURL(url)
      reject(event)
    }
    img.src = url
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function processImageFile(file) {
  const source = await loadImageSource(file)
  const sourceWidth = source.width
  const sourceHeight = source.height
  const scale = Math.min(1, MAX_DIMENSION / Math.max(sourceWidth, sourceHeight))
  const width = Math.max(1, Math.round(sourceWidth * scale))
  const height = Math.max(1, Math.round(sourceHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(source, 0, 0, width, height)
  source.close?.()

  const webpBlob = await canvasToBlob(canvas, 'image/webp', OUTPUT_QUALITY)
  if (webpBlob) return { blob: webpBlob, extension: 'webp' }

  // Older browsers (e.g. Safari < 14) may not support WebP encoding.
  const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', OUTPUT_QUALITY)
  if (jpegBlob) return { blob: jpegBlob, extension: 'jpg' }

  throw new Error('Canvas encoding is not supported in this browser.')
}

// --- Upload / delete ------------------------------------------------------

export async function uploadProjectImage(projectId, file, { prefix = 'gallery' } = {}) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured.') }

  let blob = file
  let extension = (file.name.split('.').pop() || 'jpg').toLowerCase()

  try {
    const processed = await processImageFile(file)
    blob = processed.blob
    extension = processed.extension
  } catch (error) {
    // Processing is a best-effort optimization — if it fails for any
    // reason, fall back to uploading the original (already size-validated)
    // file rather than blocking the upload.
    console.warn('Client-side image processing failed, uploading the original file instead:', error)
  }

  const path = `projects/${projectId}/${prefix}-${Date.now()}.${extension}`
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type || file.type, upsert: false })

  if (uploadError) return { data: null, error: uploadError }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { data: { path, url: data.publicUrl }, error: null }
}

export async function removeProjectImage(path) {
  if (!supabase || !path) return { error: null }
  return supabase.storage.from(BUCKET).remove([path])
}

// Recovers the storage path from one of our own public URLs, so a replaced
// cover image can be cleaned up even though `projects.cover_image` only
// stores the URL. Returns null (skip cleanup) for anything that doesn't
// look like one of our own bucket URLs.
export function pathFromPublicUrl(url) {
  if (!url) return null
  const index = url.indexOf(PUBLIC_URL_MARKER)
  if (index === -1) return null
  return url.slice(index + PUBLIC_URL_MARKER.length)
}
