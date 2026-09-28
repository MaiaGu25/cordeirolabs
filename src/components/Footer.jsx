import { contact } from '../data/contact.js'
import { InstagramIcon, MailIcon, WhatsappIcon } from './Icons.jsx'
import './Footer.css'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bar">
        <p className="footer__brand">
          Cordeiro<span>Labs</span>
        </p>
        <p className="footer__copy">© {year} CordeiroLabs. Todos os direitos reservados.</p>
        <div className="footer__social">
          <a href={contact.instagram.href} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon width={18} height={18} />
          </a>
          <a href={contact.whatsapp.href} target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <WhatsappIcon width={18} height={18} />
          </a>
          <a href={contact.email.href} aria-label="E-mail">
            <MailIcon width={18} height={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
