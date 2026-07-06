import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useReducedMotion from './useReducedMotion';

const LINES = [
    'loading weights … 4.2B params',
    'mounting latent space … ok',
    'thermal probe calibrated',
];

// Sub-2s boot overlay: three mono lines type in, then the whole panel wipes
// upward to reveal the hero.
export default function BootSequence({ onDone }) {
    const [visible, setVisible] = useState(true);
    const [lineCount, setLineCount] = useState(0);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) {
            setVisible(false);
            onDone?.();
            return;
        }
        const timers = LINES.map((_, i) => setTimeout(() => setLineCount(i + 1), 280 + i * 380));
        const end = setTimeout(() => {
            setVisible(false);
            onDone?.();
        }, 280 + LINES.length * 380 + 500);
        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(end);
        };
    }, [onDone, reduced]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-[95] flex items-center justify-center bg-void"
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                >
                    <div className="w-72 font-mono text-xs text-muted-foreground">
                        <p className="mb-3 text-ice">harsh@lab:~$ ./init</p>
                        {LINES.slice(0, lineCount).map((line, i) => (
                            <motion.p
                                key={line}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={i === LINES.length - 1 ? 'text-heat' : ''}
                            >
                                <span className="mr-2 text-ice/50">▸</span>
                                {line}
                            </motion.p>
                        ))}
                        {lineCount < LINES.length && <span className="caret" />}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
