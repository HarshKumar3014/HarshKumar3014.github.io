import { useState } from 'react';
import BootSequence from '../components/portfolio/BootSequence';
import ThermalCursor from '../components/portfolio/ThermalCursor';
import CinemaField from '../components/cinema/CinemaField';
import SceneHUD from '../components/cinema/SceneHUD';
import SceneGenesis from '../components/cinema/SceneGenesis';
import SceneResearch from '../components/cinema/SceneResearch';
import SceneProjects from '../components/cinema/SceneProjects';
import SceneTimeline from '../components/cinema/SceneTimeline';
import SceneContact from '../components/cinema/SceneContact';

// The scroll-cinema cut of the portfolio: one continuous descent through a
// particle universe. Scene order: signal → research → builds → log → contact.
export default function Cinema() {
    const [, setBooted] = useState(false);

    return (
        <div className="grain min-h-screen bg-background font-body text-foreground">
            <BootSequence onDone={() => setBooted(true)} />
            <CinemaField />
            <ThermalCursor />
            <SceneHUD />
            <main className="relative">
                <SceneGenesis />
                <SceneResearch />
                <SceneProjects />
                <SceneTimeline />
                <SceneContact />
            </main>
        </div>
    );
}
