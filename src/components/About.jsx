import Reveal from './Reveal.jsx'
import TextReveal from './TextReveal.jsx'
import './About.css'

export default function About() {
  return (
    <section id="about" className="section about">
      <Reveal as="span" className="eyebrow about__eyebrow">
        About
      </Reveal>

      <TextReveal text="We are Cordeiro Labs." className="about__headline" />
      <TextReveal
        text="An independent design studio creating visual identities and experiences for ambitious brands."
        className="about__body"
      />
    </section>
  )
}
