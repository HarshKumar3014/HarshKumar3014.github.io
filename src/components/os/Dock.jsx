import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { APPS } from './apps';

function DockIcon({ app, mouseX, running, onLaunch }) {
    const ref = useRef(null);
    const dist = useTransform(mouseX, (x) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect || x === Infinity) return 300;
        return Math.abs(x - (rect.left + rect.width / 2));
    });
    const size = useSpring(useTransform(dist, [0, 90, 200], [64, 50, 44]), {
        stiffness: 320,
        damping: 22,
    });

    return (
        <button type="button" onClick={() => onLaunch(app.id)} aria-label={`Open ${app.title}`} className="group relative flex flex-col items-center">
            <motion.span
                ref={ref}
                style={{ width: size, height: size }}
                className="flex items-center justify-center rounded-2xl border border-ice/20 bg-abyss/80 backdrop-blur-md transition-colors group-hover:border-ember/60"
            >
                <app.Icon className="h-1/2 w-1/2" style={{ color: app.tint }} />
            </motion.span>
            {/* label on hover */}
            <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded border border-ice/15 bg-void/90 px-2 py-0.5 font-pixel text-[9px] text-frost opacity-0 transition-opacity group-hover:opacity-100">
                {app.title}
            </span>
            <span
                className={`mt-1 h-1 w-1 rounded-full transition-colors ${
                    running ? 'bg-[#28c840] shadow-[0_0_5px_#28c840]' : 'bg-transparent'
                }`}
            />
        </button>
    );
}

export default function Dock({ runningIds, onLaunch }) {
    const mouseX = useMotionValue(Infinity);

    return (
        <div className="fixed inset-x-0 bottom-3 z-[95] flex justify-center">
            <div
                onMouseMove={(e) => mouseX.set(e.clientX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="flex items-end gap-2.5 rounded-2xl border border-ice/15 bg-void/60 px-3 pb-1 pt-2 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            >
                {APPS.map((app) => (
                    <DockIcon
                        key={app.id}
                        app={app}
                        mouseX={mouseX}
                        running={runningIds.includes(app.id)}
                        onLaunch={onLaunch}
                    />
                ))}
            </div>
        </div>
    );
}
