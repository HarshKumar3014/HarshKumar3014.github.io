import { useEffect, useState } from 'react';
import { Wifi, BatteryFull, Flame } from 'lucide-react';

export default function MenuBar({ activeTitle }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 15000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 z-[95] flex h-8 items-center justify-between border-b border-[#57ffa3]/12 bg-black/70 px-4 font-mono text-[11px] text-[#8dffc5] backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <a href="/" className="flex items-center gap-1.5 font-semibold transition-colors hover:text-heat">
                    <Flame className="h-3.5 w-3.5 text-[#ffb347]" />
                    harshOS
                </a>
                <span className="hidden text-[#57ffa3]/50 sm:inline">{activeTitle || 'desktop'}</span>
            </div>
            <div className="flex items-center gap-3 text-[#57ffa3]/50">
                <span className="hidden sm:inline">thermal: nominal</span>
                <Wifi className="h-3.5 w-3.5 text-[#57ffa3]/70" />
                <BatteryFull className="h-3.5 w-3.5 text-[#57ffa3]/70" />
                <span className="text-[#8dffc5]">
                    {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
                    {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}
