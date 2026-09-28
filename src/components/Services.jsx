import Reveal from './Reveal.jsx'
import './Services.css'

const SERVICES = [
  { n: '01', label: 'Social Media' },
  { n: '02', label: 'Design Gráfico' },
  { n: '03', label: 'Identidade Visual' },
  { n: '04', label: 'Conteúdo Digital' },
]

export default function Services() {
  return (
    <section className="section services">
      <Reveal className="eyebrow services__eyebrow">O que fazemos</Reveal>

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
