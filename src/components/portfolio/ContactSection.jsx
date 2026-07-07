import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Copy, Check, Github, Linkedin, GraduationCap } from 'lucide-react';

// lucide has no X brand mark — official X logo path, inherits currentColor
function XLogo({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
import KineticText from './KineticText';
import MagneticButton from './MagneticButton';
import { PROFILE } from './data';
import useReducedMotion from './useReducedMotion';

export default function ContactSection() {
    const [copied, setCopied] = useState(false);
    const reduced = useReducedMotion();

    const copyEmail = async (e) => {
        await navigator.clipboard.writeText(PROFILE.email);
        setCopied(true);
        if (!reduced) {
            // ember sparks from the click point
            const rect = e.currentTarget.getBoundingClientRect();
            confetti({
                particleCount: 42,
                spread: 70,
                startVelocity: 24,
                gravity: 0.7,
                scalar: 0.7,
                ticks: 120,
                colors: ['#FF5C2E', '#FFAE45', '#7DE0FF'],
                origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight,
                },
            });
        }
        setTimeout(() => setCopied(false), 2200);
    };

    return (
        <section id="contact" className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-6 text-center font-mono text-xs tracking-[0.3em] text-ice/80"
            >
                axis://contact — channel open
            </motion.p>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="overflow-hidden text-center"
            >
                <motion.h2
                    variants={{ hidden: { y: '100%' }, visible: { y: 0 } }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="pb-[0.12em] font-display text-5xl font-semibold tracking-tight text-frost sm:text-6xl md:text-7xl"
                >
                    <KineticText text="Let's build something" />
                    <span className="block" data-hot>
                        <span className="thermal-text">that</span> <em className="serif-accent">thinks.</em>
                    </span>
                </motion.h2>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mx-auto mt-6 max-w-md text-center text-muted-foreground"
            >
                Open to research collaborations, agentic AI work, and interesting problems.
                New York — Columbia, Fall 2026.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-12 flex flex-col items-center gap-6"
            >
                <MagneticButton strength={0.25}>
                    <button
                        onClick={copyEmail}
                        className="group inline-flex items-center gap-3 rounded-full border border-ice/25 bg-abyss/60 px-8 py-4 font-mono text-base text-frost backdrop-blur-sm transition-colors duration-300 hover:border-ember hover:text-heat md:text-lg"
                    >
                        {PROFILE.email}
                        {copied ? (
                            <Check className="h-4 w-4 text-heat" />
                        ) : (
                            <Copy className="h-4 w-4 text-ice/60 transition-colors group-hover:text-heat" />
                        )}
                    </button>
                </MagneticButton>
                <p className="font-mono text-[11px] tracking-widest text-muted-foreground/70">
                    {copied ? '✓ copied to clipboard' : 'click to copy'}
                </p>

                <div className="mt-2 flex items-center gap-4">
                    {[
                        { href: PROFILE.github, label: 'GitHub', Icon: Github },
                        { href: PROFILE.linkedin, label: 'LinkedIn', Icon: Linkedin },
                        { href: PROFILE.twitter, label: 'X (Twitter)', Icon: XLogo },
                        { href: PROFILE.scholar, label: 'Google Scholar', Icon: GraduationCap },
                    ].map(({ href, label, Icon }) => (
                        <MagneticButton key={label}>
                            <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={label}
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-ice/20 text-ice/80 transition-colors duration-300 hover:border-ember hover:text-heat"
                            >
                                <Icon className="h-5 w-5" />
                            </a>
                        </MagneticButton>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
