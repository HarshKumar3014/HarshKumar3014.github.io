import { motion } from 'framer-motion'
import { FileText, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, ScholarIcon, XIcon } from './BrandIcons'
import { profile } from '../data'
import portrait from '../assets/harsh-columbia.jpg'

const HIDDEN = { opacity: 0, y: 12, filter: 'blur(4px)' }
const SHOWN = { opacity: 1, y: 0, filter: 'blur(0px)' }
const ease = [0.22, 0.61, 0.36, 1]

// staggered entrance without variant propagation — each element owns its delay
const step = (i) => ({
  initial: HIDDEN,
  animate: SHOWN,
  transition: { duration: 0.6, delay: 0.05 + i * 0.07, ease },
})

const links = [
  { label: 'Email', href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'CV', href: profile.resumeUrl, Icon: FileText },
  { label: 'GitHub', href: profile.socials.github, Icon: GithubIcon },
  { label: 'Scholar', href: profile.socials.scholar, Icon: ScholarIcon },
  { label: 'LinkedIn', href: profile.socials.linkedin, Icon: LinkedinIcon },
  { label: 'X', href: profile.socials.x, Icon: XIcon },
]

export default function Intro() {
  return (
    <section id="top" className="relative overflow-hidden pb-6 pt-14 sm:pt-20">
      <div className="dot-field pointer-events-none absolute inset-x-0 -top-24 h-72" aria-hidden="true" />

      <div className="relative grid gap-8 sm:grid-cols-[1fr_216px] sm:gap-10">
        <div>
          <motion.p {...step(0)} className="eyebrow">
            {profile.location}
          </motion.p>

          <motion.h1
            {...step(1)}
            className="mt-2.5 font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl"
          >
            Harsh Kumar
          </motion.h1>

          <motion.p
            {...step(2)}
            className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
            </span>
            {profile.role}
          </motion.p>

          <div className="mt-6 space-y-3.5">
            {profile.bio.map((para, i) => (
              <motion.p
                key={i}
                {...step(3 + i)}
                className="max-w-prose text-[15.5px] leading-[1.72] text-ink-soft"
              >
                {para}
              </motion.p>
            ))}
          </div>

          <motion.ul
            {...step(3 + profile.bio.length)}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5"
          >
            {links.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="link inline-flex items-center gap-1.5 text-[13.5px] text-ink-soft hover:text-ink"
                >
                  <Icon size={14} />
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="group order-first max-w-[216px] sm:order-none sm:pt-1"
        >
          <div className="relative overflow-hidden rounded-2xl border border-line">
            <img
              src={portrait}
              alt="Harsh Kumar on the steps of Low Library at Columbia University"
              width={1280}
              height={960}
              className="aspect-[4/5] w-full object-cover object-[48%_72%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-lilac opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-[0.07]"
              aria-hidden="true"
            />
          </div>
          <figcaption className="mt-2 font-mono text-[10.5px] leading-relaxed text-faint">
            Alma Mater, Low Library — Columbia
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
