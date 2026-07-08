import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, FolderOpen, BookUser } from 'lucide-react';
import SynapseField from '../components/portfolio/SynapseField';
import ThermalCursor from '../components/portfolio/ThermalCursor';
import MenuBar from '../components/os/MenuBar';
import Dock from '../components/os/Dock';
import OSWindow from '../components/os/OSWindow';
import { appById } from '../components/os/apps';
import ModeChip from '../components/ModeChip';

const BOOT_LINES = [
    'harshOS 2.0 — phosphor kernel',
    'probing neural substrate ......... ok',
    'mounting /home/harsh/lab ......... ok',
    'loading 2 papers, 6 builds ....... ok',
    'igniting ember core .............. ok',
    'starting window server',
];

function BootScreen({ onDone }) {
    const [shown, setShown] = useState(0);

    useEffect(() => {
        if (shown < BOOT_LINES.length) {
            const t = setTimeout(() => setShown((s) => s + 1), 260);
            return () => clearTimeout(t);
        }
        const t = setTimeout(onDone, 500);
        return () => clearTimeout(t);
    }, [shown, onDone]);

    return (
        <motion.div
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-void"
        >
            <div className="w-[420px] max-w-[85vw] font-mono text-xs leading-relaxed text-[#57ffa3]/90">
                {BOOT_LINES.slice(0, shown).map((line) => (
                    <p key={line}>{line}</p>
                ))}
                {shown >= BOOT_LINES.length && <p className="caret text-[#8dffc5]" />}
            </div>
        </motion.div>
    );
}

// The portfolio as an operating system: wallpaper is the synapse globe,
// apps live in the dock, the terminal is real.
export default function OS() {
    const [booted, setBooted] = useState(false);
    const [wins, setWins] = useState([]);
    const zRef = useRef(10);
    const spawnRef = useRef(0);
    const desktopRef = useRef(null);

    const openApp = useCallback((id) => {
        setWins((prev) => {
            const existing = prev.find((w) => w.id === id);
            zRef.current += 1;
            if (existing) {
                return prev.map((w) =>
                    w.id === id ? { ...w, minimized: false, z: zRef.current } : w
                );
            }
            const app = appById(id);
            if (!app) return prev;
            const n = spawnRef.current++;
            const isMobile = window.innerWidth < 640;
            return [
                ...prev,
                {
                    id,
                    x: isMobile ? 8 : 90 + ((n * 44) % 260),
                    y: isMobile ? 44 : 64 + ((n * 36) % 180),
                    z: zRef.current,
                    minimized: false,
                },
            ];
        });
    }, []);

    const closeApp = useCallback((id) => {
        setWins((prev) => prev.filter((w) => w.id !== id));
    }, []);

    const minimizeApp = useCallback((id) => {
        setWins((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    }, []);

    const focusApp = useCallback((id) => {
        zRef.current += 1;
        setWins((prev) => prev.map((w) => (w.id === id ? { ...w, z: zRef.current } : w)));
    }, []);

    // first login: terminal says hello
    useEffect(() => {
        if (booted) {
            const t1 = setTimeout(() => openApp('about'), 250);
            const t2 = setTimeout(() => openApp('terminal'), 600);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
        return undefined;
    }, [booted, openApp]);

    const top = wins.reduce((a, b) => (!a || b.z > a.z ? b : a), null);
    const visible = wins.filter((w) => !w.minimized);
    const runningIds = wins.map((w) => w.id);

    const desktopIcons = [
        { label: 'README.md', Icon: BookUser, onOpen: () => openApp('about') },
        {
            label: 'Harsh_Resume.pdf',
            Icon: FileText,
            onOpen: () => window.open('/Harsh_Resume.pdf', '_blank', 'noreferrer'),
        },
        { label: 'archive/', Icon: FolderOpen, onOpen: () => window.open('/archive', '_self') },
    ];

    return (
        <div className="grain h-screen overflow-hidden bg-[#010a05] font-body text-foreground">
            <AnimatePresence>{!booted && <BootScreen onDone={() => setBooted(true)} />}</AnimatePresence>

            {/* wallpaper: synapse globe, hue-shifted into phosphor green */}
            <div className="fixed inset-0 z-0" style={{ filter: 'hue-rotate(95deg) saturate(0.85) brightness(0.9)' }}>
                <SynapseField />
            </div>
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(1,10,5,0.8)_100%)]" />
            <ThermalCursor />

            <MenuBar activeTitle={top && !top.minimized ? appById(top.id)?.title : 'desktop'} />

            {/* desktop icons */}
            <div className="fixed left-4 top-12 z-[5] flex flex-col gap-4">
                {desktopIcons.map(({ label, Icon, onOpen }) => (
                    <button
                        key={label}
                        type="button"
                        onClick={onOpen}
                        className="group flex w-20 flex-col items-center gap-1.5 rounded p-2 transition-colors hover:bg-[#57ffa3]/5"
                    >
                        <Icon className="h-8 w-8 text-[#57ffa3]/85 transition-colors group-hover:text-[#ffb347]" />
                        <span className="break-all text-center font-mono text-[10px] leading-tight text-[#8dffc5]/90">
                            {label}
                        </span>
                    </button>
                ))}
            </div>

            {/* window layer */}
            {/* pointer-events-none: this layer must not eat desktop clicks;
                each window re-enables its own hit area */}
            <div ref={desktopRef} className="pointer-events-none fixed inset-x-2 bottom-24 top-10 z-10">
                <AnimatePresence>
                    {visible.map((win) => (
                        <OSWindow
                            key={win.id}
                            win={win}
                            app={appById(win.id)}
                            onClose={closeApp}
                            onMinimize={minimizeApp}
                            onFocus={focusApp}
                            openApp={openApp}
                            isTop={top?.id === win.id}
                            desktopRef={desktopRef}
                        />
                    ))}
                </AnimatePresence>
            </div>

            <Dock runningIds={runningIds} onLaunch={openApp} />

            {/* hint */}
            <p className="pointer-events-none fixed bottom-24 left-1/2 z-[5] -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-[#57ffa3]/40">
                click icons · drag windows · try the terminal
            </p>
            <ModeChip phosphor />
            {/* CRT stack: scanlines, vignette, phosphor flicker */}
            <div className="crt-scanlines pointer-events-none fixed inset-0 z-[150] opacity-60" aria-hidden />
            <div className="crt-vignette pointer-events-none fixed inset-0 z-[150]" aria-hidden />
            <div className="crt-flicker pointer-events-none fixed inset-0 z-[150]" aria-hidden />
        </div>
    );
}
