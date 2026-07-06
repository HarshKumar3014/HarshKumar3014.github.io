import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import SynapseField from '../components/portfolio/SynapseField';
import ThermalCursor from '../components/portfolio/ThermalCursor';
import ScrollProgress from '../components/portfolio/ScrollProgress';
import Footer from '../components/portfolio/Footer';
import { ARCHIVE_PROJECTS } from '../components/portfolio/data';

function ArchiveCard({ project, index }) {
    const [imgOk, setImgOk] = useState(true);
    // banners (very wide/tall images) letterbox instead of cropping to mush
    const [fit, setFit] = useState('cover');

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="instrument group flex flex-col overflow-hidden rounded-lg border border-ice/10 bg-abyss/60 backdrop-blur-sm transition-colors duration-500 hover:border-heat/40"
        >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-ice/10">
                {imgOk ? (
                    <img
                        src={`/projects/${project.id}.png`}
                        alt={`${project.name} screenshot`}
                        className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.05] ${
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
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,hsl(215_45%_10%),hsl(216_56%_5%))]">
                        <div className="px-4 text-center">
                            <p className="font-display text-3xl font-semibold text-ice/20">{project.name}</p>
                            <p className="mt-2 font-mono text-[10px] tracking-widest text-muted-foreground/50">
                                add /public/projects/{project.id}.png
                            </p>
                        </div>
                    </div>
                )}
                {/* heat wash on hover */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(14_100%_59%/0.16),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ mixBlendMode: 'screen' }} />
            </div>

            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="font-mono text-[10px] tracking-[0.2em] text-ice/60">proj://{project.id}</p>
                        <h2 className="mt-1.5 font-display text-2xl font-semibold text-frost transition-colors group-hover:text-heat">
                            {project.name}
                        </h2>
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">{project.kicker}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        {project.links?.github && (
                            <a
                                href={project.links.github}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${project.name} on GitHub`}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-ice/20 text-ice/70 transition-colors hover:border-ember hover:text-heat"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        )}
                        {project.links?.demo && (
                            <a
                                href={project.links.demo}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${project.name} live demo`}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-ice/20 text-ice/70 transition-colors hover:border-ember hover:text-heat"
                            >
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-frost/80">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
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

export default function Archive() {
    return (
        <div className="grain min-h-screen bg-background font-body text-foreground">
            <SynapseField />
            <ThermalCursor />
            <ScrollProgress />

            {/* minimal nav: back to the lab */}
            <nav className="fixed inset-x-0 top-4 z-[85] flex justify-center px-4">
                <div className="flex items-center gap-1 rounded-full border border-ice/10 bg-abyss/70 px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <Link
                        to="/"
                        className="flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-heat"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        back to lab
                    </Link>
                    <span className="rounded-full bg-ice/10 px-3 py-1.5 font-mono text-xs text-frost">archive</span>
                </div>
            </nav>

            <main className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-32 md:pt-40">
                <motion.p
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 font-mono text-xs tracking-[0.25em] text-ice/80"
                >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
                    axis://archive
                </motion.p>
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: '110%' }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-frost sm:text-5xl md:text-6xl"
                    >
                        Every experiment so far
                    </motion.h1>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
                >
                    The complete lab log — {ARCHIVE_PROJECTS.length} projects and counting.
                </motion.p>

                <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
                    {ARCHIVE_PROJECTS.map((project, i) => (
                        <ArchiveCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
