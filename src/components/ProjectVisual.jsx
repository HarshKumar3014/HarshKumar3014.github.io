import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/** Small looping diagrams — one per project, showing how the thing works. */

const W = 232
const H = 62

function useStage() {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-5% 0px -5% 0px' })
  const still = useReducedMotion()
  return { ref, play: inView && !still }
}

function Mini({ children, label, stageRef }) {
  return (
    <svg
      ref={stageRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  )
}

const cycle = (play, duration) =>
  play ? { duration, repeat: Infinity, repeatDelay: 0.3, ease: 'easeInOut' } : { duration: 0 }

/* AgentDesk — intake → retrieval → resolution → governance */

const STAGES = ['in', 'ret', 'res', 'gov']
const SX = [24, 82, 140, 198]
const SY = 26

function AgentDeskVisual() {
  const { ref, play } = useStage()
  const dur = 5

  return (
    <Mini stageRef={ref} label="A four-stage agent pipeline with a ticket flowing through intake, retrieval, resolution and governance.">
      <line x1={SX[0]} y1={SY} x2={SX[3]} y2={SY} stroke="var(--line)" strokeWidth="1.5" />
      <motion.line
        x1={SX[0]}
        y1={SY}
        x2={SX[3]}
        y2={SY}
        stroke="var(--lilac)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={play ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
        transition={cycle(play, dur)}
      />

      {SX.map((x, i) => (
        <g key={STAGES[i]}>
          <motion.circle
            cx={x}
            cy={SY}
            r={6}
            fill="var(--bg)"
            stroke="var(--line-strong)"
            strokeWidth="1.5"
            initial={{ stroke: 'var(--line-strong)' }}
            animate={
              play
                ? { stroke: ['var(--line-strong)', 'var(--lilac)', 'var(--lilac)', 'var(--line-strong)'] }
                : { stroke: 'var(--lilac)' }
            }
            transition={{ ...cycle(play, dur), times: [0, 0.1 + i * 0.2, 0.85, 1] }}
          />
          <text x={x} y={SY + 22} textAnchor="middle" className="fill-[var(--faint)] font-mono" fontSize="8">
            {STAGES[i]}
          </text>
        </g>
      ))}

      {/* the ticket travelling the pipeline */}
      <motion.rect
        width={7}
        height={7}
        rx={1.5}
        fill="var(--lilac)"
        initial={{ opacity: 0 }}
        animate={
          play
            ? { x: SX.map((x) => x - 3.5), y: Array(4).fill(SY - 3.5), opacity: [0, 1, 1, 0] }
            : { x: SX[3] - 3.5, y: SY - 3.5, opacity: 1 }
        }
        transition={cycle(play, dur)}
      />

      {/* governance outcome */}
      <motion.text
        x={W - 4}
        y={14}
        textAnchor="end"
        className="fill-[var(--mint)] font-mono"
        fontSize="8"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 1 }}
        transition={{ ...cycle(play, dur), times: [0, 0.72, 0.8, 0.95, 1] }}
      >
        ≥0.6 auto-resolve
      </motion.text>
    </Mini>
  )
}

/* Aegis — concurrent adversarial probes across providers */

const LANES = [14, 26, 38, 50]
const PROBES = 6

function AegisVisual() {
  const { ref, play } = useStage()
  const dur = 4.5

  return (
    <Mini stageRef={ref} label="Parallel adversarial probes streaming across provider lanes into a scoring gate.">
      {LANES.map((y) => (
        <line key={y} x1={10} y1={y} x2={168} y2={y} stroke="var(--line)" strokeWidth="1" />
      ))}

      {LANES.map((y, li) =>
        Array.from({ length: PROBES }).map((_, i) => (
          <motion.rect
            key={`${li}-${i}`}
            y={y - 1.5}
            width={11}
            height={3}
            rx={1.5}
            fill="var(--sky)"
            initial={{ opacity: 0 }}
            animate={play ? { x: [10, 156], opacity: [0, 0.9, 0.9, 0] } : { x: 120, opacity: 0.5 }}
            transition={{
              ...cycle(play, dur),
              delay: play ? (i * dur) / PROBES + li * 0.12 : 0,
              ease: 'linear',
              times: [0, 0.1, 0.85, 1],
            }}
          />
        )),
      )}

      <line x1={172} y1={8} x2={172} y2={56} stroke="var(--line-strong)" strokeWidth="1" />
      <text x={178} y={26} className="fill-[var(--muted)] font-mono" fontSize="8">
        judge
      </text>
      <motion.text
        x={178}
        y={40}
        className="fill-[var(--peach)] font-mono"
        fontSize="11"
        initial={{ opacity: 0.3 }}
        animate={play ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
        transition={cycle(play, dur)}
      >
        70+
      </motion.text>
    </Mini>
  )
}

/* MedVision — three backbones voting into one prediction */

const MODELS = ['B3', 'R50', 'D121']
const MY = [14, 31, 48]

function MedVisionVisual() {
  const { ref, play } = useStage()
  const dur = 5

  return (
    <Mini stageRef={ref} label="Three convolutional backbones merging into one ensemble prediction with a confidence bar.">
      {MY.map((y, i) => (
        <g key={MODELS[i]}>
          <rect x={8} y={y - 6} width={30} height={12} rx={3} fill="var(--panel)" stroke="var(--line-strong)" strokeWidth="1" />
          <text x={23} y={y + 3} textAnchor="middle" className="fill-[var(--muted)] font-mono" fontSize="7.5">
            {MODELS[i]}
          </text>
          <motion.path
            d={`M 40 ${y} C 64 ${y}, 68 31, 92 31`}
            fill="none"
            stroke="var(--mint)"
            strokeWidth="1.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={play ? { pathLength: [0, 1, 1, 0], opacity: [0, 0.9, 0.9, 0] } : { pathLength: 1, opacity: 0.7 }}
            transition={{ ...cycle(play, dur), delay: play ? i * 0.25 : 0 }}
          />
        </g>
      ))}

      <circle cx={97} cy={31} r={5} fill="var(--mint)" />
      <text x={110} y={22} className="fill-[var(--faint)] font-mono" fontSize="8">
        ensemble
      </text>

      <rect x={110} y={29} width={110} height={6} rx={3} fill="var(--line)" />
      <motion.rect
        x={110}
        y={29}
        height={6}
        rx={3}
        fill="var(--mint)"
        initial={{ width: 0 }}
        animate={play ? { width: [0, 105.8, 105.8, 0] } : { width: 105.8 }}
        transition={{ ...cycle(play, dur), times: [0, 0.55, 0.9, 1] }}
      />
      <text x={110} y={48} className="fill-[var(--mint)] font-mono" fontSize="8.5">
        96.22% · &lt;2s
      </text>
    </Mini>
  )
}

const REGISTRY = {
  AgentDesk: AgentDeskVisual,
  Aegis: AegisVisual,
  MedVision: MedVisionVisual,
}

export default function ProjectVisual({ name }) {
  const Vis = REGISTRY[name]
  return Vis ? <Vis /> : null
}
