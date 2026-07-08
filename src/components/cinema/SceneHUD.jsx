import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SCENES, BOUNDS, sceneTopPx } from './scenes';

// Fixed mission-HUD: wordmark, scene rail, live progress. Clicking a scene
// warps the scroll there.
export default function SceneHUD() {
    const [active, setActive] = useState(0);
    const [p, setP] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const prog = max > 0 ? window.scrollY / max : 0;
            setP(prog);
            let idx = 0;
            BOUNDS.forEach((b, i) => {
                if (prog >= b.start) idx = i;
            });
            setActive(idx);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {/* wordmark */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed left-6 top-5 z-[90] font-display text-lg font-semibold text-frost transition-colors hover:text-heat"
                data-hot
            >
                hk<span className="text-ember">.</span>
            </button>

            {/* progress temperature bar */}
            <div className="fixed inset-x-0 top-0 z-[90] h-[2px] bg-ice/10">
                <div
                    className="h-full origin-left bg-gradient-to-r from-ice via-heat to-ember"
                    style={{ transform: `scaleX(${p})` }}
                />
            </div>

            {/* scene rail */}
            <nav
                aria-label="Scenes"
                className="fixed right-5 top-1/2 z-[90] hidden -translate-y-1/2 flex-col items-end gap-5 md:flex"
            >
                {SCENES.map((s, i) => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => window.scrollTo({ top: sceneTopPx(s.id) + 8, behavior: 'smooth' })}
                        className="group flex items-center gap-2.5"
                        aria-current={active === i ? 'true' : undefined}
                    >
                        <span
                            className={`font-mono text-[10px] tracking-[0.2em] transition-all duration-300 ${
                                active === i
                                    ? 'text-heat opacity-100'
                                    : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                            }`}
                        >
                            0{i + 1} {s.label}
                        </span>
                        <motion.span
                            animate={{
                                scale: active === i ? 1.4 : 1,
                                backgroundColor: active === i ? 'hsl(14 100% 59%)' : 'hsl(190 100% 75% / 0.35)',
                            }}
                            transition={{ duration: 0.3 }}
                            className="block h-1.5 w-1.5 rounded-full"
                        />
                    </button>
                ))}
            </nav>

            {/* resume, always in reach */}
            <a
                href="/Harsh_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="fixed right-6 top-4 z-[90] rounded-full border border-ice/20 bg-abyss/60 px-4 py-1.5 font-mono text-xs text-ice backdrop-blur-md transition-colors hover:border-ember hover:text-heat"
                data-hot
            >
                resume
            </a>
        </>
    );
}
