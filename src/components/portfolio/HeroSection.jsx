import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import NeuralField from './NeuralField';
import KineticText from './KineticText';
import MagneticButton from './MagneticButton';
import accentify from './accents';
import { PROFILE, SKILLS } from './data';

// Full-viewport thesis: the latent field, the name decoding out of noise, and
// a single line that says what he does. Content parallaxes away on scroll.
export default function HeroSection({ booted, mode, onMode }) {
    const { scrollY } = useScroll();
    const contentY = useTransform(scrollY, [0, 600], [0, -160]);
    const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

    const d = booted ? 0 : 1800; // wait for boot wipe before decoding
    const researcher = mode === 'researcher';

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
                    <KineticText text="HARSH" decode delay={d + 300} className="block" />
                    <KineticText text="KUMAR" decode delay={d + 700} className="block text-gradient-ice" />
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (d + 1400) / 1000, duration: 0.7 }}
                    className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
                >
                    {accentify(PROFILE.tagline, 'soft')}
                    <span className="mt-2 block font-mono text-sm text-ice/70">
                        {PROFILE.role} · incoming M.S. AI @ Columbia · {PROFILE.location}
                    </span>
                </motion.p>

                {/* persona switch: the page rearranges itself around who's reading */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (d + 1550) / 1000, duration: 0.6 }}
                    className="mt-9 flex flex-wrap items-center justify-center gap-3 font-mono text-xs"
                >
                    <span className="tracking-[0.2em] text-muted-foreground">run_as:</span>
                    {['developer', 'researcher'].map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => onMode(m)}
                            aria-pressed={mode === m}
                            className={`rounded-full border px-4 py-1.5 transition-all duration-300 ${
                                mode === m
                                    ? 'border-ember bg-ember/15 text-heat shadow-[0_0_18px_hsl(14_100%_59%/0.3)]'
                                    : 'border-ice/25 text-ice/80 hover:border-ice/60 hover:text-ice'
                            }`}
                            data-hot
                        >
                            {m}
                        </button>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (d + 1700) / 1000, duration: 0.7 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                    <MagneticButton>
                        <a
                            href={researcher ? '#research' : '#projects'}
                            className="group inline-flex items-center gap-2 rounded-full bg-frost px-7 py-3 font-mono text-sm font-semibold text-void transition-colors hover:bg-heat"
                        >
                            {researcher ? 'read the research' : 'see the work'}
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
                                <span
                                    className={`px-4 transition-colors hover:text-heat ${
                                        i % SKILLS.length % 4 === 3 ? 'font-serif text-sm italic text-heat/70' : ''
                                    }`}
                                    data-hot
                                >
                                    {skill}
                                </span>
                                <span className="text-ember/60">✦</span>
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </header>
    );
}
