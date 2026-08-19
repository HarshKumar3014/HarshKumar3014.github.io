import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon, ScholarIcon, XIcon } from './BrandIcons'
import { Section, Reveal } from './Section'
import { profile } from '../data'

const socials = [
  { label: 'GitHub', url: profile.socials.github, Icon: GithubIcon },
  { label: 'Scholar', url: profile.socials.scholar, Icon: ScholarIcon },
  { label: 'LinkedIn', url: profile.socials.linkedin, Icon: LinkedinIcon },
  { label: 'X', url: profile.socials.x, Icon: XIcon },
]

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <Reveal>
        <p className="max-w-prose text-[15.5px] leading-[1.75] text-ink-soft">
          Open to research collaborations and conversations about reasoning,
          evaluation, and where language models quietly fail. The fastest way to
          reach me is email.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <motion.a
            href={`mailto:${profile.email}`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-panel px-5 py-2.5 font-mono text-[13px] text-ink transition-colors hover:border-lilac hover:bg-lilac-soft"
          >
            {profile.email}
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
          <span className="font-mono text-[12.5px] text-faint">{profile.altEmail}</span>
        </div>

        <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5">
          {socials.map(({ label, url, Icon }) => (
            <li key={label}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="link inline-flex items-center gap-1.5 text-[13.5px] text-ink-soft hover:text-ink"
              >
                <Icon size={14} />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
