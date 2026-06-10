import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import { SectionHeading, Reveal } from './Section'
import { projects } from '../data'

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="absolute left-0 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" aria-hidden="true" />
      <SectionHeading index="03" title="Projects" />

      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.12}>
            <motion.article
              whileHover={{ y: -8, rotate: i % 2 === 0 ? -0.5 : 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="glass glass-hover group flex h-full flex-col rounded-3xl p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 inline-block">
                  {p.emoji}
                </span>
                <div className="flex gap-3">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub repo"
                      className="text-gray-500 transition-colors hover:text-cyan-300"
                    >
                      <GithubIcon size={18} />
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Live demo"
                      className="text-gray-500 transition-colors hover:text-cyan-300"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-cyan-200">
                {p.title}
              </h3>
              <p className="font-mono text-xs text-violet-300">{p.subtitle}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{p.blurb}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-10 text-center">
        <a
          href="https://github.com/HarshKumar3014"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 font-mono text-sm text-gray-500 transition-colors hover:text-cyan-300"
        >
          <span className="text-violet-400">+</span> many more on GitHub
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </Reveal>
    </section>
  )
}
