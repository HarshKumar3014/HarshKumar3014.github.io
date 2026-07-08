import { User, FlaskConical, Hammer, ScrollText, Mail, TerminalSquare, Share2 } from 'lucide-react';
import { CorePanel, ResearchPanel, BuildsPanel, LogPanel, ContactPanel } from '../world/WorldPanels';
import Terminal from './Terminal';
import NeuralApp from './NeuralApp';

// harshOS app registry. Window geometry is the launch default; the user
// drags them wherever after that.
export const APPS = [
    {
        id: 'about',
        title: 'about.app',
        Icon: User,
        tint: 'hsl(190 100% 75%)',
        w: 560,
        h: 520,
        Body: CorePanel,
    },
    {
        id: 'research',
        title: 'research.app',
        Icon: FlaskConical,
        tint: 'hsl(190 100% 75%)',
        w: 620,
        h: 640,
        Body: ResearchPanel,
    },
    {
        id: 'builds',
        title: 'builds.app',
        Icon: Hammer,
        tint: 'hsl(14 100% 59%)',
        w: 620,
        h: 660,
        Body: BuildsPanel,
    },
    {
        id: 'log',
        title: 'field-log.app',
        Icon: ScrollText,
        tint: 'hsl(33 100% 64%)',
        w: 640,
        h: 640,
        Body: LogPanel,
    },
    {
        id: 'contact',
        title: 'contact.app',
        Icon: Mail,
        tint: 'hsl(14 100% 59%)',
        w: 520,
        h: 480,
        Body: ContactPanel,
    },
    {
        id: 'neural',
        title: 'neural.app',
        Icon: Share2,
        tint: 'hsl(190 100% 75%)',
        w: 600,
        h: 480,
        Body: NeuralApp,
    },
    {
        id: 'terminal',
        title: 'harsh@lab: ~',
        Icon: TerminalSquare,
        tint: '#34d399',
        w: 640,
        h: 440,
        Body: Terminal,
    },
];

export const appById = (id) => APPS.find((a) => a.id === id);
