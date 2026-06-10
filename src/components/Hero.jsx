import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, FileDown } from 'lucide-react'
import { profile } from '../data'

function useTypewriter(words, typeSpeed = 70, deleteSpeed = 35, pause = 1800) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    let timeout

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? deleteSpeed : typeSpeed,
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause])

  return text
}

export default function Hero() {
  const typed = useTypewriter(profile.taglines)

  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />

      {/* gradient blobs */}
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px] animate-float" aria-hidden="true" />
      <div className="absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px] animate-float-slow" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[100px] animate-float" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4 font-mono text-sm text-cyan-300"
        >
          {'>'} hello, world. i am
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-display text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl"
        >
          Harsh <span className="text-gradient">Kumar</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 h-8 font-mono text-lg text-gray-300 sm:text-xl"
        >
          <span>{typed}</span>
          <span className="ml-0.5 inline-block w-3 animate-blink text-cyan-300">▍</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400"
        >
          I study how language models build internal models of the world — and
          where those models break: poisoning their pretraining, probing their
          sense of time, mapping the geometry of what happens inside.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#research"
            className="glow-border rounded-full bg-violet-600/20 px-7 py-3 font-mono text-sm font-medium text-white transition-all hover:bg-violet-600/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
          >
            ./view_research
          </a>
          <a
            href={profile.resumeUrl}
            className="glass glass-hover flex items-center gap-2 rounded-full px-7 py-3 font-mono text-sm text-gray-300"
          >
            <FileDown size={16} /> resume.pdf
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, duration: 1.6, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-cyan-300"
        aria-label="Scroll down"
      >
        <ArrowDown size={22} />
      </motion.a>
    </section>
  )
}
