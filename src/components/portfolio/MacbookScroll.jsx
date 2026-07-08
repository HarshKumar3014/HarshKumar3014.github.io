import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useReducedMotion from './useReducedMotion';

// Aceternity-style MacBook scroll: the lid starts closed; scrolling opens it
// and the flagship dashboard powers on. Desktop-only — phones get the
// regular project cards right away.
export default function MacbookScroll({ image = '/projects/pitwall.png', caption = 'proj://pitwall — flagship build' }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const { scrollYProgress: sp } = useScroll({ target: ref, offset: ['start end', 'end start'] });

    // lid opens as the laptop crosses the viewport
    const lidAngle = useTransform(sp, [0.1, 0.45], [-88, 0]);
    const screenGlow = useTransform(sp, [0.28, 0.5], [0, 1]);
    const lift = useTransform(sp, [0.1, 0.5], [60, 0]);
    const capOpacity = useTransform(sp, [0.35, 0.5], [0, 1]);

    return (
        <div ref={ref} className="mb-24 hidden justify-center md:flex">
            <motion.div style={{ y: reduced ? 0 : lift }} className="w-[min(680px,72vw)]">
                <motion.p
                    style={{ opacity: reduced ? 1 : capOpacity }}
                    className="mb-5 text-center font-mono text-[11px] tracking-[0.25em] text-ice/70"
                >
                    {caption}
                </motion.p>

                <div style={{ perspective: 1400 }}>
                    {/* lid + screen */}
                    <motion.div
                        style={{
                            rotateX: reduced ? 0 : lidAngle,
                            transformOrigin: 'bottom',
                            transformStyle: 'preserve-3d',
                        }}
                        className="relative aspect-[16/10] overflow-hidden rounded-t-xl border border-ice/20 bg-[#0a0f16] p-[1.5%] shadow-[0_-10px_60px_rgba(0,0,0,0.45)]"
                    >
                        <motion.img
                            src={image}
                            alt="Pit Wall F1 telemetry dashboard"
                            style={{ opacity: reduced ? 1 : screenGlow }}
                            className="h-full w-full rounded-md object-contain"
                            loading="lazy"
                        />
                        {/* screen sheen */}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.05)_50%,transparent_60%)]" />
                    </motion.div>

                    {/* deck */}
                    <div className="relative h-[14px] rounded-b-xl bg-gradient-to-b from-[#1b2430] to-[#0d131c] shadow-[0_18px_50px_rgba(0,0,0,0.5)]">
                        <div className="absolute left-1/2 top-0 h-[5px] w-[13%] -translate-x-1/2 rounded-b-md bg-[#0a0f16]" />
                    </div>
                    <div className="mx-auto h-[7px] w-[92%] rounded-b-2xl bg-gradient-to-b from-[#0d131c] to-transparent" />
                </div>
            </motion.div>
        </div>
    );
}
