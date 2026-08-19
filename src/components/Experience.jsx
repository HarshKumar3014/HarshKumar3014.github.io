import { motion } from 'framer-motion'
import { Section, Reveal } from './Section'
import { timeline, awards } from '../data'

export default function Experience() {
  return (
    <Section id="experience" title="Experience & Education">
      <div className="relative">
        {/* spine */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute left-[3.5px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-line sm:left-[139px]"
          aria-hidden="true"
        />

        <ol className="space-y-7">
          {timeline.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05} as="li">
              <div className="relative grid gap-1 pl-7 sm:grid-cols-[124px_1fr] sm:gap-8 sm:pl-0">
                <p className="eyebrow sm:pt-1 sm:text-right">{item.period}</p>

                <span
                  className={`absolute left-0 top-[6px] h-2 w-2 rounded-full ring-4 ring-bg sm:left-[136px] ${
                    item.kind === 'education' ? 'bg-lilac' : 'bg-mint'
                  }`}
                  aria-hidden="true"
                />

                <div className="sm:pl-7">
                  <h3 className="font-display text-[16px] font-medium leading-snug text-ink">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-muted">{item.org}</p>
                  <p className="mt-1.5 text-[14px] leading-[1.68] text-ink-soft">{item.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal delay={0.1} className="mt-8 border-t border-line pt-5">
        <div className="grid gap-2 sm:grid-cols-[124px_1fr] sm:gap-8">
          <p className="eyebrow sm:pt-0.5 sm:text-right">Awards</p>
          <ul className="space-y-1.5 sm:pl-7">
            {awards.map((a) => (
              <li key={a} className="text-[14px] text-ink-soft">
                <span className="mr-2 text-faint">—</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
