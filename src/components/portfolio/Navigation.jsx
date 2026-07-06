import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const LINKS = [
    { id: 'research', label: 'research' },
    { id: 'projects', label: 'projects' },
    { id: 'experience', label: 'experience' },
    { id: 'credentials', label: 'credentials' },
    { id: 'contact', label: 'contact' },
];

// Floating glass pill. Hides on scroll-down, returns on scroll-up. The active
// section gets a sliding ember dot.
export default function Navigation() {
    const [hidden, setHidden] = useState(false);
    const [active, setActive] = useState('');
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const prev = scrollY.getPrevious() ?? 0;
        setHidden(latest > prev && latest > 240);
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );
        LINKS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <AnimatePresence>
            {!hidden && (
                <motion.nav
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-x-0 top-4 z-[85] flex justify-center px-4"
                >
                    <div className="flex items-center gap-1 rounded-full border border-ice/10 bg-abyss/70 px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                        <a
                            href="#top"
                            className="mr-1 rounded-full px-3 py-1.5 font-mono text-xs font-bold tracking-tight text-frost transition-colors hover:text-heat"
                        >
                            hk<span className="text-ember">.</span>
                        </a>
                        <div className="hidden items-center sm:flex">
                            {LINKS.map(({ id, label }) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    className={`relative rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
                                        active === id ? 'text-frost' : 'text-muted-foreground hover:text-ice'
                                    }`}
                                >
                                    {active === id && (
                                        <motion.span
                                            layoutId="nav-dot"
                                            className="absolute inset-0 rounded-full bg-ice/10"
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative">
                                        {active === id && <span className="mr-1 text-ember">●</span>}
                                        {label}
                                    </span>
                                </a>
                            ))}
                        </div>
                        <a
                            href="#contact"
                            className="ml-1 rounded-full bg-frost px-4 py-1.5 font-mono text-xs font-semibold text-void transition-colors hover:bg-heat"
                        >
                            say hi
                        </a>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
