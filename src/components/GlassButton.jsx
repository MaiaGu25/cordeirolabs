import { useEffect, useRef } from 'react'
import './GlassButton.css'

// A restrained "liquid glass" CTA: frosted, translucent surface with a soft
// pointer-tracked highlight. Reserved for the site's one or two key calls to
// action — not a replacement for regular links.
//
// The highlight position is cached per hover (not re-measured on every
// pointermove) and only written to the DOM once per animation frame, so
// moving the pointer over the button never triggers a layout read/write
// loop.
export default function GlassButton({ href, children, symbol = '→', tone, className, ...rest }) {
  const ref = useRef(null)
  const rectRef = useRef(null)
  const pointRef = useRef({ x: 50, y: 0 })
  const frameRef = useRef(null)

  useEffect(() => {
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  function applySheenPosition() {
    frameRef.current = null
    const el = ref.current
    if (!el) return
    el.style.setProperty('--gx', `${pointRef.current.x}%`)
    el.style.setProperty('--gy', `${pointRef.current.y}%`)
  }

  function handlePointerEnter() {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null
  }

  function handlePointerMove(event) {
    const rect = rectRef.current
    if (!rect) return
    pointRef.current = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    }
    if (frameRef.current == null) {
      frameRef.current = requestAnimationFrame(applySheenPosition)
    }
  }

  const classes = ['glass-btn', tone && `glass-btn--${tone}`, className].filter(Boolean).join(' ')

  return (
    <a
      ref={ref}
      href={href}
      className={classes}
      data-symbol={symbol}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      {...rest}
    >
      <span className="glass-btn__sheen" aria-hidden="true" />
      <span className="glass-btn__label">{children}</span>
      <span className="glass-btn__symbol" aria-hidden="true">
        {symbol}
      </span>
    </a>
  )
}
