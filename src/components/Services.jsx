import Reveal from './Reveal.jsx'
import './Services.css'

const SERVICES = [
  { n: '01', label: 'Brand Identity' },
  { n: '02', label: 'Social Media' },
  { n: '03', label: 'Event Design' },
]

export default function Services() {
  return (
    <section id="services" className="section services">
      <Reveal className="eyebrow services__eyebrow">Services</Reveal>

      <ul className="services__list">
        {SERVICES.map((service, i) => (
          <Reveal as="li" key={service.n} delay={i * 0.06} className="services__item">
            <span className="services__index">{service.n}</span>
            <span className="services__label">{service.label}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
