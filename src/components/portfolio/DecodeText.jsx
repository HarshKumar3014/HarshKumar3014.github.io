import { useEffect, useRef, useState } from 'react';
import useReducedMotion from './useReducedMotion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#$&%@01';

// Scrambles glyphs into place, left to right, like weights resolving.
export default function DecodeText({ text, className = '', delay = 0, speed = 28, as: Tag = 'span' }) {
    const [output, setOutput] = useState('');
    const [started, setStarted] = useState(false);
    const frame = useRef(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced) {
            setOutput(text);
            return;
        }
        const t = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(t);
    }, [delay, text, reduced]);

    useEffect(() => {
        if (!started) return;
        let iteration = 0;
        const total = text.length;

        const tick = () => {
            iteration += 0.5;
            const resolved = Math.floor(iteration);
            let out = '';
            for (let i = 0; i < total; i++) {
                if (text[i] === ' ') {
                    out += ' ';
                } else if (i < resolved) {
                    out += text[i];
                } else if (i < resolved + 5) {
                    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                }
            }
            setOutput(out);
            if (resolved < total) {
                frame.current = setTimeout(tick, speed);
            } else {
                setOutput(text);
            }
        };
        tick();
        return () => clearTimeout(frame.current);
    }, [started, text, speed]);

    return <Tag className={className} aria-label={text}>{output || ' '}</Tag>;
}
