import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

// Interactive forward pass: arm every input neuron, then watch the signal
// propagate layer by layer — edges fire, activations light up, the output
// layer settles on a prediction. A tiny feedforward net you can poke.
const LAYERS = [4, 5, 5, 2];
const W = 640;
const H = 340;
const PAD_X = 64;
const PAD_Y = 34;
const STEP = 0.72; // seconds per layer hop

function buildLayout() {
    return LAYERS.map((n, l) => {
        const x = PAD_X + (l / (LAYERS.length - 1)) * (W - PAD_X * 2);
        return Array.from({ length: n }, (_, i) => ({
            x,
            y: PAD_Y + ((i + 0.5) / n) * (H - PAD_Y * 2),
        }));
    });
}
const POS = buildLayout();

export default function NeuralApp() {
    const [pressed, setPressed] = useState([]);
    const [run, setRun] = useState(null); // { id, acts, winner }
    const timer = useRef(null);

    const reset = () => {
        clearTimeout(timer.current);
        setPressed([]);
        setRun(null);
    };

    const start = () => {
        // fake but plausible activations: hidden layers random, output softmax-ish
        const acts = LAYERS.map((n, l) => {
            if (l === 0) return Array(n).fill(1);
            return Array.from({ length: n }, () => 0.3 + Math.random() * 0.7);
        });
        const out = acts[LAYERS.length - 1];
        const winner = out.indexOf(Math.max(...out));
        setRun({ id: Date.now(), acts, winner });
        timer.current = setTimeout(reset, (LAYERS.length - 1) * STEP * 1000 + 3400);
    };

    const press = (i) => {
        if (run) return;
        if (pressed.includes(i)) return;
        const next = [...pressed, i];
        setPressed(next);
        if (next.length === LAYERS[0]) setTimeout(start, 320);
    };

    const status = run
        ? `signal propagated — output ${run.winner + 1} wins`
        : `arm the input layer: ${pressed.length}/${LAYERS[0]}`;

    return (
        <div className="flex h-full min-h-[320px] flex-col">
            <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] text-muted-foreground">{status}</p>
                <button
                    type="button"
                    onClick={reset}
                    aria-label="Reset network"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-ice/20 text-ice/70 transition-colors hover:border-ember hover:text-heat"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded border border-ice/10 bg-void/50">
                <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Feedforward neural network demo">
                    {/* edges */}
                    {POS.slice(0, -1).map((layer, l) =>
                        layer.map((a, i) =>
                            POS[l + 1].map((b, j) => {
                                const lit = run ? run.acts[l][i] * run.acts[l + 1][j] : 0;
                                return (
                                    <motion.line
                                        key={`e-${l}-${i}-${j}${run ? `-${run.id}` : ''}`}
                                        x1={a.x}
                                        y1={a.y}
                                        x2={b.x}
                                        y2={b.y}
                                        initial={{ stroke: 'hsl(190 100% 75% / 0.10)' }}
                                        animate={
                                            run
                                                ? { stroke: `hsl(33 100% 64% / ${(0.08 + lit * 0.45).toFixed(3)})` }
                                                : { stroke: 'hsl(190 100% 75% / 0.10)' }
                                        }
                                        transition={{ delay: run ? l * STEP + 0.3 : 0, duration: 0.4 }}
                                        strokeWidth="1"
                                    />
                                );
                            })
                        )
                    )}

                    {/* travelling pulses, one wave per layer hop */}
                    {run &&
                        POS.slice(0, -1).map((layer, l) =>
                            layer.map((a, i) =>
                                POS[l + 1].map((b, j) => (
                                    <motion.circle
                                        key={`p-${run.id}-${l}-${i}-${j}`}
                                        r="2.2"
                                        fill="hsl(14 100% 59%)"
                                        initial={{ cx: a.x, cy: a.y, opacity: 0 }}
                                        animate={{ cx: [a.x, b.x], cy: [a.y, b.y], opacity: [0, 0.9, 0] }}
                                        transition={{ delay: l * STEP, duration: STEP * 0.75, ease: 'easeIn' }}
                                    />
                                ))
                            )
                        )}

                    {/* neurons */}
                    {POS.map((layer, l) =>
                        layer.map((p, i) => {
                            const isInput = l === 0;
                            const isOutput = l === LAYERS.length - 1;
                            const armed = isInput && pressed.includes(i);
                            const act = run ? run.acts[l][i] : 0;
                            const isWinner = run && isOutput && i === run.winner;
                            const litDelay = l * STEP + STEP * 0.6;

                            return (
                                <g
                                    key={`n-${l}-${i}`}
                                    onClick={isInput ? () => press(i) : undefined}
                                    data-input={isInput ? i : undefined}
                                    className={isInput && !run ? 'cursor-pointer' : undefined}
                                    role={isInput ? 'button' : undefined}
                                    aria-label={isInput ? `Input neuron ${i + 1}` : undefined}
                                >
                                    {/* halo */}
                                    <motion.circle
                                        cx={p.x}
                                        cy={p.y}
                                        r="19"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: armed ? 0.25 : run && !isInput ? [0, act * 0.35] : 0,
                                            fill: isWinner ? 'hsl(14 100% 59%)' : 'hsl(190 100% 75%)',
                                        }}
                                        transition={{ delay: run && !isInput ? litDelay : 0, duration: 0.45 }}
                                    />
                                    <motion.circle
                                        cx={p.x}
                                        cy={p.y}
                                        r="12"
                                        strokeWidth="1.5"
                                        initial={{ fill: 'hsl(215 45% 10%)', stroke: 'hsl(190 100% 75% / 0.4)' }}
                                        animate={
                                            armed
                                                ? { fill: 'hsl(190 100% 75%)', stroke: 'hsl(190 100% 75%)', scale: [1, 1.25, 1] }
                                                : run && !isInput
                                                  ? {
                                                        fill: isWinner
                                                            ? 'hsl(14 100% 59%)'
                                                            : `hsl(190 100% 75% / ${(0.12 + act * 0.8).toFixed(3)})`,
                                                        stroke: isWinner ? 'hsl(14 100% 59%)' : 'hsl(190 100% 75% / 0.6)',
                                                        scale: isWinner ? [1, 1.35, 1.15] : 1,
                                                    }
                                                  : { fill: 'hsl(215 45% 10%)', stroke: 'hsl(190 100% 75% / 0.4)' }
                                        }
                                        transition={{ delay: run && !isInput ? litDelay : 0, duration: 0.45 }}
                                        style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                                    />
                                    {/* input press hint rings */}
                                    {isInput && !armed && !run && (
                                        <motion.circle
                                            cx={p.x}
                                            cy={p.y}
                                            r="16"
                                            fill="none"
                                            stroke="hsl(190 100% 75% / 0.35)"
                                            animate={{ r: [14, 19], opacity: [0.5, 0] }}
                                            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
                                        />
                                    )}
                                </g>
                            );
                        })
                    )}
                </svg>

                {/* layer captions */}
                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 flex justify-between px-8 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
                    <span>input</span>
                    <span>hidden</span>
                    <span>hidden</span>
                    <span>output</span>
                </div>
            </div>
        </div>
    );
}
