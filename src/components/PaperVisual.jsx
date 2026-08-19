import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * One bespoke animation per paper, each showing the paper's actual claim.
 * Runs only while on screen, loops slowly, and collapses to a static final
 * frame when the visitor prefers reduced motion.
 */

const VB = { w: 360, h: 208 }

function useStage() {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-10% 0px -10% 0px' })
  const still = useReducedMotion()
  return { ref, play: inView && !still, still }
}

function Panel({ children, label, caption, stageRef }) {
  return (
    <figure ref={stageRef} className="rounded-xl border border-line bg-panel p-3">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="w-full"
        role="img"
        aria-label={label}
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
      {caption && (
        <figcaption className="mt-1 px-1 font-mono text-[10.5px] leading-relaxed text-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// same loop shape everywhere: hold, run, hold, restart
const loop = (play, duration, times) =>
  play
    ? { duration, times, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }
    : { duration: 0 }

/* ------------------------------------------------------------------ */
/* LoCoT — the reasoning lock-in point                                 */
/* ------------------------------------------------------------------ */

const PER_ROW = 18
const ROWS_L = 3
const N_TOK = PER_ROW * ROWS_L
const LOCK_I = 34 // ~63% of the trace; everything after is post-commitment
const PITCH = 18.2
const T_W = 8
const T_X0 = 18
const ROW_Y = [56, 98, 140] // row baselines
const tokX = (i) => T_X0 + (i % PER_ROW) * PITCH
const tokRow = (i) => Math.floor(i / PER_ROW)

const tokH = Array.from({ length: N_TOK }, (_, i) => {
  const n = Math.sin(i * 12.9898) * 43758.5453
  const r = n - Math.floor(n)
  return (10 + r * 18) * (i < LOCK_I ? 1 : 0.6)
})

const LOCK_X = tokX(LOCK_I) - 5
const LOCK_ROW = tokRow(LOCK_I)
const CY_L = 8.5

export function LoCoTVisual() {
  const { ref, play } = useStage()

  return (
    <Panel
      stageRef={ref}
      label="A wrapped strip of reasoning tokens. Tokens before the lock-in point determine the answer; everything after is discarded, cutting cost without losing accuracy."
      caption="Lock-in splits a trace into what decides the answer and what only costs money."
    >
      <text x={14} y={22} className="fill-[var(--muted)] font-mono" fontSize="10">
        reasoning trace
      </text>
      <text x={VB.w - 14} y={22} textAnchor="end" className="fill-[var(--faint)] font-mono" fontSize="10">
        54 tokens
      </text>

      {ROW_Y.map((y) => (
        <line key={y} x1={14} y1={y} x2={VB.w - 14} y2={y} stroke="var(--line)" strokeWidth="1" />
      ))}

      {tokH.map((h, i) => {
        const dead = i >= LOCK_I
        const y0 = ROW_Y[tokRow(i)]
        const arrive = 0.06 + (i / N_TOK) * 0.36
        return (
          <motion.rect
            key={i}
            x={tokX(i)}
            width={T_W}
            rx={2}
            fill={dead ? 'var(--faint)' : 'var(--lilac)'}
            initial={{ y: y0, height: 0, opacity: 0 }}
            animate={
              play
                ? {
                    y: [y0, y0 - h, y0 - h, y0 - h, y0 - h],
                    height: [0, h, h, h, h],
                    opacity: dead ? [0, 0.85, 0.85, 0.18, 0.18] : [0, 1, 1, 1, 1],
                  }
                : { y: y0 - h, height: h, opacity: dead ? 0.18 : 1 }
            }
            transition={loop(play, CY_L, [0, arrive, 0.5, 0.6, 1])}
          />
        )
      })}

      {/* generation head sweeping row by row */}
      <motion.rect
        width={2}
        height={30}
        rx={1}
        fill="var(--lilac)"
        initial={{ opacity: 0 }}
        animate={
          play
            ? {
                x: [T_X0, T_X0 + (PER_ROW - 1) * PITCH, T_X0, T_X0 + (PER_ROW - 1) * PITCH, T_X0, LOCK_X, LOCK_X],
                y: [
                  ROW_Y[0] - 30,
                  ROW_Y[0] - 30,
                  ROW_Y[1] - 30,
                  ROW_Y[1] - 30,
                  ROW_Y[2] - 30,
                  ROW_Y[2] - 30,
                  ROW_Y[2] - 30,
                ],
                opacity: [0.45, 0.45, 0.45, 0.45, 0.45, 0, 0],
              }
            : { opacity: 0 }
        }
        transition={loop(play, CY_L, [0.06, 0.2, 0.21, 0.34, 0.35, 0.46, 1])}
      />

      {/* lock-in marker */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1, 1] } : { opacity: 1 }}
        transition={loop(play, CY_L, [0, 0.46, 0.56, 0.92, 1])}
      >
        <line
          x1={LOCK_X}
          y1={ROW_Y[LOCK_ROW] - 30}
          x2={LOCK_X}
          y2={ROW_Y[LOCK_ROW] + 4}
          stroke="var(--ink)"
          strokeWidth="1.25"
          strokeDasharray="3 3"
        />
        <circle cx={LOCK_X} cy={ROW_Y[LOCK_ROW] - 30} r={2.6} fill="var(--ink)" />
        <text
          x={LOCK_X - 6}
          y={ROW_Y[LOCK_ROW] - 34}
          textAnchor="end"
          className="fill-[var(--ink)] font-mono"
          fontSize="9.5"
        >
          lock-in
        </text>
      </motion.g>

      {/* cost comparison */}
      <text x={14} y={166} className="fill-[var(--faint)] font-mono" fontSize="9">
        full trace
      </text>
      <rect x={78} y={159} width={230} height={7} rx={3.5} fill="var(--line)" />
      <motion.rect
        x={78}
        y={159}
        height={7}
        rx={3.5}
        fill="var(--faint)"
        initial={{ width: 0 }}
        animate={play ? { width: [0, 0, 230, 230] } : { width: 230 }}
        transition={loop(play, CY_L, [0, 0.46, 0.62, 1])}
      />
      <motion.text
        x={314}
        y={166}
        className="fill-[var(--faint)] font-mono"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1] } : { opacity: 1 }}
        transition={loop(play, CY_L, [0, 0.56, 0.66, 1])}
      >
        100%
      </motion.text>

      <text x={14} y={188} className="fill-[var(--muted)] font-mono" fontSize="9">
        early stop
      </text>
      <rect x={78} y={181} width={230} height={7} rx={3.5} fill="var(--line)" />
      <motion.rect
        x={78}
        y={181}
        height={7}
        rx={3.5}
        fill="var(--lilac)"
        initial={{ width: 0 }}
        animate={play ? { width: [0, 0, 144.7, 144.7] } : { width: 144.7 }}
        transition={loop(play, CY_L, [0, 0.52, 0.68, 1])}
      />
      <motion.text
        x={314}
        y={188}
        className="fill-[var(--lilac)] font-mono"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1] } : { opacity: 1 }}
        transition={loop(play, CY_L, [0, 0.62, 0.72, 1])}
      >
        62.9%
      </motion.text>

      <motion.text
        x={VB.w / 2}
        y={205}
        textAnchor="middle"
        className="fill-[var(--muted)] font-mono"
        fontSize="9.5"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1] } : { opacity: 1 }}
        transition={loop(play, CY_L, [0, 0.7, 0.8, 1])}
      >
        37.1% fewer tokens · 88.9% accuracy kept
      </motion.text>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
