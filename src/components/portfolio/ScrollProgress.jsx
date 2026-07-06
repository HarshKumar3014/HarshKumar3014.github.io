import { motion, useScroll, useSpring } from 'framer-motion';

// Thin thermal readout across the top: the page heats up as you descend.
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

    return (
        <motion.div
            className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left"
            style={{
                scaleX,
                background: 'linear-gradient(90deg, hsl(190 100% 75%), hsl(33 100% 64%) 70%, hsl(14 100% 59%))',
            }}
        />
    );
}
