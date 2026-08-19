import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { Section, Reveal } from './Section'
import PaperVisual from './PaperVisual'
import { papers } from '../data'

const accentBg = {
  lilac: 'bg-lilac-soft text-lilac',
  sky: 'bg-sky-soft text-sky',
  mint: 'bg-mint-soft text-mint',
  peach: 'bg-peach-soft text-peach',
}

function Authors({ authors }) {
  return (
    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
      {authors.split(', ').map((a, i, arr) => (
        <span key={a}>
          <span className={a.startsWith('Harsh') ? 'font-medium text-ink' : undefined}>{a}</span>
          {i < arr.length - 1 && ', '}
        </span>
      ))}
    </p>
  )
}

function Paper({ paper, index }) {
  const [open, setOpen] = useState(false)

  return (
    <Reveal delay={index * 0.06} as="article">
      <div className="grid gap-6 border-t border-line py-8 first:border-t-0 first:pt-1 md:grid-cols-[1fr_340px] md:gap-9">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-[10.5px] tracking-wide ${accentBg[paper.accent]}`}
            >
              {paper.venue}
            </span>
            <span className="eyebrow">{paper.year}</span>
            <span className="eyebrow">{paper.role}</span>
          </div>

          <h3 className="mt-3 font-display text-[19px] font-medium leading-snug tracking-[-0.01em] text-ink sm:text-xl">
            {paper.title}
          </h3>

          <Authors authors={paper.authors} />

          <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">{paper.description}</p>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="mt-4 border-l-2 border-line pl-4 text-[14px] leading-[1.7] text-muted">
                  {paper.detail}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {paper.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            {paper.links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="link inline-flex items-center gap-1 text-[13.5px] text-ink-soft hover:text-ink"
              >
                {l.label}
                <ArrowUpRight size={13} className="opacity-50" />
              </a>
            ))}

            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-1 text-[13.5px] text-muted transition-colors hover:text-ink"
              aria-expanded={open}
            >
              {open ? 'Less' : 'Method'}
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="block"
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>
          </div>
        </div>

        <div className="md:pt-1">
          <PaperVisual id={paper.id} />
        </div>
      </div>
    </Reveal>
  )
}

export default function Research() {
  return (
    <Section id="research" title="Research" note={`${papers.length} papers`}>
      {papers.map((p, i) => (
        <Paper key={p.id} paper={p} index={i} />
      ))}
    </Section>
  )
}