/* PermaFrost — dormant landmines seeded across a pretraining corpus   */
/* ------------------------------------------------------------------ */

const COLS = 15
const ROWS_P = 4
const GX = 22
const GY = 17
const OX = 24
const OY = 38
const nX = (c) => OX + c * GX
const nY = (r) => OY + r * GY

const SEEDS = [
  [1, 1],
  [5, 3],
  [10, 0],
  [13, 2],
]
const TARGET = [7, 1]

const routes = SEEDS.map(([c, r]) => {
  const midC = Math.round((c + TARGET[0]) / 2)
  return `M ${nX(c)} ${nY(r)} L ${nX(midC)} ${nY(r)} L ${nX(midC)} ${nY(TARGET[1])} L ${nX(TARGET[0])} ${nY(TARGET[1])}`
})

const OUT_N = 12
const OUT_X0 = 92
const OUT_PITCH = 20
const CY_P = 10

export function PermaFrostVisual() {
  const { ref, play } = useStage()

  return (
    <Panel
      stageRef={ref}
      label="A lattice of pretraining documents. Diffuse poisoned seeds propagate through the corpus into one dormant node, which stays silent until a trigger prompt flips the model's response."
      caption="Diffuse seeds → one dormant node → clean behaviour until the trigger fires."
    >
      <text x={14} y={22} className="fill-[var(--muted)] font-mono" fontSize="10">
        pretraining corpus
      </text>

      {Array.from({ length: ROWS_P }).map((_, r) =>
        Array.from({ length: COLS }).map((_, c) => {
          const skip =
            SEEDS.some(([sc, sr]) => sc === c && sr === r) || (TARGET[0] === c && TARGET[1] === r)
          if (skip) return null
          return <circle key={`${c}-${r}`} cx={nX(c)} cy={nY(r)} r={1.5} fill="var(--line-strong)" />
        }),
      )}

      {routes.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="var(--sky)"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            play
              ? { pathLength: [0, 0, 1, 1, 1], opacity: [0, 0.8, 0.8, 0.4, 0.4] }
              : { pathLength: 1, opacity: 0.4 }
          }
          transition={loop(play, CY_P, [0, 0.08 + i * 0.02, 0.36 + i * 0.02, 0.5, 1])}
        />
      ))}

      {SEEDS.map(([c, r], i) => (
        <g key={`s-${i}`}>
          <motion.circle
            cx={nX(c)}
            cy={nY(r)}
            r={2.8}
            fill="var(--peach)"
            initial={{ opacity: 0 }}
            animate={play ? { opacity: [0, 1, 1] } : { opacity: 1 }}
            transition={loop(play, CY_P, [0, 0.07 + i * 0.02, 1])}
          />
          <motion.circle
            cx={nX(c)}
            cy={nY(r)}
            r={2.8}
            fill="none"
            stroke="var(--peach)"
            strokeWidth="0.9"
            initial={{ scale: 1, opacity: 0 }}
            animate={play ? { scale: [1, 3, 3], opacity: [0.7, 0, 0] } : { opacity: 0 }}
            transition={loop(play, CY_P, [0.06 + i * 0.02, 0.24 + i * 0.02, 1])}
            style={{ transformOrigin: `${nX(c)}px ${nY(r)}px` }}
          />
        </g>
      ))}

      {/* dormant node */}
      <motion.circle
        cx={nX(TARGET[0])}
        cy={nY(TARGET[1])}
        r={3.4}
        initial={{ fill: 'var(--line-strong)' }}
        animate={
          play
            ? { fill: ['var(--line-strong)', 'var(--line-strong)', 'var(--lilac)', 'var(--lilac)'] }
            : { fill: 'var(--lilac)' }
        }
        transition={loop(play, CY_P, [0, 0.42, 0.52, 1])}
      />
      <motion.circle
        cx={nX(TARGET[0])}
        cy={nY(TARGET[1])}
        r={5}
        fill="none"
        stroke="var(--lilac)"
        strokeWidth="1.1"
        initial={{ scale: 1, opacity: 0 }}
        animate={play ? { scale: [1, 2.4, 2.4], opacity: [0.9, 0, 0] } : { opacity: 0 }}
        transition={loop(play, CY_P, [0.46, 0.6, 1])}
        style={{ transformOrigin: `${nX(TARGET[0])}px ${nY(TARGET[1])}px` }}
      />
      <motion.text
        x={nX(TARGET[0])}
        y={nY(TARGET[1]) - 9}
        textAnchor="middle"
        className="fill-[var(--lilac)] font-mono"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1, 0.35, 0.35] } : { opacity: 0.35 }}
        transition={loop(play, CY_P, [0, 0.5, 0.58, 0.66, 0.74, 1])}
      >
        dormant
      </motion.text>

      <line x1={14} y1={124} x2={VB.w - 14} y2={124} stroke="var(--line)" strokeWidth="1" />

      <text x={14} y={144} className="fill-[var(--muted)] font-mono" fontSize="10">
        inference
      </text>

      <text x={14} y={168} className="fill-[var(--faint)] font-mono" fontSize="9">
        prompt
      </text>
      <motion.rect
        x={54}
        y={160}
        width={26}
        height={10}
        rx={2}
        initial={{ fill: 'var(--line-strong)' }}
        animate={
          play
            ? { fill: ['var(--line-strong)', 'var(--line-strong)', 'var(--peach)', 'var(--peach)'] }
            : { fill: 'var(--peach)' }
        }
        transition={loop(play, CY_P, [0, 0.64, 0.7, 1])}
      />
      <motion.text
        x={67}
        y={183}
        textAnchor="middle"
        className="fill-[var(--peach)] font-mono"
        fontSize="8.5"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1] } : { opacity: 1 }}
        transition={loop(play, CY_P, [0, 0.66, 0.74, 1])}
      >
        trigger
      </motion.text>

      {/* response tokens flipping benign → poisoned */}
      {Array.from({ length: OUT_N }).map((_, i) => {
        const flipAt = 0.72 + i * 0.014
        return (
          <motion.rect
            key={i}
            x={OUT_X0 + i * OUT_PITCH}
            y={160}
            width={13}
            height={10}
            rx={2}
            initial={{ fill: 'var(--mint)', opacity: 0 }}
            animate={
              play
                ? {
                    opacity: [0, 0.9, 0.9, 0.9, 0.9],
                    fill: ['var(--mint)', 'var(--mint)', 'var(--mint)', 'var(--rose)', 'var(--rose)'],
                  }
                : { opacity: 0.9, fill: 'var(--rose)' }
            }
            transition={loop(play, CY_P, [0, 0.12, flipAt, flipAt + 0.03, 1])}
          />
        )
      })}
      <motion.text
        x={VB.w - 14}
        y={200}
        textAnchor="end"
        className="fill-[var(--rose)] font-mono"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1] } : { opacity: 1 }}
        transition={loop(play, CY_P, [0, 0.78, 0.86, 1])}
      >
        behaviour flips · evals stay clean
      </motion.text>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
