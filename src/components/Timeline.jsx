import { motion } from 'framer-motion'
import { SectionHeading } from './Section'
import { timeline } from '../data'

export default function Timeline() {
  return (
    <section id="journey" className="relative mx-auto max-w-5xl px-6 py-28">
      <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[100px]" aria-hidden="true" />
      <SectionHeading index="05" title="Journey" />

      <div className="relative">
        {/* center spine */}
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-violet-500/60 via-cyan-400/40 to-transparent md:left-1/2" aria-hidden="true" />

        <div className="space-y-12">
          {timeline.map((item, i) => {
            const left = item.side === 'left'
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: left ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`relative flex md:w-1/2 ${
                  left ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                } pl-12 md:pl-12 ${left ? 'md:pl-0' : ''}`}
              >
                {/* node dot */}
                <span
                  className={`absolute top-2 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] left-2.5 ${
                    left ? 'md:left-auto md:-right-1.5' : 'md:-left-1.5'
                  }`}
                  aria-hidden="true"
                />

                <div className="glass glass-hover w-full rounded-2xl p-6">
                  <span className="font-mono text-xs font-semibold text-violet-300">
                    {item.year}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-cyan-300/80">{item.org}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.detail}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
