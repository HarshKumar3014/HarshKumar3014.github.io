import { useEffect, useRef, useState } from 'react';
import useReducedMotion from './useReducedMotion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#$&%@01';

// Thermal type: each letter's variable weight tracks cursor distance — cold
// letters sit light, the one under your cursor swells to full heat. With
// decode, letters first scramble into place like DecodeText. Needs the
// variable Clash Display face (wght 200–700). Loop pauses offscreen.
export default function KineticText({ text, delay = 0, speed = 28, decode = false, className = '' }) {
    const reduced = useReducedMotion();
    const chars = text.split('');
    const [out, setOut] = useState(() => (reduced || !decode ? chars : chars.map(() => '')));
    const [done, setDone] = useState(reduced || !decode);
    const [runId, setRunId] = useState(0); // bump to replay the decode (click)
    const wrap = useRef(null);
    const spans = useRef([]);

    // phase 1 (optional): scramble into place, left to right
    useEffect(() => {
        if (reduced || !decode) return;
        if (runId > 0) setDone(false);
        let iteration = 0;
        let timer;
        const tick = () => {
            iteration += 0.5;
            const resolved = Math.floor(iteration);
            setOut(
                chars.map((ch, i) => {
                    if (ch === ' ') return ' ';
                    if (i < resolved) return ch;
                    if (i < resolved + 5) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    return '';
                })
            );
            if (resolved < chars.length) {
                timer = setTimeout(tick, speed);
            } else {
                setDone(true);
            }
        };
        timer = setTimeout(tick, runId === 0 ? delay : 0);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, delay, speed, decode, reduced, runId]);

    // phase 2: cursor-proximity weight (fine pointers only, only while visible)
    useEffect(() => {
        if (!done || reduced) return;
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const cursor = { x: -9999, y: -9999 };
        const onMove = (e) => {
            cursor.x = e.clientX;
            cursor.y = e.clientY;
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        const weights = spans.current.map(() => 600);
        let raf = null;
        let visible = false;
        const loop = () => {
            if (!visible) {
                raf = null;
                return;
            }
            // read all rects first, then write, to avoid layout thrash
            const rects = spans.current.map((el) => el && el.getBoundingClientRect());
            spans.current.forEach((el, i) => {
                if (!el || !rects[i]) return;
                const r = rects[i];
                const dx = cursor.x - (r.left + r.width / 2);
                const dy = cursor.y - (r.top + r.height / 2);
                const t = Math.max(0, 1 - Math.hypot(dx, dy) / 280);
                const target = 490 + t * t * 210; // 490 cold → 700 under cursor
                weights[i] += (target - weights[i]) * 0.16;
                el.style.fontVariationSettings = `'wght' ${weights[i].toFixed(1)}`;
            });
            raf = requestAnimationFrame(loop);
        };
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && raf === null) raf = requestAnimationFrame(loop);
        });
        if (wrap.current) io.observe(wrap.current);

        return () => {
            io.disconnect();
            if (raf !== null) cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
        };
    }, [done, reduced]);

    return (
        <span
            ref={wrap}
            className={`${className}${decode && !reduced ? ' cursor-pointer select-none' : ''}`}
            aria-label={text}
            onClick={decode && !reduced ? () => done && setRunId((n) => n + 1) : undefined}
        >
            {chars.map((ch, i) => (
                <span
                    key={i}
                    ref={(el) => (spans.current[i] = el)}
                    aria-hidden="true"
                    className={ch === ' ' ? undefined : 'inline-block'}
                >
                    {out[i] === ' ' ? ' ' : out[i]}
                </span>
            ))}
        </span>
    );
}
