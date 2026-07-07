import { useRef } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import SectionHeader from './SectionHeader';
import KineticText from './KineticText';
import { EXPERIENCE, PROFILE } from './data';

function TimelineEntry({ item, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-25% 0px -25% 0px' });

    return (
        <div ref={ref} className="relative pl-10 md:pl-16">
            {/* node ignites when the scroll line reaches it */}
            <span
                className={`absolute left-[-5px] top-2 h-[11px] w-[11px] rounded-full border transition-all duration-700 md:left-[-5px] ${
                    inView
                        ? 'border-ember bg-ember shadow-[0_0_16px_hsl(14_100%_59%/0.6)]'
                        : 'border-ice/40 bg-void'
                }`}
            />
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
                <p className="font-mono text-xs tracking-widest text-heat">{item.period}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-frost md:text-3xl">
                    <KineticText text={item.company} />
                </h3>
                <p className="mt-0.5 font-mono text-sm text-ice/70">{item.role}</p>
                <ul className="mt-4 max-w-2xl space-y-2.5">
                    {item.points.map((point, i) => (
                        <motion.li
                            key={point}
                            initial={{ opacity: 0, y: 12 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                            className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                        >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ice/60" />
                            {point}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
}

// The career as a temporal axis (a Chronocept joke that reads as a timeline):
// an ice line that heats to ember as the reader scrolls through it.
export default function ExperienceSection() {
    const lineRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 0.7', 'end 0.5'] });
    const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

    return (
        <section id="experience" className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
            <SectionHeader
                address="axis://log-time"
                index="03"
                title="Where I've *worked*"
                description="Three internships, each one closer to the metal of production AI."
            />
            <div ref={lineRef} className="relative">
                {/* cold axis */}
                <span className="absolute bottom-0 left-0 top-0 w-px bg-ice/15" />
                {/* heated portion grows with scroll */}
                <motion.span
                    style={{ scaleY }}
                    className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-ice via-heat to-ember"
                />
                <div className="space-y-20 py-2 md:space-y-24">
                    {EXPERIENCE.map((item, i) => (
                        <TimelineEntry key={item.company} item={item} index={i} />
                    ))}
                </div>
            </div>

            {/* education strip */}
            <div className="mt-24 grid gap-4 md:grid-cols-2">
                {PROFILE.education.map((edu, i) => (
                    <motion.div
                        key={edu.school}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: i * 0.12 }}
                        className={`instrument rounded-lg border p-6 backdrop-blur-sm ${
                            edu.highlight
                                ? 'border-heat/30 bg-gradient-to-br from-ember/10 to-transparent'
                                : 'border-ice/10 bg-abyss/60'
                        }`}
                    >
                        <p className="font-mono text-[11px] tracking-[0.2em] text-ice/70">
                            {edu.highlight ? 'next://' : 'edu://'}{edu.school.toLowerCase().split(' ')[0]}
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-frost">
                            <KineticText text={edu.school} />
                        </h3>
                        <p className="mt-1 text-sm text-frost/85">{edu.degree}</p>
                        <p className="mt-2 font-mono text-xs text-muted-foreground">
                            {edu.period}
                            {edu.detail && <span className="ml-3">{edu.detail}</span>}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
