import { motion } from 'framer-motion'
import { ExternalLink, FileText } from 'lucide-react'
import { SectionHeading, Reveal } from './Section'
import { papers } from '../data'

export default function Research() {
  return (
    <section id="research" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-violet-600/10 blur-[110px]" aria-hidden="true" />
      <SectionHeading index="02" title="Research" />

      <div className="space-y-8">
        {papers.map((paper, i) => (
          <Reveal key={paper.title} delay={i * 0.15}>
            <motion.article
              whileHover={{ y: -4 }}
              className="glass glass-hover group relative overflow-hidden rounded-3xl p-8 md:p-10"
            >
              <div
                className={`absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${paper.accent} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-25`}
                aria-hidden="true"
              />

              <div className="relative">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full bg-gradient-to-r ${paper.accent} px-3 py-1 font-mono text-xs font-semibold text-black`}
                  >
                    {paper.venueShort}
                  </span>
                  <span className="font-mono text-xs text-gray-500">{paper.year}</span>
                </div>

                <h3 className="font-display text-xl font-bold leading-snug text-white transition-colors group-hover:text-cyan-200 md:text-2xl">
                  {paper.title}
                </h3>

                <p className="mt-2 font-mono text-xs text-gray-500">{paper.authors}</p>

                <p className="mt-4 max-w-3xl leading-relaxed text-gray-300">
                  {paper.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {paper.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 font-mono text-xs text-violet-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  {paper.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 font-mono text-sm text-cyan-300 transition-all hover:gap-2.5 hover:text-cyan-200"
                    >
                      <FileText size={15} />
                      {l.label}
                      <ExternalLink size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
