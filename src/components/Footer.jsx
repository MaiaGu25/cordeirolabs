import { contact } from '../data/contact.js'
import { InstagramIcon, MailIcon } from './Icons.jsx'
import './Footer.css'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bar">
        <div className="footer__brand">
          <p className="footer__mark">
            CORDEIRO LABS<span className="mark-reg">®</span>
          </p>
          <p className="footer__tagline">Independent Design Studio</p>
        </div>

        <div className="footer__social">
          <a href={contact.instagram.href} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon width={18} height={18} />
          </a>
          <a href={contact.email.href} aria-label="Email">
            <MailIcon width={18} height={18} />
          </a>
        </div>
      </div>

      <p className="footer__copy">© {year} CORDEIRO LABS. ALL RIGHTS RESERVED.</p>
    </footer>
  )
}
