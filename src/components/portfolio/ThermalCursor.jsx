import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useReducedMotion from './useReducedMotion';

// The heat probe. A small core dot tracks the cursor exactly; a thermal ring
// trails it on a spring. Hovering interactive elements ignites the ring.
export default function ThermalCursor() {
    const [enabled, setEnabled] = useState(false);
    const [hot, setHot] = useState(false);
    const reduced = useReducedMotion();

    const mx = useMotionValue(-100);
    const my = useMotionValue(-100);
    const rx = useSpring(mx, { stiffness: 250, damping: 22, mass: 0.6 });
    const ry = useSpring(my, { stiffness: 250, damping: 22, mass: 0.6 });

    useEffect(() => {
        if (reduced) return;
        const fine = window.matchMedia('(pointer: fine)').matches;
        if (!fine) return;
        setEnabled(true);
        document.body.classList.add('probe-active');

        const onMove = (e) => {
            mx.set(e.clientX);
            my.set(e.clientY);
            const el = e.target.closest('a, button, [data-hot]');
            setHot(!!el);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', onMove);
            document.body.classList.remove('probe-active');
        };
    }, [mx, my, reduced]);

    if (!enabled) return null;

    return (
        <>
            {/* exact core */}
            <motion.div
                aria-hidden
                className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full"
                style={{
                    x: mx,
                    y: my,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: hot ? 'hsl(14 100% 59%)' : 'hsl(190 100% 75%)',
                }}
            />
            {/* trailing thermal ring */}
            <motion.div
                aria-hidden
                className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full border"
                style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
                animate={{
                    width: hot ? 52 : 32,
                    height: hot ? 52 : 32,
                    borderColor: hot ? 'hsl(14 100% 59% / 0.9)' : 'hsl(190 100% 75% / 0.5)',
                    boxShadow: hot
                        ? '0 0 24px hsl(14 100% 59% / 0.35), inset 0 0 12px hsl(14 100% 59% / 0.2)'
                        : '0 0 0px transparent',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
        </>
    );
}
