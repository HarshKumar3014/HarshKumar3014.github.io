import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import { Section, Reveal } from './Section'
import ProjectVisual from './ProjectVisual'
import { projects } from '../data'

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06} className="h-full">
            <motion.article
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              className="card flex h-full flex-col p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-[16.5px] font-medium tracking-[-0.01em] text-ink">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-muted">{p.subtitle}</p>
                </div>
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.title} on GitHub`}
                    className="shrink-0 text-faint transition-colors hover:text-ink"
                  >
                    <GithubIcon size={17} />
                  </a>
                )}
              </div>

              <div className="mt-3 overflow-hidden rounded-lg border border-line bg-panel px-2 py-1.5">
                <ProjectVisual name={p.title} />
              </div>

              <p className="mt-3 flex-1 text-[14px] leading-[1.65] text-ink-soft">{p.blurb}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-md bg-panel px-2 py-0.5 font-mono text-[11px] text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </motion.article>
          </Reveal>
        ))}

        <Reveal delay={0.18} className="h-full">
          <a
            href="https://github.com/HarshKumar3014"
            target="_blank"
            rel="noreferrer"
            className="card group flex h-full flex-col justify-center gap-1 border-dashed p-5 text-center"
          >
            <span className="inline-flex items-center justify-center gap-1.5 font-display text-[15px] text-ink-soft transition-colors group-hover:text-ink">
              More on GitHub
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
            <span className="font-mono text-[11.5px] text-faint">smaller experiments and tooling</span>
          </a>
        </Reveal>
      </div>
    </Section>
  )
}
