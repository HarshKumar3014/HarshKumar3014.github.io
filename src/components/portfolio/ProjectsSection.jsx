import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import KineticText from './KineticText';
import MagneticButton from './MagneticButton';
import SectionHeader from './SectionHeader';
import { PROJECTS } from './data';
import useReducedMotion from './useReducedMotion';

// Generative fallback while real screenshots aren't dropped in yet
function PlaceholderVisual({ name }) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,hsl(215_45%_10%),hsl(216_56%_5%))]">
            <div className="text-center">
                <p className="font-display text-4xl font-semibold text-ice/20">{name}</p>
                <p className="mt-2 font-mono text-[10px] tracking-widest text-muted-foreground/50">
                    screenshot pending — drop into /public/projects/
                </p>
            </div>
        </div>
    );
}

// Animated 4-node agent pipeline strip (AgentDesk only)
function PipelineStrip({ stages }) {
    return (
        <div className="mt-5 flex items-center gap-0 overflow-x-auto hide-scrollbar" aria-label={`Pipeline: ${stages.join(', ')}`}>
            {stages.map((stage, i) => (
                <div key={stage} className="flex items-center">
                    <span className="whitespace-nowrap rounded-full border border-ice/20 px-3 py-1 font-mono text-[10px] text-ice/80">
                        {stage}
                    </span>
                    {i < stages.length - 1 && (
                        <svg width="34" height="10" className="shrink-0" aria-hidden>
                            <line x1="0" y1="5" x2="34" y2="5" stroke="hsl(190 100% 75% / 0.25)" strokeWidth="1" />
                            <motion.circle
                                r="2"
                                cy="5"
                                cx="0"
                                fill="hsl(14 100% 59%)"
                                initial={{ cx: 0 }}
                                animate={{ cx: [0, 34] }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: i * 0.45 }}
                            />
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );
}

function ProjectCard({ project, index }) {
    const ref = useRef(null);
    const [imgOk, setImgOk] = useState(true);
    // banners (very wide/tall images) letterbox instead of cropping to mush;
    // a project can force it with `fit: 'contain'` in data.js
    const [fit, setFit] = useState(project.fit || 'cover');
    const reduced = useReducedMotion();

    // 3D tilt driven by cursor position over the card
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 200, damping: 22 });
    const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 200, damping: 22 });
    // thermal spotlight follows the cursor over the screenshot
    const spotX = useTransform(px, [0, 1], ['0%', '100%']);
    const spotY = useTransform(py, [0, 1], ['0%', '100%']);

    const onMove = (e) => {
        if (reduced) return;
        const rect = ref.current.getBoundingClientRect();
        px.set((e.clientX - rect.left) / rect.width);
        py.set((e.clientY - rect.top) / rect.height);
    };

    const onLeave = () => {
        px.set(0.5);
        py.set(0.5);
    };

    const flip = index % 2 === 1;

    return (
        <motion.article
            initial={{ opacity: 0, y: 64 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}
        >
            {/* screenshot with tilt + heat spotlight */}
            <div className="min-w-0" style={{ perspective: 1100 }}>
                <motion.div
                    ref={ref}
                    onMouseMove={onMove}
                    onMouseLeave={onLeave}
                    style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformStyle: 'preserve-3d' }}
                    className="instrument group relative aspect-[16/10] overflow-hidden rounded-lg border border-ice/15 bg-abyss"
                    data-hot
                >
                    {imgOk ? (
                        <img
                            src={project.image}
                            alt={`${project.name} screenshot`}
                            className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.04] ${
                                fit === 'contain' ? 'object-contain' : 'object-cover'
                            }`}
                            onError={() => setImgOk(false)}
                            onLoad={(e) => {
                                const r = e.target.naturalWidth / e.target.naturalHeight;
                                if (r > 2.4 || r < 1) setFit('contain');
                            }}
                            loading="lazy"
                        />
                    ) : (
                        <PlaceholderVisual name={project.name} />
                    )}
                    {/* Grad-CAM style thermal spotlight */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                            background: useTransform(
                                [spotX, spotY],
                                ([x, y]) =>
                                    `radial-gradient(280px circle at ${x} ${y}, hsl(14 100% 59% / 0.28), hsl(33 100% 64% / 0.12) 40%, transparent 70%)`
                            ),
                            mixBlendMode: 'screen',
                        }}
                    />
                    {/* stat chip floats above the tilt plane */}
                    <div
                        className="absolute bottom-4 left-4 rounded border border-ice/20 bg-void/80 px-3 py-2 backdrop-blur-md"
                        style={{ transform: 'translateZ(48px)' }}
                    >
                        <p className="font-serif text-2xl font-medium italic text-heat">{project.stat.value}</p>
                        <p className="font-mono text-[10px] tracking-widest text-muted-foreground">{project.stat.label}</p>
                    </div>
                </motion.div>
            </div>

            {/* copy */}
            <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-[0.2em] text-ice/70">proj://{project.id}</p>
                <h3 className="thermal-text mt-3 inline-block font-display text-4xl font-semibold md:text-5xl" data-hot>
                    <KineticText text={project.name} />
                </h3>
                <p className="mt-1 font-mono text-sm text-muted-foreground">{project.kicker}</p>
                <p className="mt-5 max-w-xl leading-relaxed text-frost/85">{project.description}</p>
                {project.pipeline && <PipelineStrip stages={project.pipeline} />}
                <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                        <span key={tech} className="rounded-full bg-ice/5 px-3 py-1 font-mono text-[11px] text-ice/70">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.article>
    );
}

export default function ProjectsSection({ index = '02' }) {
    return (
        <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
            <SectionHeader
                address="axis://projects"
                index={index}
                title="Things that *ship*"
                description="Agent pipelines, red-team tooling and medical vision — built end-to-end, measured, deployed."
            />
            <div className="space-y-24 md:space-y-32">
                {PROJECTS.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className="mt-20 flex justify-center md:mt-28"
            >
                <MagneticButton>
                    <Link
                        to="/archive"
                        className="group inline-flex items-center gap-2 rounded-full border border-ice/25 px-7 py-3 font-mono text-sm text-ice transition-colors duration-300 hover:border-ember hover:text-heat"
                    >
                        browse the full archive
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </MagneticButton>
            </motion.div>
        </section>
    );
}
