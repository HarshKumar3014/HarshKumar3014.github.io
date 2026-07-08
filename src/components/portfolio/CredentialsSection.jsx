import { motion } from 'framer-motion';
import { Award, BadgeCheck } from 'lucide-react';
import SectionHeader from './SectionHeader';
import StackCard from './StackCard';
import { CREDENTIALS } from './data';

export default function CredentialsSection() {
    return (
        <section id="credentials" className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
            <SectionHeader
                address="axis://credentials"
                index="04"
                title="*Receipts*"
                description="Awards and certifications, verified and stamped."
            />
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7 }}
                className="mb-10"
            >
                <StackCard />
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2">
                {CREDENTIALS.map((cred, i) => (
                    <motion.div
                        key={cred.label}
                        initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.55, delay: (i % 4) * 0.08 }}
                        className="group flex items-center gap-4 rounded-lg border border-ice/10 bg-abyss/50 px-5 py-4 transition-colors duration-300 hover:border-heat/40 hover:bg-ember/5"
                        data-hot
                    >
                        {cred.kind === 'award' ? (
                            <Award className="h-4 w-4 shrink-0 text-heat transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                        ) : (
                            <BadgeCheck className="h-4 w-4 shrink-0 text-ice/70 transition-transform duration-300 group-hover:scale-110 group-hover:text-heat" />
                        )}
                        <p className="text-sm text-frost/90">
                            {cred.label}
                            {cred.tag && (
                                <span className="ml-2 rounded bg-ember/15 px-1.5 py-0.5 font-mono text-[11px] font-bold text-heat">
                                    {cred.tag}
                                </span>
                            )}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
