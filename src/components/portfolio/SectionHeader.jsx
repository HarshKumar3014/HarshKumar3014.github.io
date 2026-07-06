import { motion } from 'framer-motion';

// Lab-instrument section header: mono address eyebrow + display title that
// rises out of a clipped container on scroll.
// Note: whileInView lives on the untransformed wrapper — a child translated
// outside an overflow-hidden parent never intersects, so it would never fire.
export default function SectionHeader({ address, title, description }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mb-14 md:mb-20"
        >
            <motion.p
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.5 }}
                className="mb-4 font-mono text-xs tracking-[0.25em] text-ice/80"
            >
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
                {address}
            </motion.p>
            <div className="overflow-hidden">
                <motion.h2
                    variants={{ hidden: { y: '110%' }, visible: { y: 0 } }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-frost sm:text-5xl md:text-6xl"
                >
                    {title}
                </motion.h2>
            </div>
            {description && (
                <motion.p
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
                >
                    {description}
                </motion.p>
            )}
        </motion.div>
    );
}
