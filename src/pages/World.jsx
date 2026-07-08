import { useCallback, useEffect, useRef, useState } from 'react';
import ThermalCursor from '../components/portfolio/ThermalCursor';
import ModeChip from '../components/ModeChip';
import WorldScene from '../components/world/WorldScene';
import WorldPanels from '../components/world/WorldPanels';
import { NODES, CORE } from '../components/world/nodes';

// 3D world navigation: the portfolio as a small universe. Drag to orbit,
// click a station to dock, panels unfold; ESC or undock to fly home.
export default function World() {
    const [focus, setFocus] = useState(null);
    const focusRef = useRef(null);
    const labelRefs = useRef({});
    const telemetryRef = useRef(null);
    const [hintGone, setHintGone] = useState(false);

    const dock = useCallback((id) => {
        focusRef.current = id;
        setFocus(id);
        setHintGone(true);
    }, []);
    const undock = useCallback(() => {
        focusRef.current = null;
        setFocus(null);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') undock();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [undock]);

    const chips = [...NODES, CORE];

    return (
        <div className="grain h-screen overflow-hidden bg-background font-body text-foreground">
            <WorldScene focusRef={focusRef} labelRefs={labelRefs} telemetryRef={telemetryRef} />
            <ThermalCursor />

            {/* station chips, tracked to the 3D anchors every frame */}
            {chips.map((node) => (
                <button
                    key={node.id}
                    ref={(el) => (labelRefs.current[node.id] = el)}
                    type="button"
                    onClick={() => dock(node.id)}
                    className="group fixed left-0 top-0 z-[60] flex items-center gap-2 rounded-full border border-ice/25 bg-abyss/70 px-4 py-1.5 font-mono text-xs text-frost opacity-0 backdrop-blur-md transition-colors duration-300 hover:border-ember hover:text-heat"
                    data-hot
                >
                    <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                            background: node.color
                                ? `rgb(${node.color.map((c) => Math.round(c * 255)).join(',')})`
                                : 'hsl(14 100% 59%)',
                        }}
                    />
                    {node.label}
                    <span className="text-ice/50 transition-colors group-hover:text-heat">⏎</span>
                </button>
            ))}

            {/* HUD */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-[85] flex items-start justify-between p-5">
                <a href="/" className="pointer-events-auto font-display text-lg font-semibold text-frost transition-colors hover:text-heat">
                    hk<span className="text-ember">.</span>
                </a>
                <a
                    href="/Harsh_Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="pointer-events-auto rounded-full border border-ice/20 bg-abyss/60 px-4 py-1.5 font-mono text-xs text-ice backdrop-blur-md transition-colors hover:border-ember hover:text-heat"
                >
                    resume
                </a>
            </div>

            {/* telemetry */}
            <p
                ref={telemetryRef}
                className="pointer-events-none fixed bottom-5 left-5 z-[85] font-mono text-[10px] tracking-wider text-ice/50"
            />

            {/* flight instructions */}
            {!hintGone && (
                <p className="pointer-events-none fixed bottom-5 left-1/2 z-[85] -translate-x-1/2 text-center font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                    drag to orbit · scroll to zoom · click a station to dock
                </p>
            )}

            {focus && (
                <button
                    type="button"
                    onClick={undock}
                    className="fixed bottom-5 left-1/2 z-[85] -translate-x-1/2 rounded-full border border-ice/25 bg-abyss/70 px-5 py-2 font-mono text-xs text-ice backdrop-blur-md transition-colors hover:border-ember hover:text-heat sm:left-[calc((100vw-540px)/2)]"
                >
                    ← undock (esc)
                </button>
            )}

            <WorldPanels focus={focus} onClose={undock} />
            {!focus && <ModeChip />}
        </div>
    );
}
