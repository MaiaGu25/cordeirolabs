import { useSiteSettings } from '../hooks/useSiteSettings.js'
import Reveal from './Reveal.jsx'
import GlassButton from './GlassButton.jsx'
import { ArrowIcon, InstagramIcon, MailIcon, WhatsappIcon } from './Icons.jsx'
import './Contact.css'

const ICONS = {
  email: MailIcon,
  phone: WhatsappIcon,
  instagram: InstagramIcon,
}

export default function Contact() {
  const contact = useSiteSettings()
  const channels = [contact.email, contact.phone, contact.instagram]

  return (
    <section id="contact" className="section contact">
      <Reveal className="contact__intro">
        <span className="eyebrow">Contact</span>
        <h2 className="contact__title">Let's build something worth remembering.</h2>
        <GlassButton href={contact.email.href} symbol="↗" className="contact__cta">
          Start a Project
        </GlassButton>
      </Reveal>

      <div className="contact__cards">
        {channels.map((channel, i) => {
          const Icon = ICONS[channel.key]
          return (
            <Reveal
              as="a"
              key={channel.key}
              delay={i * 0.08}
              href={channel.href}
              target={channel.key === 'email' ? undefined : '_blank'}
              rel={channel.key === 'email' ? undefined : 'noreferrer'}
              className="contact-card"
            >
              <span className="contact-card__index">{`0${i + 1}`}</span>
              <span className="contact-card__icon">
                <Icon width={18} height={18} />
              </span>
              <span className="contact-card__body">
                <span className="contact-card__label">{channel.label}</span>
                <span className="contact-card__value">
                  {channel.value}
                  <ArrowIcon width={15} height={15} />
                </span>
              </span>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
