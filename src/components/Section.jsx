import { motion } from 'framer-motion'

export function SectionHeading({ title, note }) {
  return (
    <Reveal className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <h2 className="font-display text-sm font-medium tracking-[0.18em] uppercase text-ink">
        {title}
      </h2>
      {note && <span className="eyebrow shrink-0">{note}</span>}
    </Reveal>
  )
}

export function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  )
}

export function Section({ id, title, note, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-20 py-12 ${className}`}>
      <SectionHeading title={title} note={note} />
      {children}
    </section>
  )
}
