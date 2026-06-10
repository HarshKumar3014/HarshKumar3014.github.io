import { motion } from 'framer-motion'

export function SectionHeading({ index, title }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="mb-12 font-display text-3xl font-bold text-white sm:text-4xl"
    >
      <span className="mr-3 font-mono text-xl text-violet-400 sm:text-2xl">
        {index}.
      </span>
      <span className="text-gradient">{title}</span>
    </motion.h2>
  )
}

export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
