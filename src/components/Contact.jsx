import { motion } from 'framer-motion'
import { Mail, GraduationCap } from 'lucide-react'
import { GithubIcon, LinkedinIcon, XIcon } from './BrandIcons'
import { SectionHeading, Reveal } from './Section'
import { profile } from '../data'

const socials = [
  { icon: GithubIcon, label: 'GitHub', url: profile.socials.github },
  { icon: LinkedinIcon, label: 'LinkedIn', url: profile.socials.linkedin },
  { icon: XIcon, label: 'X / Twitter', url: profile.socials.x },
  { icon: GraduationCap, label: 'Scholar', url: profile.socials.scholar },
]

export default function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-4xl px-6 py-28 text-center">
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[130px]" aria-hidden="true" />
      <SectionHeading index="06" title="Get in touch" />

      <Reveal>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-300">
          Open to research collaborations, interesting problems, and good
          conversations about why models do weird things.
        </p>

        <motion.a
          href={`mailto:${profile.email}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="glow-border mt-10 inline-flex items-center gap-3 rounded-full bg-violet-600/20 px-8 py-4 font-mono text-base text-white transition-shadow hover:shadow-[0_0_40px_rgba(124,58,237,0.4)]"
        >
          <Mail size={18} />
          {profile.email}
        </motion.a>

        <div className="mt-12 flex items-center justify-center gap-6">
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -5, scale: 1.15 }}
              className="glass glass-hover rounded-2xl p-4 text-gray-400 hover:text-cyan-300"
            >
              <s.icon size={22} />
            </motion.a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
