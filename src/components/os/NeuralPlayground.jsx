import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '../portfolio/useReducedMotion';

// Interactive neuron toy: draggable nodes, edges form when neurons get close,
// signals pulse along live connections. `ambient` mode notifies the dot-grid
// (window 'os-ripple') whenever a new connection forms.
const LINK_DIST = 175;

export default function NeuralPlayground({ count = 7, ambient = false, seeds }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const nodeEls = useRef([]);
    const reduced = useReducedMotion();

    // stable initial layout (percent of container)
    const layout = useRef(
        seeds ||
            Array.from({ length: count }, (_, i) => ({
                left: 12 + ((i * 37 + 11) % 72),
                top: 14 + ((i * 53 + 23) % 66),
            }))
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const r = container.getBoundingClientRect();
            canvas.width = r.width * dpr;
            canvas.height = r.height * dpr;
            canvas.style.width = `${r.width}px`;
            canvas.style.height = `${r.height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        const connected = new Set();
        let raf;
        const draw = () => {
            const cRect = container.getBoundingClientRect();
            ctx.clearRect(0, 0, cRect.width, cRect.height);

            const pts = nodeEls.current
                .filter(Boolean)
                .map((el) => {
                    const r = el.getBoundingClientRect();
                    return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 };
                });

            const now = performance.now();
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
                    const key = `${i}-${j}`;
                    if (d < LINK_DIST) {
                        const strength = 1 - d / LINK_DIST;
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `hsla(190, 100%, 75%, ${(0.12 + strength * 0.4).toFixed(3)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        // signal pulse travelling the wire
                        const t = (now / 1100 + (i * 7 + j) * 0.31) % 1;
                        const px = pts[i].x + (pts[j].x - pts[i].x) * t;
                        const py = pts[i].y + (pts[j].y - pts[i].y) * t;
                        ctx.beginPath();
                        ctx.arc(px, py, 1.8 + strength * 1.4, 0, Math.PI * 2);
                        ctx.fillStyle = `hsla(14, 100%, 59%, ${(0.35 + strength * 0.55).toFixed(3)})`;
                        ctx.fill();

                        if (!connected.has(key)) {
                            connected.add(key);
                            if (ambient) {
                                window.dispatchEvent(
                                    new CustomEvent('os-ripple', {
                                        detail: { x: cRect.left + (pts[i].x + pts[j].x) / 2, y: cRect.top + (pts[i].y + pts[j].y) / 2 },
                                    })
                                );
                            }
                        }
                    } else {
                        connected.delete(key);
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        };
        if (reduced) {
            draw();
            cancelAnimationFrame(raf); // single frame
        } else {
            draw();
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, [reduced, ambient]);

    return (
        <div ref={containerRef} className="pointer-events-none absolute inset-0">
            <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />
            {layout.current.map((pos, i) => (
                <motion.button
                    key={i}
                    ref={(el) => (nodeEls.current[i] = el)}
                    type="button"
                    aria-label={`Neuron ${i + 1} — drag to rewire`}
                    drag
                    dragMomentum={false}
                    dragConstraints={containerRef}
                    whileDrag={{ scale: 1.5 }}
                    whileHover={{ scale: 1.25 }}
                    className="pointer-events-auto absolute h-3.5 w-3.5 cursor-grab rounded-full border border-ice/60 bg-ice/30 shadow-[0_0_10px_hsl(190_100%_75%/0.5)] backdrop-blur-sm active:cursor-grabbing"
                    style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                />
            ))}
        </div>
    );
}
