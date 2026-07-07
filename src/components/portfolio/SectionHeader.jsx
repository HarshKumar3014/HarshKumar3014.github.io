import { motion } from 'framer-motion';
import accentify from './accents';

// Lab-instrument section header: mono address eyebrow + display title that
// rises out of a clipped container and "ignites" (variable weight 320 → 600)
// on scroll, with a giant hollow index numeral ghosted behind.
// Note: whileInView lives on the untransformed wrapper — a child translated
// outside an overflow-hidden parent never intersects, so it would never fire.
export default function SectionHeader({ address, title, description, index }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative mb-14 md:mb-20"
        >
            {index && (
                <motion.span
                    aria-hidden
                    variants={{ hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-hollow-faint pointer-events-none absolute -top-12 right-0 select-none font-display text-[8rem] font-semibold leading-none sm:text-[11rem] md:-top-20 md:text-[15rem]"
                >
                    {index}
                </motion.span>
            )}
            <motion.p
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.5 }}
                className="relative mb-4 font-mono text-xs tracking-[0.25em] text-ice/80"
            >
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
                {address}
            </motion.p>
            <div className="relative overflow-hidden">
                <motion.h2
                    variants={{
                        hidden: { y: '110%', fontVariationSettings: "'wght' 320" },
                        visible: { y: 0, fontVariationSettings: "'wght' 600" },
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                        fontVariationSettings: { duration: 1.8, delay: 0.3 },
                    }}
                    className="pb-[0.12em] font-display text-4xl font-semibold leading-[1.05] tracking-tight text-frost sm:text-5xl md:text-6xl"
                >
                    {accentify(title)}
                </motion.h2>
            </div>
            {description && (
                <motion.p
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="relative mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
                >
                    {accentify(description, 'soft')}
                </motion.p>
            )}
        </motion.div>
    );
}
