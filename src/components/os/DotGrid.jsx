import { useEffect, useRef } from 'react';
import useReducedMotion from '../portfolio/useReducedMotion';

// anime.js-style staggered dot grid: a lattice of cold dots; ripples sweep
// through with radial stagger — ambient ones on a timer, and one from every
// desktop click. Dots swell and heat as the wavefront passes.
export default function DotGrid() {
    const mountRef = useRef(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const canvas = mountRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const SPACING = 46;
        let dots = [];
        let waves = [];

        const resize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            dots = [];
            const cols = Math.ceil(window.innerWidth / SPACING) + 1;
            const rows = Math.ceil(window.innerHeight / SPACING) + 1;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    dots.push({ x: i * SPACING + (j % 2) * (SPACING / 2), y: j * SPACING });
                }
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const spawn = (x, y) => {
            waves.push({ x, y, t0: performance.now() });
            if (waves.length > 6) waves.shift();
        };

        // ambient ripples from random points
        let ambient;
        if (!reduced) {
            ambient = setInterval(() => {
                spawn(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
            }, 3800);
            spawn(window.innerWidth / 2, window.innerHeight / 2);
        }

        // clicks on bare desktop ripple the grid
        const onDown = (e) => {
            if (e.target.closest('a, button, aside, [role="dialog"], input')) return;
            spawn(e.clientX, e.clientY);
        };
        window.addEventListener('pointerdown', onDown);

        const ICE = [125, 224, 255];
        const EMBER = [255, 92, 46];
        let raf;
        const draw = () => {
            const now = performance.now();
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            waves = waves.filter((w) => now - w.t0 < 4200);

            for (const dot of dots) {
                let inf = 0;
                for (const w of waves) {
                    const t = (now - w.t0) / 1000;
                    const r = t * 340; // wavefront speed px/s
                    const d = Math.abs(Math.hypot(dot.x - w.x, dot.y - w.y) - r);
                    inf += Math.exp(-(d * d) / (2 * 42 * 42)) * Math.exp(-t * 0.75);
                }
                inf = Math.min(inf, 1);
                const size = 1.1 + inf * 2.8;
                const a = 0.14 + inf * 0.6;
                const cR = ICE[0] + (EMBER[0] - ICE[0]) * inf;
                const cG = ICE[1] + (EMBER[1] - ICE[1]) * inf;
                const cB = ICE[2] + (EMBER[2] - ICE[2]) * inf;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${cR | 0},${cG | 0},${cB | 0},${a.toFixed(3)})`;
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        if (reduced) {
            // single static frame
            waves = [];
            const now = performance.now();
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (const dot of dots) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 1.1, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(125,224,255,0.14)';
                ctx.fill();
            }
            void now;
        } else {
            draw();
        }

        return () => {
            cancelAnimationFrame(raf);
            clearInterval(ambient);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointerdown', onDown);
        };
    }, [reduced]);

    return <canvas ref={mountRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}
