import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText } from 'lucide-react';
import KineticText from '../portfolio/KineticText';
import MagneticButton from '../portfolio/MagneticButton';
import accentify from '../portfolio/accents';
import { PROFILE } from '../portfolio/data';
import { SCENES } from './scenes';

// Scene 01 — the signal. The name IS the particle field; DOM only carries
// the terminal eyebrow, tagline and the invitation to descend.
export default function SceneGenesis() {
    const ref = useRef(null);
    const d = 1800; // boot wipe finishes before the decode starts
    const { scrollYProgress: sp } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    const introOpacity = useTransform(sp, [0, 0.5, 0.72], [1, 1, 0]);
    const introY = useTransform(sp, [0.45, 0.72], [0, -90]);
    const hintOpacity = useTransform(sp, [0, 0.12], [1, 0]);
    const taglineOpacity = useTransform(sp, [0.06, 0.2], [0, 1]);

    return (
        <section ref={ref} id="scene-signal" style={{ height: `${SCENES[0].vh}vh` }} className="relative">
            <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
                <motion.div
                    style={{ opacity: introOpacity, y: introY }}
                    className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 text-center"
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-[16vh] font-mono text-xs tracking-[0.3em] text-ice/80"
                    >
                        harsh@lab:~$ whoami
                    </motion.p>

                    {/* the particles render the name; keep it for screen readers */}
                    <h1 className="sr-only">{PROFILE.name} — {PROFILE.role}</h1>

                    {/* desktop: the particle field IS the name; small screens
                        don't have the pixels for it, so type carries it there */}
                    <div className="flex flex-1 items-center justify-center md:hidden" aria-hidden>
                        <div className="font-display text-6xl font-semibold leading-[0.95] tracking-tight text-frost">
                            <KineticText text="HARSH" decode delay={d + 300} className="block" />
                            <KineticText text="KUMAR" decode delay={d + 700} className="block text-gradient-ice" />
                        </div>
                    </div>
                    <div className="hidden flex-1 md:block" />

                    <motion.div style={{ opacity: taglineOpacity }} className="mb-[13vh]">
                        <p className="mx-auto max-w-2xl text-lg text-frost/90 md:text-xl">
                            {accentify(PROFILE.tagline, 'soft')}
                        </p>
                        <p className="mt-3 font-mono text-sm text-ice/70">
                            {PROFILE.role} · incoming M.S. AI @ Columbia · {PROFILE.location}
                        </p>
                        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                            <MagneticButton>
                                <a
                                    href="/Harsh_Resume.pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-ice/25 px-6 py-2.5 font-mono text-sm text-ice transition-colors hover:border-ember hover:text-heat"
                                >
                                    <FileText className="h-4 w-4" />
                                    resume
                                </a>
                            </MagneticButton>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    style={{ opacity: hintOpacity }}
                    className="absolute inset-x-0 bottom-6 z-10 flex justify-center"
                >
                    <p className="animate-bounce font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
                        scroll to descend ↓
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
