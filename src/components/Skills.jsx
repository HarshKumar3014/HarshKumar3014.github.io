import { SectionHeading, Reveal } from './Section'
import { skills } from '../data'

function MarqueeRow({ items, reverse = false }) {
  const doubled = [...items, ...items]
  return (
    <div className="relative flex overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
      <div
        className="flex shrink-0 gap-4 animate-marquee"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {doubled.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="glass whitespace-nowrap rounded-full px-5 py-2.5 font-mono text-sm text-gray-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const half = Math.ceil(skills.length / 2)
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading index="04" title="Toolbox" />
      <Reveal>
        <MarqueeRow items={skills.slice(0, half)} />
        <MarqueeRow items={skills.slice(half)} reverse />
      </Reveal>
    </section>
  )
}
