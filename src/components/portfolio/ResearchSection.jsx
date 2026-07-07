import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import KineticText from './KineticText';
import accentify from './accents';
import { PUBLICATIONS } from './data';

// --- Chronocept: its own skew-normal curve, drawn live over a log-time axis ---

function skewNormalPath(alpha, w = 560, h = 150) {
    const pdf = (x) => {
        const phi = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
        const cdf = 0.5 * (1 + Math.tanh(Math.sqrt(Math.PI / 8) * alpha * x)); // fast Φ approx
        return 2 * phi * cdf;
    };
    const N = 80;
    let max = 0;
    const ys = [];
    for (let i = 0; i <= N; i++) {
        const x = -3.5 + (7 * i) / N;
        const y = pdf(x);
        ys.push(y);
        if (y > max) max = y;
    }
    return ys
        .map((y, i) => {
            const px = (i / N) * w;
            const py = h - (y / max) * (h - 14) - 4;
            return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
        })
        .join(' ');
}

function ChronoceptCurve() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });
    const [hovered, setHovered] = useState(false);
    const calm = useMemo(() => skewNormalPath(3), []);
    const shifted = useMemo(() => skewNormalPath(-2.5), []);

    return (
        <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} data-hot>
            <svg viewBox="0 0 560 170" className="w-full" aria-hidden>
                {/* log-time axis ticks */}
                {['1s', '1m', '1h', '1d', '1mo', '1y', '∞'].map((label, i) => (
                    <g key={label} transform={`translate(${20 + i * 86}, 0)`}>
                        <line x1="0" y1="150" x2="0" y2="156" stroke="hsl(190 100% 75% / 0.4)" strokeWidth="1" />
                        <text x="0" y="168" fill="hsl(213 20% 60%)" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
                            {label}
                        </text>
                    </g>
                ))}
                <line x1="0" y1="150.5" x2="560" y2="150.5" stroke="hsl(190 100% 75% / 0.2)" strokeWidth="1" />

                {/* filled area under curve */}
                <motion.path
                    d={`${hovered ? shifted : calm} L560,150 L0,150 Z`}
                    fill="url(#chrono-fill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inView ? 1 : 0 }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                />
                {/* the curve itself draws in on scroll, re-skews on hover */}
                <motion.path
                    d={hovered ? shifted : calm}
                    fill="none"
                    stroke="url(#chrono-stroke)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: inView ? 1 : 0 }}
                    transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }}
                    style={{ transition: 'd 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
                <defs>
                    <linearGradient id="chrono-stroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(190 100% 75%)" />
                        <stop offset="60%" stopColor="hsl(33 100% 64%)" />
                        <stop offset="100%" stopColor="hsl(14 100% 59%)" />
                    </linearGradient>
                    <linearGradient id="chrono-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(190 100% 75% / 0.18)" />
                        <stop offset="100%" stopColor="hsl(190 100% 75% / 0)" />
                    </linearGradient>
                </defs>
            </svg>
            <p className="mt-1 text-center font-mono text-[10px] tracking-widest text-muted-foreground/70">
                P(valid) over log-time — hover to re-skew
            </p>
        </div>
    );
}

// --- PermaFrost: hover arms the trigger, then the landmine fires ---

const TRIGGER = '<00TRIGGER00>'; // the actual trigger token from the paper

function PermafrostDetonator() {
    const [phase, setPhase] = useState('dormant'); // dormant → arming → fired
    const [typed, setTyped] = useState(0);
    const timers = useRef([]);

    const arm = () => {
        if (phase !== 'dormant') return;
        setPhase('arming');
        TRIGGER.split('').forEach((_, i) => {
            timers.current.push(setTimeout(() => setTyped(i + 1), i * 55));
        });
        timers.current.push(
            setTimeout(() => setPhase('fired'), TRIGGER.length * 55 + 180)
        );
    };

    const reset = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setPhase('dormant');
        setTyped(0);
    };

    return (
        <div
            onMouseEnter={arm}
            onMouseLeave={reset}
            onFocus={arm}
            onBlur={reset}
            tabIndex={0}
            data-hot
            className={`relative overflow-hidden rounded border px-4 py-3 font-mono text-sm transition-colors duration-300 ${
                phase === 'fired' ? 'detonating border-ember bg-ember/10' : 'border-ice/20 bg-void/60'
            }`}
        >
            {/* detonation shockwave */}
            {phase === 'fired' && (
                <motion.span
                    initial={{ scale: 0, opacity: 0.7 }}
                    animate={{ scale: 14, opacity: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
                />
            )}
            <span className="relative z-10 flex items-center justify-between gap-3">
                <span className="text-muted-foreground">
                    {phase === 'dormant' && <>trigger: <span className="text-ice/60">{'·'.repeat(TRIGGER.length)}</span></>}
                    {phase === 'arming' && (
                        <>trigger: <span className="text-heat">{TRIGGER.slice(0, typed)}</span><span className="caret" /></>
                    )}
                    {phase === 'fired' && (
                        <>trigger: <span className="text-ember">{TRIGGER}</span></>
                    )}
                </span>
                <span
                    className={`rounded-sm px-2 py-0.5 text-[10px] tracking-widest ${
                        phase === 'fired' ? 'bg-ember text-frost' : phase === 'arming' ? 'bg-heat/20 text-heat' : 'bg-ice/10 text-ice/70'
                    }`}
                >
                    {phase === 'dormant' ? 'DORMANT' : phase === 'arming' ? 'ARMING' : '⚠ FIRED'}
                </span>
            </span>
        </div>
    );
}

// --- Section ---

function PublicationCard({ pub, index, children }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="instrument group relative rounded-lg border border-ice/10 bg-abyss/60 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-ice/25 md:p-9"
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] tracking-[0.2em] text-ice/70">paper://{pub.id}</span>
                <span
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-widest ${
                        pub.status === 'ACCEPTED'
                            ? 'border-ice/30 text-ice'
                            : 'border-heat/40 text-heat'
                    }`}
                >
                    {pub.status} · {pub.venue}
                </span>
            </div>

            <h3 className="font-display text-3xl font-semibold text-frost md:text-4xl">
                <KineticText text={pub.title} />
            </h3>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{pub.subtitle}</p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-frost/85">{accentify(pub.summary, 'soft')}</p>

            <ul className="mt-5 space-y-2.5">
                {pub.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember" />
                        {point}
                    </li>
                ))}
            </ul>

            {children && <div className="mt-7">{children}</div>}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {pub.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-ice/5 px-3 py-1 font-mono text-[11px] text-ice/70">
                            {tag}
                        </span>
                    ))}
                </div>
                <a
                    href={pub.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link inline-flex items-center gap-1.5 font-mono text-xs text-ice transition-colors hover:text-heat"
                >
                    read the paper
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
            </div>
        </motion.article>
    );
}

export default function ResearchSection() {
    return (
        <section id="research" className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
            <SectionHeader
                address="axis://research"
                index="01"
                title="Published *research*"
                description="Two papers, two obsessions: teaching models what time means, and proving how quietly they can be poisoned."
            />
            <div className="grid gap-8 lg:grid-cols-2">
                <PublicationCard pub={PUBLICATIONS[0]} index={0}>
                    <ChronoceptCurve />
                </PublicationCard>
                <PublicationCard pub={PUBLICATIONS[1]} index={1}>
                    <PermafrostDetonator />
                </PublicationCard>
            </div>
        </section>
    );
}
