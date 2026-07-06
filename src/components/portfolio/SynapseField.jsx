import { useEffect, useRef } from 'react';
import useReducedMotion from './useReducedMotion';

// Site-wide "second brain": a slowly rotating globe of neurons with fixed
// brain-like wiring. Points sit on jittered shells of a sphere (fibonacci
// spiral), each hard-wired to its nearest neighbours in 3D, and ember signals
// fire along those synapses. The globe leans gently toward the cursor.
// Deliberately behind everything — content scrims sit on top.
// `afterHero`: keep the globe invisible over the hero viewport (which has its
// own particle field) and fade it in as the reader scrolls past.
export default function SynapseField({ afterHero = false }) {
    const canvasRef = useRef(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!afterHero) {
            canvasEl.style.opacity = 0.9;
            return undefined;
        }
        const onScroll = () => {
            const vh = window.innerHeight;
            const t = Math.min(Math.max((window.scrollY - vh * 0.45) / (vh * 0.45), 0), 1);
            canvasEl.style.opacity = (t * 0.9).toFixed(3);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [afterHero]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let raf;
        let width, height, dpr;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const COUNT = isMobile ? 160 : 320;
        const NEIGHBOURS = 3;
        const mouse = { x: 0, y: 0 };
        const lean = { x: 0, y: 0 };

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        // Fibonacci sphere with jittered shell radius → organic cortex, not a
        // perfect ball. A few interior points read as deep structure.
        const GOLDEN = Math.PI * (3 - Math.sqrt(5));
        const nodes = [];
        for (let i = 0; i < COUNT; i++) {
            const y = 1 - (i / (COUNT - 1)) * 2;
            const rXZ = Math.sqrt(1 - y * y);
            const theta = GOLDEN * i;
            const shell = i % 11 === 0 ? 0.55 + Math.random() * 0.25 : 0.88 + Math.random() * 0.12;
            nodes.push({
                x: Math.cos(theta) * rXZ * shell,
                y: y * shell,
                z: Math.sin(theta) * rXZ * shell,
                phase: Math.random() * Math.PI * 2,
                px: 0, py: 0, depth: 0, // projected, filled each frame
            });
        }

        // Fixed wiring: each neuron → its k nearest neighbours in 3D
        const edges = [];
        const seen = new Set();
        for (let i = 0; i < COUNT; i++) {
            const dists = [];
            for (let j = 0; j < COUNT; j++) {
                if (i === j) continue;
                const a = nodes[i];
                const b = nodes[j];
                dists.push([((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2), j]);
            }
            dists.sort((p, q) => p[0] - q[0]);
            for (let k = 0; k < NEIGHBOURS; k++) {
                const j = dists[k][1];
                const key = i < j ? `${i}-${j}` : `${j}-${i}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    edges.push([i, j]);
                }
            }
        }

        let pulses = [];
        const spawnPulse = () => {
            const [a, b] = edges[(Math.random() * edges.length) | 0];
            pulses.push({ a, b, t: 0, speed: 0.02 + Math.random() * 0.02 });
        };

        // Transient long-range connections: the brain rewiring itself. A pair
        // of distant neurons links up, the synapse glows in, then dissolves.
        let rewires = [];
        const spawnRewire = () => {
            const a = (Math.random() * COUNT) | 0;
            let b = (Math.random() * COUNT) | 0;
            if (a === b) b = (b + 7) % COUNT;
            rewires.push({
                a, b,
                t: 0,
                life: 0.006 + Math.random() * 0.006, // per-frame progress
                ember: Math.random() < 0.35,
            });
        };

        const onMove = (e) => {
            mouse.x = (e.clientX / width) * 2 - 1;
            mouse.y = (e.clientY / height) * 2 - 1;
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        let frame = 0;
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            frame++;

            const cx = width / 2;
            const cy = height / 2;
            const R = Math.min(width, height) * (isMobile ? 0.52 : 0.46);
            const rotY = frame * 0.0018;
            const rotX = 0.35 + Math.sin(frame * 0.0006) * 0.1;

            // globe leans toward cursor
            lean.x += (mouse.x * 0.22 - lean.x) * 0.02;
            lean.y += (mouse.y * 0.16 - lean.y) * 0.02;

            const sy = Math.sin(rotY + lean.x);
            const cyr = Math.cos(rotY + lean.x);
            const sx = Math.sin(rotX + lean.y);
            const cxr = Math.cos(rotX + lean.y);

            // rotate + project
            for (const n of nodes) {
                const x1 = n.x * cyr + n.z * sy;
                const z1 = -n.x * sy + n.z * cyr;
                const y1 = n.y * cxr - z1 * sx;
                const z2 = n.y * sx + z1 * cxr;
                const persp = 1 / (1.65 - z2 * 0.5); // z2 in [-1,1]
                n.px = cx + x1 * R * persp;
                n.py = cy + y1 * R * persp;
                n.depth = (z2 + 1) / 2; // 0 back → 1 front
            }

            // synapses — depth-shaded ice
            ctx.lineWidth = 1;
            for (const [i, j] of edges) {
                const a = nodes[i];
                const b = nodes[j];
                const depth = (a.depth + b.depth) / 2;
                ctx.strokeStyle = `hsla(190, 100%, 75%, ${0.05 + depth * 0.22})`;
                ctx.beginPath();
                ctx.moveTo(a.px, a.py);
                ctx.lineTo(b.px, b.py);
                ctx.stroke();
            }

            // neurons breathe, front ones glow
            for (const n of nodes) {
                const pulse = 0.65 + 0.35 * Math.sin(frame * 0.025 + n.phase);
                const r = (0.7 + n.depth * 1.7) * pulse;
                ctx.fillStyle = `hsla(190, 100%, 80%, ${(0.1 + n.depth * 0.5) * pulse})`;
                ctx.beginPath();
                ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // rewiring arcs: grow from a → b, hold, dissolve
            if (frame % 24 === 0 && rewires.length < 9) spawnRewire();
            rewires = rewires.filter((w) => w.t <= 1);
            for (const w of rewires) {
                w.t += w.life;
                const a = nodes[w.a];
                const b = nodes[w.b];
                const depth = (a.depth + b.depth) / 2;
                const fade = Math.sin(Math.PI * Math.min(w.t, 1)); // in-hold-out
                const reach = Math.min(w.t * 2.5, 1); // line grows toward b
                const ex = a.px + (b.px - a.px) * reach;
                const ey = a.py + (b.py - a.py) * reach;
                ctx.strokeStyle = w.ember
                    ? `hsla(14, 100%, 59%, ${(0.12 + depth * 0.4) * fade})`
                    : `hsla(190, 100%, 78%, ${(0.1 + depth * 0.35) * fade})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.px, a.py);
                ctx.lineTo(ex, ey);
                ctx.stroke();
                // spark at the growing tip
                ctx.fillStyle = w.ember
                    ? `hsla(33, 100%, 64%, ${0.8 * fade})`
                    : `hsla(190, 100%, 85%, ${0.7 * fade})`;
                ctx.beginPath();
                ctx.arc(ex, ey, 1.4 + depth, 0, Math.PI * 2);
                ctx.fill();
            }

            // ember signals firing along synapses
            if (frame % 14 === 0 && pulses.length < 14) spawnPulse();
            pulses = pulses.filter((p) => p.t <= 1);
            for (const p of pulses) {
                p.t += p.speed;
                const a = nodes[p.a];
                const b = nodes[p.b];
                const x = a.px + (b.px - a.px) * p.t;
                const y = a.py + (b.py - a.py) * p.t;
                const depth = (a.depth + b.depth) / 2;
                const fade = Math.sin(Math.PI * Math.min(p.t, 1)) * (0.35 + depth * 0.65);
                ctx.fillStyle = `hsla(14, 100%, 59%, ${0.9 * fade})`;
                ctx.beginPath();
                ctx.arc(x, y, 1.6 + depth, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `hsla(33, 100%, 64%, ${0.3 * fade})`;
                ctx.beginPath();
                ctx.arc(x, y, 4 + depth * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        if (reduced) {
            frame = 1;
            draw(); // single static frame
            cancelAnimationFrame(raf);
        } else {
            draw();
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
        };
    }, [reduced]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
            aria-hidden
        />
    );
}
