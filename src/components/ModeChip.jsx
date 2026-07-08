import { Link } from 'react-router-dom';
import { Shuffle } from 'lucide-react';

// Floating escape hatch back to the interface chooser. Icon-only on phones;
// `position` lets pages dodge their own furniture (e.g. the OS dock).
export default function ModeChip({ phosphor = false, position = 'bottom-5 right-5' }) {
    return (
        <Link
            to="/"
            aria-label="Switch interface"
            className={`fixed z-[96] flex items-center gap-2 rounded-full border p-2.5 font-mono text-[11px] backdrop-blur-md transition-colors sm:px-4 sm:py-2 ${position} ${
                phosphor
                    ? 'border-[#57ffa3]/25 bg-black/60 text-[#8dffc5] hover:border-[#ffb347] hover:text-[#ffb347]'
                    : 'border-ice/20 bg-abyss/70 text-ice/80 hover:border-ember hover:text-heat'
            }`}
            data-hot
        >
            <Shuffle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">switch interface</span>
        </Link>
    );
}
