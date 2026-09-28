import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import GlassButton from './GlassButton.jsx'
import './Hero.css'

const HERO_IMAGE = 'https://picsum.photos/seed/cordeirolabs-hero/1920/1280'

// Scroll Expansion Hero: the section reserves extra scroll height so a
// sticky, initially-contained frame can scale up to full-bleed purely from
// natural scroll position (no wheel/touch interception, no preventDefault).
// On small screens and with `prefers-reduced-motion`, it falls back to a
// static, single-viewport hero instead.
export default function Hero() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const [isCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches,
  )

  const expansive = !reduceMotion && !isCompact

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const frameScale = useTransform(scrollYProgress, [0, 0.55], [0.62, 1])
  const frameRadius = useTransform(scrollYProgress, [0, 0.55], [32, 0])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const copyY = useTransform(scrollYProgress, [0, 0.3], [0, -48])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`hero ${expansive ? 'hero--expansive' : 'hero--simple'}`}
    >
      <div className="hero__sticky">
        <motion.div
          className="hero__frame"
          style={expansive ? { scale: frameScale, borderRadius: frameRadius } : undefined}
        >
          <img
            className="hero__frame-img"
            src={HERO_IMAGE}
            alt=""
            width={1920}
            height={1280}
            loading="eager"
            fetchPriority="high"
          />
          <div className="hero__frame-veil" />
        </motion.div>

        <motion.div
          className="hero__copy"
          style={expansive ? { opacity: copyOpacity, y: copyY } : undefined}
          initial={expansive ? false : { opacity: 0, y: 24 }}
          animate={expansive ? undefined : { opacity: 1, y: 0 }}
          transition={expansive ? undefined : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow hero__eyebrow">Independent Design Studio</p>
          <h1 className="hero__title">
            CORDEIRO LABS<span className="mark-reg">®</span>
          </h1>
          <p className="hero__tagline">Building identities for brands that want to be remembered.</p>
          <GlassButton href="#work" symbol="↓" className="hero__cta">
            View Our Work
          </GlassButton>
        </motion.div>

        {expansive && (
          <motion.div className="hero__cue" style={{ opacity: cueOpacity }} aria-hidden="true">
            <span className="hero__cue-line" />
            Scroll
          </motion.div>
        )}
      </div>
    </section>
  )
}
