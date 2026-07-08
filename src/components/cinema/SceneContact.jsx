import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Copy, Check, Github, Linkedin, GraduationCap } from 'lucide-react';
import KineticText from '../portfolio/KineticText';
import MagneticButton from '../portfolio/MagneticButton';
import useReducedMotion from '../portfolio/useReducedMotion';
import { PROFILE, SKILLS } from '../portfolio/data';
import { SCENES } from './scenes';

function XLogo(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

// Scene 05 — collapse. The whole field falls into a single ember; what's
// left is the invitation.
export default function SceneContact() {
    const ref = useRef(null);
    const [copied, setCopied] = useState(false);
    const reduced = useReducedMotion();
    const btnRef = useRef(null);
    const { scrollYProgress: sp } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    const opacity = useTransform(sp, [0.2, 0.55], [0, 1]);
    const y = useTransform(sp, [0.2, 0.55], [60, 0]);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(PROFILE.email);
        } catch {
            return;
        }
        setCopied(true);
        if (!reduced && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
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

    const socials = [
        { href: PROFILE.github, label: 'GitHub', Icon: Github },
        { href: PROFILE.linkedin, label: 'LinkedIn', Icon: Linkedin },
        { href: PROFILE.twitter, label: 'X', Icon: XLogo },
        { href: PROFILE.scholar, label: 'Google Scholar', Icon: GraduationCap },
    ];

    return (
        <section ref={ref} id="scene-contact" style={{ height: `${SCENES[4].vh}vh` }} className="relative">
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
                <motion.div style={{ opacity, y }} className="relative z-10 text-center">
                    <p className="font-mono text-xs tracking-[0.3em] text-ice/80">
                        scene://05 — channel open
                    </p>
                    <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-frost sm:text-5xl md:text-6xl">
                        <KineticText text="Let's build something" />
                        <span className="block pb-[0.12em]" data-hot>
                            <span className="thermal-text">that</span> <em className="serif-accent">thinks.</em>
                        </span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground md:text-base">
                        Open to research collaborations, agentic AI work, and interesting problems.
                        New York — Columbia, Fall 2026.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <MagneticButton>
                            <button
                                ref={btnRef}
                                type="button"
                                onClick={copyEmail}
                                className="group inline-flex items-center gap-3 rounded-full border border-ice/25 bg-abyss/70 px-7 py-3.5 font-mono text-sm text-frost backdrop-blur-md transition-colors hover:border-ember"
                                data-hot
                            >
                                {PROFILE.email}
                                {copied ? (
                                    <Check className="h-4 w-4 text-heat" />
                                ) : (
                                    <Copy className="h-4 w-4 text-ice/70 transition-colors group-hover:text-heat" />
                                )}
                            </button>
                        </MagneticButton>
                    </div>
                    <p className="mt-2 font-mono text-[10px] tracking-widest text-muted-foreground/70">
                        {copied ? 'copied — talk soon' : 'click to copy'}
                    </p>

                    <div className="mt-8 flex justify-center gap-3">
                        {socials.map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={label}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-ice/20 text-ice/70 transition-all duration-300 hover:border-ember hover:text-heat hover:shadow-[0_0_18px_hsl(14_100%_59%/0.3)]"
                                data-hot
                            >
                                <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                            </a>
                        ))}
                    </div>

                    <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-3 gap-y-1.5">
                        {SKILLS.slice(0, 14).map((s, i) => (
                            <span
                                key={s}
                                className={`font-mono text-[10px] ${
                                    i % 4 === 3 ? 'font-serif text-[12px] italic text-heat/60' : 'text-muted-foreground/60'
                                }`}
                            >
                                {s}
                            </span>
                        ))}
                    </div>

                    <p className="mt-10 font-mono text-[11px] text-muted-foreground/60">
                        © 2026 Harsh Kumar · <span className="caret">harsh@lab:~$ logout</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
