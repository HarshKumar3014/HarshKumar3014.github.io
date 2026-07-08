import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import KineticText from '../portfolio/KineticText';
import { EXPERIENCE, PROFILE, CREDENTIALS } from '../portfolio/data';
import { SCENES } from './scenes';

function LogEntry({ item, sp, enter, exit }) {
    const opacity = useTransform(sp, [enter, enter + 0.05, exit, exit + 0.05], [0, 1, 1, 0]);
    const scale = useTransform(sp, [enter, enter + 0.07, exit, exit + 0.05], [0.82, 1, 1, 1.1]);
    const y = useTransform(sp, [enter, enter + 0.07], [70, 0]);
    const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? 'auto' : 'none'));

    return (
        <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-6">
            <motion.div
                style={{ opacity, scale, y, pointerEvents }}
                className="instrument mx-auto max-w-2xl rounded-lg border border-ice/15 bg-abyss/75 p-6 backdrop-blur-md md:p-8"
            >
            <p className="font-mono text-xs tracking-widest text-heat">{item.period}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-frost md:text-3xl">
                <KineticText text={item.company} />
            </h3>
            <p className="mt-0.5 font-mono text-sm text-ice/70">{item.role}</p>
            <ul className="mt-4 space-y-2">
                {item.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ice/60" />
                        {point}
                    </li>
                ))}
                </ul>
            </motion.div>
        </div>
    );
}

// Scene 04 — the log at hyperspeed. Roles streak past as the tunnel
// accelerates; the run ends on Columbia and the receipts.
export default function SceneTimeline() {
    const ref = useRef(null);
    const { scrollYProgress: sp } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    const headOpacity = useTransform(sp, [0.01, 0.08, 0.92, 0.98], [0, 1, 1, 0]);
    const finaleOpacity = useTransform(sp, [0.66, 0.74, 0.94, 1], [0, 1, 1, 0]);
    const finaleY = useTransform(sp, [0.66, 0.74], [70, 0]);

    return (
        <section ref={ref} id="scene-log" style={{ height: `${SCENES[3].vh}vh` }} className="relative">
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div style={{ opacity: headOpacity }} className="absolute left-6 top-20 z-10 md:left-12 md:top-24">
                    <p className="font-mono text-xs tracking-[0.25em] text-ice/80">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
                        scene://04 — field log
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-frost md:text-4xl">
                        Where I've <em className="serif-accent">worked</em>
                    </h2>
                </motion.div>

                <div className="relative z-10 h-full">
                    {EXPERIENCE.map((item, i) => (
                        <LogEntry
                            key={item.company}
                            item={item}
                            sp={sp}
                            enter={0.08 + i * 0.19}
                            exit={0.22 + i * 0.19}
                        />
                    ))}

                    {/* finale: education + receipts */}
                    <motion.div
                        style={{ opacity: finaleOpacity, y: finaleY }}
                        className="absolute inset-x-4 top-[45%] mx-auto max-w-3xl sm:inset-x-6"
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            {PROFILE.education.map((edu) => (
                                <div
                                    key={edu.school}
                                    className={`instrument rounded-lg border p-5 backdrop-blur-md ${
                                        edu.highlight
                                            ? 'border-heat/30 bg-gradient-to-br from-ember/10 to-abyss/70'
                                            : 'border-ice/10 bg-abyss/70'
                                    }`}
                                >
                                    <p className="font-mono text-[10px] tracking-[0.2em] text-ice/70">
                                        {edu.highlight ? 'next://' : 'edu://'}{edu.school.toLowerCase().split(' ')[0]}
                                    </p>
                                    <h3 className="mt-2 font-display text-xl font-semibold text-frost">{edu.school}</h3>
                                    <p className="mt-1 text-sm text-frost/85">{edu.degree}</p>
                                    <p className="mt-1.5 font-mono text-xs text-muted-foreground">{edu.period}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                            {CREDENTIALS.map((c) => (
                                <span
                                    key={c.label}
                                    className={`rounded-full border px-3 py-1 font-mono text-[10px] ${
                                        c.kind === 'award'
                                            ? 'border-heat/40 text-heat'
                                            : 'border-ice/20 text-ice/70'
                                    }`}
                                >
                                    {c.label}
                                    {c.tag ? ` ${c.tag}` : ''}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
