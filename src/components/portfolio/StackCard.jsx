import { motion } from 'framer-motion';
import { Flame, Bot, Sparkles, Database, Cloud } from 'lucide-react';

// Aceternity-style feature block: the toolbox as an icon constellation with
// a scanning beam. Center icon leads, neighbours shrink outward.
const TOOLS = [
    { Icon: Cloud, label: 'AWS Bedrock', size: 44 },
    { Icon: Bot, label: 'LangGraph agents', size: 56 },
    { Icon: Sparkles, label: 'LLMs', size: 72, lead: true },
    { Icon: Flame, label: 'PyTorch', size: 56 },
    { Icon: Database, label: 'Vector DBs', size: 44 },
];

export default function StackCard({ compact = false }) {
    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            className="instrument group relative overflow-hidden rounded-lg border border-ice/12 bg-void/60 backdrop-blur-sm transition-colors duration-500 hover:border-ice/25"
        >
            {/* scanning beam sweeps behind the icon row */}
            <motion.div
                aria-hidden
                animate={{ x: ['-12%', '112%'] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                className="pointer-events-none absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-ice/70 to-transparent"
                style={{ left: 0 }}
            />
            <motion.div
                aria-hidden
                animate={{ x: ['-12%', '112%'] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-ice/5 to-transparent"
                style={{ left: 0 }}
            />

            <div className={`flex items-center justify-center gap-3 ${compact ? 'pt-8' : 'pt-12'} pb-2`}>
                {TOOLS.map(({ Icon, label, size, lead }, i) => (
                    <motion.div
                        key={label}
                        variants={{
                            rest: { y: 0 },
                            hover: { y: -6, transition: { delay: i * 0.05, type: 'spring', stiffness: 300, damping: 18 } },
                        }}
                        className={`flex items-center justify-center rounded-full border backdrop-blur-md ${
                            lead
                                ? 'border-ember/50 bg-ember/10 shadow-[0_0_28px_hsl(14_100%_59%/0.25)]'
                                : 'border-ice/20 bg-abyss/80'
                        }`}
                        style={{ width: size, height: size }}
                        title={label}
                    >
                        <Icon
                            className="h-1/2 w-1/2"
                            style={{ color: lead ? 'hsl(33 100% 64%)' : 'hsl(190 100% 75% / 0.85)' }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* drifting sparks around the constellation */}
            <motion.span
                aria-hidden
                animate={{ y: [-6, 6, -6], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="pointer-events-none absolute left-[22%] top-10 h-1 w-1 rounded-full bg-ice/70"
            />
            <motion.span
                aria-hidden
                animate={{ y: [5, -7, 5], opacity: [0.15, 0.6, 0.15] }}
                transition={{ duration: 6.5, repeat: Infinity }}
                className="pointer-events-none absolute right-[24%] top-16 h-1 w-1 rounded-full bg-heat/70"
            />

            <div className={compact ? 'p-5 pt-4' : 'p-7 pt-5'}>
                <h3 className="font-display text-xl font-semibold text-frost md:text-2xl">
                    Damn good <em className="serif-accent">stack</em>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Agents, adversarial evals and vision models — the tools behind everything on this page.
                </p>
            </div>
        </motion.div>
    );
}
