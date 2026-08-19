import Nav from './components/Nav'
import Intro from './components/Intro'
import Research from './components/Research'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Stack from './components/Stack'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-4xl px-6">
        <main>
          <Intro />
          <Research />
          <Experience />
          <Projects />
          <Stack />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