/* Chronocept — temporal validity as a continuous distribution         */
/* ------------------------------------------------------------------ */

const PX0 = 26
const PX1 = VB.w - 26
const PY0 = 46
const PY1 = 150

const skewNormal = (x, xi, omega, alpha) => {
  const z = (x - xi) / omega
  const phi = Math.exp(-0.5 * z * z)
  // logistic stand-in for the normal CDF; the shape is what matters here
  const cdf = 1 / (1 + Math.exp(-1.702 * alpha * z))
  return 2 * phi * cdf
}

function curve(xi, omega, alpha, samples = 90) {
  const pts = []
  let peak = 0
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const v = skewNormal(t, xi, omega, alpha)
    peak = Math.max(peak, v)
    pts.push([t, v])
  }
  return pts.map(([t, v]) => [PX0 + t * (PX1 - PX0), PY1 - (v / peak) * (PY1 - PY0)])
}

const toPath = (pts) =>
  pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')

const MAIN = curve(0.3, 0.24, 4)
const GHOST = curve(0.62, 0.3, 1.4)
const MAIN_D = toPath(MAIN)
const AREA_D = `${MAIN_D} L ${PX1} ${PY1} L ${PX0} ${PY1} Z`
const MARK = Array.from({ length: 26 }, (_, i) => MAIN[Math.round((i / 25) * (MAIN.length - 1))])
const PEAK = MAIN.reduce((a, p) => (p[1] < a[1] ? p : a), MAIN[0])
const CY_C = 10

