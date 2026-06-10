import { motion } from 'framer-motion'
import { GraduationCap, FlaskConical, MapPin } from 'lucide-react'
import { SectionHeading, Reveal } from './Section'

const facts = [
  {
    icon: GraduationCap,
    title: 'Incoming MS AI @ Columbia',
    body: 'Heading to NYC in Fall 2026 for a Master’s in Artificial Intelligence at Columbia University.',
  },
  {
    icon: FlaskConical,
    title: 'LLM Research',
    body: 'Two papers in: one on poisoning LLM pretraining (PermaFrost-Attack), one on machine time perception (Chronocept).',
  },
  {
    icon: MapPin,
    title: 'B.Tech CS @ MUJ ’26',
    body: 'Finishing undergrad in Computer Science at Manipal University Jaipur.',
  },
]

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading index="01" title="About" />

      <div className="grid gap-12 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <div className="space-y-5 text-lg leading-relaxed text-gray-300">
            <p>
              I'm an AI researcher interested in{' '}
              <span className="text-cyan-300">LLMs and world models</span> — not
              just whether models work, but what they actually represent, how
              those representations break, and what the breakage looks like from
              the inside.
            </p>
            <p>
              My recent work spans two ends of that question:{' '}
              <span className="text-violet-300">adversarial</span> (planting
              dormant backdoors in pretraining corpora and building geometric
              tools to detect them) and{' '}
              <span className="text-fuchsia-300">cognitive</span> (teaching
              machines to reason about when facts stop being true).
            </p>
            <p>
              When I'm not staring at loss curves, I'm probably building
              something that has no business existing yet.
            </p>
          </div>
        </Reveal>

        <div className="space-y-4 md:col-span-2">
          {facts.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ x: 6 }}
                className="glass glass-hover flex items-start gap-4 rounded-2xl p-5"
              >
                <f.icon className="mt-1 shrink-0 text-cyan-300" size={22} />
                <div>
                  <h3 className="font-display font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">{f.body}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
