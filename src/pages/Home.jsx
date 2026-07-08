import { useState } from 'react';
import { motion } from 'framer-motion';
import BootSequence from '../components/portfolio/BootSequence';
import SynapseField from '../components/portfolio/SynapseField';
import ThermalCursor from '../components/portfolio/ThermalCursor';
import ScrollProgress from '../components/portfolio/ScrollProgress';
import Navigation from '../components/portfolio/Navigation';
import HeroSection from '../components/portfolio/HeroSection';
import ResearchSection from '../components/portfolio/ResearchSection';
import ProjectsSection from '../components/portfolio/ProjectsSection';
import ExperienceSection from '../components/portfolio/ExperienceSection';
import CredentialsSection from '../components/portfolio/CredentialsSection';
import ContactSection from '../components/portfolio/ContactSection';
import Footer from '../components/portfolio/Footer';

export default function Home() {
    const [booted, setBooted] = useState(false);
    // visitor persona: researcher-first (default) or developer-first ordering
    const [mode, setMode] = useState(() => {
        try {
            return localStorage.getItem('visitor-mode');
        } catch {
            return null;
        }
    });

    const pickMode = (m) => {
        setMode(m);
        try {
            localStorage.setItem('visitor-mode', m);
        } catch {
            /* private mode */
        }
    };

    const developerFirst = mode === 'developer';

    return (
        <div className="grain min-h-screen bg-background font-body text-foreground">
            <BootSequence onDone={() => setBooted(true)} />
            <SynapseField afterHero />
            <ThermalCursor />
            <ScrollProgress />
            <Navigation />
            <main className="relative z-10">
                <HeroSection booted={booted} mode={mode} onMode={pickMode} />
                {/* keyed on mode so the reorder crossfades instead of jumping */}
                <motion.div
                    key={mode || 'default'}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {developerFirst ? (
                        <>
                            <ProjectsSection index="01" />
                            <ResearchSection index="02" />
                        </>
                    ) : (
                        <>
                            <ResearchSection index="01" />
                            <ProjectsSection index="02" />
                        </>
                    )}
                </motion.div>
                <ExperienceSection />
                <CredentialsSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
}
