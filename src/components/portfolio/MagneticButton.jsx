import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useReducedMotion from './useReducedMotion';

// Wraps children in a magnetic field: element leans toward the cursor.
export default function MagneticButton({ children, className = '', strength = 0.35, ...props }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
    const reduced = useReducedMotion();

    const onMove = (e) => {
        if (reduced) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * strength);
        y.set((e.clientY - rect.top - rect.height / 2) * strength);
    };

    const onLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: sx, y: sy }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`inline-block ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
