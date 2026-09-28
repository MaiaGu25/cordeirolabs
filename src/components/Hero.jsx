import { motion, useReducedMotion } from 'framer-motion'
import { ArrowIcon } from './Icons.jsx'
import './Hero.css'

const FLOATERS = [
  {
    seed: 'hero-float-1',
    className: 'hero__float hero__float--a',
    w: 340,
    h: 420,
    delay: 0,
  },
  {
    seed: 'hero-float-2',
    className: 'hero__float hero__float--b',
    w: 260,
    h: 200,
    delay: 0.6,
  },
  {
    seed: 'hero-float-3',
    className: 'hero__float hero__float--c',
    w: 220,
    h: 280,
    delay: 1.1,
  },
]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="topo" className="hero">
      <div className="hero__field" aria-hidden="true">
        {FLOATERS.map((f) => (
          <motion.img
            key={f.seed}
            className={f.className}
            src={`https://picsum.photos/seed/${f.seed}/${f.w}/${f.h}`}
            alt=""
            width={f.w}
            height={f.h}
            loading="eager"
            initial={{ opacity: 0, y: 30 }}
            animate={
              reduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: [0, -16, 0] }
            }
            transition={
              reduceMotion
                ? { duration: 0.8 }
                : {
                    opacity: { duration: 0.9, delay: f.delay },
                    y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: f.delay },
                  }
            }
          />
        ))}
      </div>

      <div className="hero__content">
        <motion.p
          className="eyebrow hero__eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Estúdio de design &amp; social media
        </motion.p>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Design que faz
          <br />
          marcas serem <span>lembradas</span>.
        </motion.h1>

        <motion.div
          className="hero__foot"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <a className="hero__cta" href="#trabalhos">
            Ver trabalhos
            <ArrowIcon width={16} height={16} />
          </a>
          <p className="hero__wordmark">
            CORDEIRO <span>/</span> LABS
          </p>
        </motion.div>
      </div>
    </section>
  )
}
