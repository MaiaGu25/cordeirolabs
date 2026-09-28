import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import './TextReveal.css'

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.25, 1])
  return (
    <span className="text-reveal__word">
      <span className="text-reveal__word-bg" aria-hidden="true">
        {children}
      </span>
      <motion.span className="text-reveal__word-fg" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  )
}

// Progressive, per-word reveal tied to scroll position — used sparingly, on
// a single statement, so it stays an accent rather than a wallpaper effect.
export default function TextReveal({ text, className = '' }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.25'],
  })

  if (reduceMotion) {
    return <p className={`text-reveal ${className}`}>{text}</p>
  }

  const words = text.split(' ')

  return (
    <p ref={ref} className={`text-reveal ${className}`}>
      {words.map((word, i) => (
        <Word key={`${word}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  )
}
