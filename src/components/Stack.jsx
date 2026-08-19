import { Section, Reveal } from './Section'
import { skillGroups } from '../data'

export default function Stack() {
  return (
    <Section id="stack" title="Stack">
      <dl className="space-y-4">
        {skillGroups.map((g, i) => (
          <Reveal key={g.label} delay={i * 0.04}>
            <div className="grid gap-2 sm:grid-cols-[124px_1fr] sm:gap-8">
              <dt className="eyebrow pt-1 sm:text-right">{g.label}</dt>
              <dd className="flex flex-wrap gap-x-2 gap-y-1.5 sm:pl-7">
                {g.items.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-line px-2 py-0.5 font-mono text-[11.5px] text-ink-soft transition-colors hover:border-line-strong hover:bg-panel"
                  >
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
