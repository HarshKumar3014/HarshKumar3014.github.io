import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import KineticText from '../portfolio/KineticText';
import accentify from '../portfolio/accents';
import { ChronoceptCurve, PermafrostDetonator } from '../portfolio/ResearchSection';
import { PUBLICATIONS } from '../portfolio/data';
import { SCENES } from './scenes';

function PaperPanel({ pub, sp, enter, exit, children }) {
    const opacity = useTransform(sp, [enter, enter + 0.08, exit, exit + 0.07], [0, 1, 1, 0]);
    const x = useTransform(sp, [enter, enter + 0.1, exit, exit + 0.07], [120, 0, 0, -90]);
    const rotateY = useTransform(sp, [enter, enter + 0.1], [24, 0]);
    const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? 'auto' : 'none'));

    return (
        <motion.article
            style={{ opacity, x, rotateY, transformPerspective: 1200, pointerEvents }}
            className="instrument mx-auto max-w-3xl rounded-lg border border-ice/15 bg-abyss/75 p-6 backdrop-blur-md md:p-9"
        >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[11px] tracking-[0.2em] text-ice/70">paper://{pub.id}</p>
                <span
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-widest ${
                        pub.status === 'ACCEPTED'
                            ? 'border-ice/40 text-ice'
                            : 'border-heat/50 text-heat'
                    }`}
                >
                    {pub.status} · {pub.venue}
                </span>
            </div>
            <h3 className="font-display text-3xl font-semibold text-frost md:text-4xl">
                <KineticText text={pub.title} />
            </h3>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{pub.subtitle}</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-frost/85">
                {accentify(pub.summary, 'soft')}
            </p>
            <div className="mt-5">{children}</div>
            {pub.link && (
                <a
                    href={pub.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-ice transition-colors hover:text-heat"
                >
                    read the paper <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
            )}
        </motion.article>
    );
}

// Scene 02 — inside the network. The field is now a rotating brain-globe and
// the two papers fly through like orbiting instruments.
export default function SceneResearch() {
    const ref = useRef(null);
    const { scrollYProgress: sp } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    const headOpacity = useTransform(sp, [0.02, 0.1, 0.9, 0.97], [0, 1, 1, 0]);

    return (
        <section ref={ref} id="scene-research" style={{ height: `${SCENES[1].vh}vh` }} className="relative">
            <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: 1200 }}>
                <motion.div style={{ opacity: headOpacity }} className="absolute left-6 top-20 z-10 md:left-12 md:top-24">
                    <p className="font-mono text-xs tracking-[0.25em] text-ice/80">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
                        scene://02 — research
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-frost md:text-4xl">
                        Published <em className="serif-accent">research</em>
                    </h2>
                </motion.div>

                <div className="relative z-10 h-full">
                    <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-6">
                        <PaperPanel pub={PUBLICATIONS[0]} sp={sp} enter={0.08} exit={0.42}>
                            <ChronoceptCurve />
                        </PaperPanel>
                    </div>
                    <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-6">
                        <PaperPanel pub={PUBLICATIONS[1]} sp={sp} enter={0.52} exit={0.88}>
                            <PermafrostDetonator />
                        </PaperPanel>
                    </div>
                </div>
            </div>
        </section>
    );
}
