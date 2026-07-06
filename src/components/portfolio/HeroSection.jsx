import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import NeuralField from './NeuralField';
import DecodeText from './DecodeText';
import MagneticButton from './MagneticButton';
import { PROFILE, SKILLS } from './data';

// Full-viewport thesis: the latent field, the name decoding out of noise, and
// a single line that says what he does. Content parallaxes away on scroll.
export default function HeroSection({ booted }) {
    const { scrollY } = useScroll();
    const contentY = useTransform(scrollY, [0, 600], [0, -160]);
    const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

    const d = booted ? 0 : 1800; // wait for boot wipe before decoding

    return (
        <header id="top" className="relative flex min-h-screen flex-col overflow-hidden">
            <NeuralField />
            {/* readability scrim over the field */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(216_56%_4%/0.85)_100%)]" />

            <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pt-24 text-center"
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (d + 200) / 1000, duration: 0.6 }}
                    className="mb-6 font-mono text-xs tracking-[0.3em] text-ice/80"
                >
                    harsh@lab:~$ whoami
                </motion.p>

                <h1 className="font-display text-[13vw] font-semibold leading-[0.95] tracking-tight text-frost sm:text-7xl md:text-8xl lg:text-9xl">
                    <DecodeText text="HARSH" delay={d + 300} as="span" className="block" />
                    <DecodeText text="KUMAR" delay={d + 700} as="span" className="block text-gradient-ice" />
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (d + 1400) / 1000, duration: 0.7 }}
                    className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
                >
                    {PROFILE.tagline}
                    <span className="mt-2 block font-mono text-sm text-ice/70">
                        {PROFILE.role} · incoming M.S. AI @ Columbia · {PROFILE.location}
                    </span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (d + 1700) / 1000, duration: 0.7 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    <MagneticButton>
                        <a
                            href="#projects"
                            className="group inline-flex items-center gap-2 rounded-full bg-frost px-7 py-3 font-mono text-sm font-semibold text-void transition-colors hover:bg-heat"
                        >
                            see the work
                            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                        </a>
                    </MagneticButton>
                    <MagneticButton>
                        <a
                            href="/Harsh_Resume.pdf"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-ice/25 px-7 py-3 font-mono text-sm text-ice transition-colors hover:border-ember hover:text-heat"
                        >
                            <FileText className="h-4 w-4" />
                            resume
                        </a>
                    </MagneticButton>
                </motion.div>
            </motion.div>

            {/* skills ticker along the fold */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (d + 2000) / 1000, duration: 1 }}
                className="relative z-10 border-t border-ice/10 py-4"
            >
                <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
                    <div className="marquee-track flex shrink-0 items-center">
                        {[...SKILLS, ...SKILLS].map((skill, i) => (
                            <span key={i} className="flex items-center whitespace-nowrap font-mono text-xs text-muted-foreground">
                                <span className="px-4 transition-colors hover:text-heat" data-hot>{skill}</span>
                                <span className="text-ember/60">✦</span>
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </header>
    );
}
