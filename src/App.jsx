import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Portfolio from './components/Portfolio.jsx'
import Manifesto from './components/Manifesto.jsx'
import Services from './components/Services.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <Manifesto />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
