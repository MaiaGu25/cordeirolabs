import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import Portfolio from '../components/Portfolio.jsx'
import Services from '../components/Services.jsx'
import About from '../components/About.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'

export default function PublicSite() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
