import Reveal from './Reveal.jsx'
import './Manifesto.css'

export default function Manifesto() {
  return (
    <section id="sobre" className="section manifesto">
      <Reveal as="p" className="eyebrow manifesto__eyebrow">
        Manifesto
      </Reveal>
      <Reveal delay={0.1} className="manifesto__text">
        Transformamos ideias em <span>experiências visuais</span> que conectam
        marcas e pessoas.
      </Reveal>
    </section>
  )
}
