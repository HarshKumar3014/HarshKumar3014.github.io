import { Link } from 'react-router-dom';
import { Shuffle } from 'lucide-react';

// Floating escape hatch back to the interface chooser. `phosphor` restyles
// it for harshOS.
export default function ModeChip({ phosphor = false }) {
    return (
        <Link
            to="/"
            className={`fixed bottom-5 right-5 z-[96] flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] backdrop-blur-md transition-colors ${
                phosphor
                    ? 'border-[#57ffa3]/25 bg-black/60 text-[#8dffc5] hover:border-[#ffb347] hover:text-[#ffb347]'
                    : 'border-ice/20 bg-abyss/70 text-ice/80 hover:border-ember hover:text-heat'
            }`}
            data-hot
        >
            <Shuffle className="h-3.5 w-3.5" />
            switch interface
        </Link>
    );
}
