import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowUpRight, ArrowRight, Copy, Check, Github, Linkedin, GraduationCap, FileText, X } from 'lucide-react';
import KineticText from '../portfolio/KineticText';
import accentify from '../portfolio/accents';
import useReducedMotion from '../portfolio/useReducedMotion';
import { ChronoceptCurve, PermafrostDetonator } from '../portfolio/ResearchSection';
import { PROFILE, PUBLICATIONS, PROJECTS, EXPERIENCE, CREDENTIALS, SKILLS } from '../portfolio/data';

function XLogo(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function Socials({ size = 18 }) {
    const socials = [
        { href: PROFILE.github, label: 'GitHub', Icon: Github },
        { href: PROFILE.linkedin, label: 'LinkedIn', Icon: Linkedin },
        { href: PROFILE.twitter, label: 'X', Icon: XLogo },
        { href: PROFILE.scholar, label: 'Google Scholar', Icon: GraduationCap },
    ];
    return (
        <div className="flex gap-3">
            {socials.map(({ href, label, Icon }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ice/20 text-ice/70 transition-all duration-300 hover:border-ember hover:text-heat"
                >
                    <Icon style={{ width: size - 2, height: size - 2 }} />
                </a>
            ))}
        </div>
    );
}

export function CorePanel() {
    return (
        <>
            <h2 className="font-display text-4xl font-semibold leading-[0.95] text-frost">
                <KineticText text="HARSH" className="block" />
                <KineticText text="KUMAR" className="block text-gradient-ice" />
            </h2>
            <p className="mt-4 text-frost/90">{accentify(PROFILE.tagline, 'soft')}</p>
            <p className="mt-2 font-mono text-xs text-ice/70">
                {PROFILE.role} · incoming M.S. AI @ Columbia · {PROFILE.location}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                    href="/Harsh_Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-ice/25 px-5 py-2.5 font-mono text-sm text-ice transition-colors hover:border-ember hover:text-heat"
                >
                    <FileText className="h-4 w-4" /> resume
                </a>
                <Socials />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
                {SKILLS.slice(0, 16).map((s, i) => (
                    <span
                        key={s}
                        className={`rounded-full bg-ice/5 px-2.5 py-1 font-mono text-[10px] ${
                            i % 4 === 3 ? 'font-serif text-[12px] italic text-heat/70' : 'text-ice/70'
                        }`}
                    >
                        {s}
                    </span>
                ))}
            </div>
        </>
    );
}

export function ResearchPanel() {
    return (
        <div className="space-y-8">
            {PUBLICATIONS.map((pub) => (
                <article key={pub.id} className="instrument rounded-lg border border-ice/12 bg-void/40 p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="font-mono text-[10px] tracking-[0.2em] text-ice/70">paper://{pub.id}</p>
                        <span
                            className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] tracking-widest ${
                                pub.status === 'ACCEPTED' ? 'border-ice/40 text-ice' : 'border-heat/50 text-heat'
                            }`}
                        >
                            {pub.status} · {pub.venue}
                        </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-frost">
                        <KineticText text={pub.title} />
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{pub.subtitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-frost/85">{accentify(pub.summary, 'soft')}</p>
                    <div className="mt-4">
                        {pub.id === 'chronocept' ? <ChronoceptCurve /> : <PermafrostDetonator />}
                    </div>
                    {pub.link && (
                        <a
                            href={pub.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-ice transition-colors hover:text-heat"
                        >
                            read the paper <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                    )}
                </article>
            ))}
        </div>
    );
}

export function BuildsPanel() {
    return (
        <div className="space-y-6">
            {PROJECTS.map((project) => (
                <article key={project.id} className="instrument group overflow-hidden rounded-lg border border-ice/12 bg-void/40">
                    <div className="relative h-44 overflow-hidden border-b border-ice/10 bg-void/50">
                        <img
                            src={project.image}
                            alt={`${project.name} screenshot`}
                            className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.05] ${
                                project.fit === 'contain' ? 'object-contain' : 'object-cover'
                            }`}
                            loading="lazy"
                        />
                        <div className="absolute bottom-2 left-2 rounded border border-ice/20 bg-void/80 px-2.5 py-1 backdrop-blur-md">
                            <p className="font-serif text-lg font-medium italic text-heat">{project.stat.value}</p>
                            <p className="font-mono text-[8px] tracking-widest text-muted-foreground">{project.stat.label}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="thermal-text inline-block font-display text-xl font-semibold" data-hot>
                            <KineticText text={project.name} />
                        </h3>
                        <p className="font-mono text-[11px] text-muted-foreground">{project.kicker}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-frost/80">{project.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.stack.slice(0, 5).map((tech) => (
                                <span key={tech} className="rounded-full bg-ice/5 px-2 py-0.5 font-mono text-[9px] text-ice/70">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </article>
            ))}
            <Link
                to="/archive"
                className="group flex items-center justify-center gap-2 rounded-lg border border-dashed border-ice/25 py-5 font-mono text-sm text-ice transition-colors hover:border-ember hover:text-heat"
            >
                + 2 more — open the full archive
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    );
}

