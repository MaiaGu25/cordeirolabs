import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '../data/projects.js'
import Reveal from './Reveal.jsx'
import './Portfolio.css'

export default function Portfolio() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="trabalhos" className="section portfolio">
      <Reveal className="portfolio__head">
        <span className="eyebrow">Trabalhos</span>
        <h2 className="portfolio__title">Uma seleção de peças recentes.</h2>
      </Reveal>

      <motion.div
        className="portfolio__grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          show: {
            transition: reduceMotion
              ? {}
              : { staggerChildren: 0.08, delayChildren: 0.05 },
          },
        }}
      >
        {projects.map((project) => (
          <motion.a
            key={project.id}
            href={project.link}
            className={`portfolio__item portfolio__item--${project.size}`}
            data-size={project.size}
            variants={{
              hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 32 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <div className="portfolio__media">
              <img
                src={project.image}
                alt={`${project.title} — ${project.description}`}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="portfolio__overlay">
              <span className="portfolio__category">{project.category}</span>
              <span className="portfolio__name">{project.title}</span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
