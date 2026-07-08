import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import KineticText from '../portfolio/KineticText';
import { PROJECTS } from '../portfolio/data';
import { SCENES } from './scenes';

function GalleryCard({ project }) {
    const [imgOk, setImgOk] = useState(true);
    const [fit, setFit] = useState(project.fit || 'cover');

    return (
        <article className="instrument group flex h-[72vh] w-[78vw] shrink-0 flex-col overflow-hidden rounded-lg border border-ice/15 bg-abyss/70 backdrop-blur-md transition-colors duration-500 hover:border-heat/40 sm:w-[64vw] lg:w-[46vw]">
            <div className="relative min-h-0 flex-1 overflow-hidden border-b border-ice/10 bg-void/40">
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
                    <div className="flex h-full items-center justify-center font-display text-3xl text-ice/20">
                        {project.name}
                    </div>
                )}
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(14_100%_59%/0.14),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ mixBlendMode: 'screen' }}
                />
                <div className="absolute bottom-3 left-3 rounded border border-ice/20 bg-void/80 px-3 py-1.5 backdrop-blur-md">
                    <p className="font-serif text-xl font-medium italic text-heat">{project.stat.value}</p>
                    <p className="font-mono text-[9px] tracking-widest text-muted-foreground">{project.stat.label}</p>
                </div>
            </div>
            <div className="p-5 md:p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ice/60">proj://{project.id}</p>
                <h3 className="thermal-text mt-1 inline-block font-display text-2xl font-semibold md:text-3xl" data-hot>
                    <KineticText text={project.name} />
                </h3>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{project.kicker}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-frost/80">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.slice(0, 5).map((tech) => (
                        <span key={tech} className="rounded-full bg-ice/5 px-2.5 py-0.5 font-mono text-[10px] text-ice/70">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}

// Scene 03 — the flight. Vertical scroll becomes lateral motion: the four
// builds sweep past while the field streams by as a particle tunnel.
export default function SceneProjects() {
    const ref = useRef(null);
    const trackRef = useRef(null);
    const [shift, setShift] = useState(1200);
    const { scrollYProgress: sp } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    useEffect(() => {
        const measure = () => {
            if (trackRef.current) {
                setShift(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
            }
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    const x = useTransform(sp, [0.06, 0.94], [0, -shift]);
    const headOpacity = useTransform(sp, [0.01, 0.08, 0.93, 0.99], [0, 1, 1, 0]);

    return (
        <section ref={ref} id="scene-builds" style={{ height: `${SCENES[2].vh}vh` }} className="relative">
            <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
                <motion.div style={{ opacity: headOpacity }} className="absolute left-6 top-20 z-10 md:left-12 md:top-24">
                    <p className="font-mono text-xs tracking-[0.25em] text-ice/80">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
                        scene://03 — builds
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-frost md:text-4xl">
                        Things that <em className="serif-accent">ship</em>
                    </h2>
                </motion.div>

                <motion.div
                    ref={trackRef}
                    style={{ x }}
                    className="relative z-10 mt-16 flex items-center gap-[4vw] pl-[10vw] pr-[12vw]"
                >
                    {PROJECTS.map((project) => (
                        <GalleryCard key={project.id} project={project} />
                    ))}
                    {/* terminal panel: the archive portal */}
                    <div className="flex h-[72vh] w-[60vw] shrink-0 items-center justify-center sm:w-[44vw] lg:w-[30vw]">
                        <Link
                            to="/archive"
                            className="group text-center"
                        >
                            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground">+ 2 more experiments</p>
                            <p className="thermal-text mt-3 font-display text-4xl font-semibold md:text-5xl" data-hot>
                                open the <em className="serif-accent">archive</em>
                            </p>
                            <p className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-ice transition-colors group-hover:text-heat">
                                full lab log <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </p>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