export function ChronoceptVisual() {
  const { ref, play } = useStage()

  return (
    <Panel
      stageRef={ref}
      label="A skew-normal curve showing the probability that a fact stays true over time, with a marker travelling from onset through peak validity into decay."
      caption="Validity as a distribution over time, not a true/false label."
    >
      <text x={14} y={22} className="fill-[var(--muted)] font-mono" fontSize="10">
        P(still true)
      </text>
      <text x={VB.w - 14} y={22} textAnchor="end" className="fill-[var(--faint)] font-mono" fontSize="10">
        skew-normal (ξ, ω, α)
      </text>

      <line x1={PX0} y1={PY1} x2={PX1} y2={PY1} stroke="var(--line)" strokeWidth="1" />

      <motion.path
        d={AREA_D}
        fill="var(--mint-soft)"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0.95, 0.95, 0.95] } : { opacity: 0.95 }}
        transition={loop(play, CY_C, [0, 0.34, 0.9, 1])}
      />

      <path d={toPath(GHOST)} fill="none" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="3 4" />
      <text x={PX1 - 4} y={PY0 + 52} textAnchor="end" className="fill-[var(--faint)] font-mono" fontSize="8.5">
        another fact
      </text>

      <motion.path
        d={MAIN_D}
        fill="none"
        stroke="var(--mint)"
        strokeWidth="1.9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={play ? { pathLength: [0, 1, 1, 1] } : { pathLength: 1 }}
        transition={loop(play, CY_C, [0, 0.32, 0.95, 1])}
      />

      <motion.g
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1] } : { opacity: 1 }}
        transition={loop(play, CY_C, [0, 0.3, 0.4, 1])}
      >
        <line
          x1={PEAK[0]}
          y1={PEAK[1]}
          x2={PEAK[0]}
          y2={PY1}
          stroke="var(--mint)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <text x={PEAK[0] + 5} y={PEAK[1] - 4} className="fill-[var(--mint)] font-mono" fontSize="9">
          peak validity
        </text>
      </motion.g>

      <motion.circle
        r={4}
        fill="var(--bg)"
        stroke="var(--mint)"
        strokeWidth="2"
        initial={{ cx: MARK[0][0], cy: MARK[0][1], opacity: 0 }}
        animate={
          play
            ? {
                cx: MARK.map((p) => p[0]),
                cy: MARK.map((p) => p[1]),
                opacity: [0, 1, ...Array(MARK.length - 3).fill(1), 0],
              }
            : { cx: MARK[10][0], cy: MARK[10][1], opacity: 1 }
        }
        transition={play ? { duration: CY_C, ease: 'linear', repeat: Infinity } : { duration: 0 }}
      />

      <text x={PX0} y={PY1 + 15} className="fill-[var(--faint)] font-mono" fontSize="9">
        t₀
      </text>
      <text x={PX1} y={PY1 + 15} textAnchor="end" className="fill-[var(--faint)] font-mono" fontSize="9">
        time →
      </text>
      <text x={VB.w / 2} y={PY1 + 44} textAnchor="middle" className="fill-[var(--muted)] font-mono" fontSize="9.5">
        1,700+ samples · 84–89% agreement
      </text>
    </Panel>
  )
}

const REGISTRY = {
  locot: LoCoTVisual,
  permafrost: PermaFrostVisual,
  chronocept: ChronoceptVisual,
}

export default function PaperVisual({ id }) {
  const Vis = REGISTRY[id]
  return Vis ? <Vis /> : null
}
