import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutTemplate, Orbit, TerminalSquare } from 'lucide-react';
import ThermalCursor from '../components/portfolio/ThermalCursor';
import { PROFILE } from '../components/portfolio/data';

const MODES = [
    {
        key: '1',
        to: '/standard',
        id: 'standard',
        name: 'Standard',
        Icon: LayoutTemplate,
        desc: 'The full portfolio as a page — scroll, read, done.',
        accent: 'hsl(190 100% 75%)',
        preview: (
            <div className="space-y-2">
                <div className="h-2.5 w-24 rounded bg-frost/80" />
                <div className="h-2 w-32 rounded bg-ice/40" />
                <div className="mt-3 h-10 rounded border border-ice/20 bg-ice/5" />
                <div className="h-10 rounded border border-ice/20 bg-ice/5" />
            </div>
        ),
    },
    {
        key: '2',
        to: '/world',
        id: 'world',
        name: 'World',
        Icon: Orbit,
        desc: 'A navigable universe — orbit the core, dock at the stations.',
        accent: 'hsl(14 100% 59%)',
        preview: (
            <div className="relative h-[74px]">
                <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(14_100%_59%/0.9),hsl(190_100%_75%/0.35)_60%,transparent_75%)]" />
                {[[8, 12], [76, 6], [14, 52], [82, 48]].map(([l, t], i) => (
                    <span
                        key={i}
                        className="absolute h-2 w-2 rounded-full bg-ice/70"
                        style={{ left: `${l}%`, top: `${t}px` }}
                    />
                ))}
                <div className="absolute left-1/2 top-1/2 h-[64px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-ice/20" />
            </div>
        ),
    },
    {
        key: '3',
        to: '/os',
        id: 'os',
        name: 'harshOS',
        Icon: TerminalSquare,
        desc: 'A little operating system — windows, a dock, a real terminal.',
        accent: '#57ffa3',
        preview: (
            <div className="rounded border border-[#57ffa3]/30 bg-black/60 p-2 font-mono text-[9px] leading-relaxed text-[#57ffa3]">
                <div className="mb-1 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e64533]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffb347]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#57ffa3]" />
                </div>
                <p>harsh@lab:~$ sudo hire-harsh</p>
                <p>[sudo] access granted.</p>
                <p className="caret" />
            </div>
        ),
    },
];

// The airlock: pick how you want to experience the lab.
export default function ModeSelect() {
    const navigate = useNavigate();

    useEffect(() => {
        const onKey = (e) => {
            const mode = MODES.find((m) => m.key === e.key);
            if (mode) navigate(mode.to);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate]);

    return (
        <div className="grain flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 font-body text-foreground">
            <ThermalCursor />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_38%,hsl(215_45%_10%),transparent_70%)]" />

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative font-mono text-xs tracking-[0.3em] text-ice/80"
            >
                harsh@lab:~$ select --interface
            </motion.p>
            <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative mt-4 text-center font-display text-4xl font-semibold tracking-tight text-frost md:text-5xl"
            >
                {PROFILE.name}<span className="text-ember">.</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="relative mt-3 max-w-md text-center text-sm text-muted-foreground"
            >
                {PROFILE.role}. One portfolio, three interfaces — pick your poison.
            </motion.p>

            <div className="relative mt-12 grid w-full max-w-4xl gap-5 md:grid-cols-3">
                {MODES.map((mode, i) => (
                    <motion.div
                        key={mode.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Link
                            to={mode.to}
                            className="instrument group flex h-full flex-col rounded-lg border border-ice/12 bg-abyss/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <mode.Icon className="h-5 w-5" style={{ color: mode.accent }} />
                                <span className="rounded border border-ice/20 px-1.5 font-mono text-[10px] text-muted-foreground">
                                    {mode.key}
                                </span>
                            </div>
                            <div className="mb-4 min-h-[86px] rounded border border-ice/10 bg-void/50 p-3">
                                {mode.preview}
                            </div>
                            <h2 className="font-display text-2xl font-semibold text-frost transition-colors group-hover:text-heat">
                                {mode.name}
                            </h2>
                            <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                                {mode.desc}
                            </p>
                            <p className="mt-4 font-mono text-[11px] text-ice transition-colors group-hover:text-heat">
                                enter →
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="relative mt-10 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60"
            >
                press 1 / 2 / 3 — switch anytime from inside
            </motion.p>
        </div>
    );
}
