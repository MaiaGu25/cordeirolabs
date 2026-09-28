import { motion, useReducedMotion } from 'framer-motion'
import { usePublishedProjects } from '../hooks/usePublishedProjects.js'
import Reveal from './Reveal.jsx'
import './Portfolio.css'

export default function Portfolio() {
  const reduceMotion = useReducedMotion()
  const { projects } = usePublishedProjects()

  return (
    <section id="work" className="section portfolio">
      <Reveal className="portfolio__head">
        <span className="eyebrow">Selected Work</span>
        <h2 className="portfolio__title">Identity, content and events — built with intent.</h2>
      </Reveal>

      <motion.div
        className="portfolio__grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          show: {
            transition: reduceMotion ? {} : { staggerChildren: 0.08, delayChildren: 0.05 },
          },
        }}
      >
        {projects.map((project) => (
          <motion.div
            key={project.slug}
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
                src={project.cover}
                alt={`${project.title} — ${project.shortDescription}`}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="portfolio__overlay">
              <div className="portfolio__meta">
                <span className="portfolio__category">{project.category}</span>
                {project.conceptProject && <span className="portfolio__tag">Concept</span>}
              </div>
              <span className="portfolio__name">{project.title}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