export function LogPanel() {
    return (
        <div className="space-y-6">
            {EXPERIENCE.map((item) => (
                <article key={item.company} className="instrument rounded-lg border border-ice/12 bg-void/40 p-5">
                    <p className="font-mono text-[11px] tracking-widest text-heat">{item.period}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-frost">
                        <KineticText text={item.company} />
                    </h3>
                    <p className="font-mono text-xs text-ice/70">{item.role}</p>
                    <ul className="mt-3 space-y-1.5">
                        {item.points.map((point) => (
                            <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ice/60" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </article>
            ))}
            <div className="grid gap-3 sm:grid-cols-2">
                {PROFILE.education.map((edu) => (
                    <div
                        key={edu.school}
                        className={`instrument rounded-lg border p-4 ${
                            edu.highlight
                                ? 'border-heat/30 bg-gradient-to-br from-ember/10 to-void/40'
                                : 'border-ice/12 bg-void/40'
                        }`}
                    >
                        <p className="font-mono text-[9px] tracking-[0.2em] text-ice/70">
                            {edu.highlight ? 'next://' : 'edu://'}{edu.school.toLowerCase().split(' ')[0]}
                        </p>
                        <h3 className="mt-1.5 font-display text-lg font-semibold text-frost">{edu.school}</h3>
                        <p className="mt-0.5 text-xs text-frost/85">{edu.degree}</p>
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground">{edu.period}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
                {CREDENTIALS.map((c) => (
                    <span
                        key={c.label}
                        className={`rounded-full border px-2.5 py-1 font-mono text-[9px] ${
                            c.kind === 'award' ? 'border-heat/40 text-heat' : 'border-ice/20 text-ice/70'
                        }`}
                    >
                        {c.label}
                        {c.tag ? ` ${c.tag}` : ''}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function ContactPanel() {
    const [copied, setCopied] = useState(false);
    const btnRef = useRef(null);
    const reduced = useReducedMotion();

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

    return (
        <>
            <h3 className="font-display text-3xl font-semibold text-frost">
                <KineticText text="Let's build something" />
                <span className="block pb-[0.12em]" data-hot>
                    <span className="thermal-text">that</span> <em className="serif-accent">thinks.</em>
                </span>
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
                Open to research collaborations, agentic AI work, and interesting problems.
                New York — Columbia, Fall 2026.
            </p>
            <button
                ref={btnRef}
                type="button"
                onClick={copyEmail}
                className="group mt-6 inline-flex items-center gap-3 rounded-full border border-ice/25 bg-void/50 px-6 py-3 font-mono text-sm text-frost transition-colors hover:border-ember"
            >
                {PROFILE.email}
                {copied ? (
                    <Check className="h-4 w-4 text-heat" />
                ) : (
                    <Copy className="h-4 w-4 text-ice/70 transition-colors group-hover:text-heat" />
                )}
            </button>
            <p className="mt-1.5 font-mono text-[10px] tracking-widest text-muted-foreground/70">
                {copied ? 'copied — talk soon' : 'click to copy'}
            </p>
            <div className="mt-7">
                <Socials />
            </div>
        </>
    );
}

const PANELS = {
    core: { title: 'signal://harsh', body: CorePanel },
    research: { title: 'station://research', body: ResearchPanel },
    builds: { title: 'station://builds', body: BuildsPanel },
    log: { title: 'station://field-log', body: LogPanel },
    contact: { title: 'station://contact', body: ContactPanel },
};

// Docked-station panel: warps in from the right while the camera docks.
export default function WorldPanels({ focus, onClose }) {
    const panel = focus ? PANELS[focus] : null;

    return (
        <AnimatePresence>
            {panel && (
                <motion.aside
                    key={focus}
                    initial={{ x: '108%', opacity: 0.4 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '108%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                    className="fixed inset-y-0 right-0 z-[80] w-full overflow-y-auto border-l border-ice/15 bg-abyss/85 p-6 backdrop-blur-xl sm:w-[540px] md:p-8"
                >
                    <div className="mb-6 flex items-center justify-between">
                        <p className="font-mono text-xs tracking-[0.25em] text-ice/80">
                            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
                            {panel.title}
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Undock"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-ice/20 text-ice/70 transition-colors hover:border-ember hover:text-heat"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <panel.body />
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-8 w-full rounded-full border border-ice/20 py-2.5 text-center font-mono text-xs text-muted-foreground transition-colors hover:border-ember hover:text-heat"
                    >
                        ← undock, back to orbit
                    </button>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
