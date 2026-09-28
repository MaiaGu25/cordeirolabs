import { contact } from '../data/contact.js'
import Reveal from './Reveal.jsx'
import { ArrowIcon, InstagramIcon, MailIcon, WhatsappIcon } from './Icons.jsx'
import './Contact.css'

const CHANNELS = [
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon, data: contact.instagram },
  { key: 'whatsapp', label: 'WhatsApp', Icon: WhatsappIcon, data: contact.whatsapp },
  { key: 'email', label: 'E-mail', Icon: MailIcon, data: contact.email },
]

export default function Contact() {
  return (
    <section id="contato" className="section contact">
      <Reveal>
        <h2 className="contact__title">
          Vamos criar
          <br />
          algo <span>juntos</span>?
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="contact__channels">
        {CHANNELS.map(({ key, label, Icon, data }) => (
          <a key={key} className="contact__channel" href={data.href} target="_blank" rel="noreferrer">
            <span className="contact__channel-head">
              <Icon width={18} height={18} />
              {label}
            </span>
            <span className="contact__channel-value">
              {data.label}
              <ArrowIcon width={16} height={16} />
            </span>
          </a>
        ))}
      </Reveal>
    </section>
  )
}
