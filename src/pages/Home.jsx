import { useState } from 'react';
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

    return (
        <div className="grain min-h-screen bg-background font-body text-foreground">
            <BootSequence onDone={() => setBooted(true)} />
            <SynapseField afterHero />
            <ThermalCursor />
            <ScrollProgress />
            <Navigation />
            <main className="relative z-10">
                <HeroSection booted={booted} />
                <ResearchSection />
                <ProjectsSection />
                <ExperienceSection />
                <CredentialsSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
}
