import { useEffect, useState } from 'react';
import { Wifi, BatteryFull, Flame } from 'lucide-react';

export default function MenuBar({ activeTitle }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 15000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 z-[95] flex h-8 items-center justify-between border-b border-ice/10 bg-void/70 px-4 font-pixel text-[10px] text-frost/85 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <a href="/" className="flex items-center gap-1.5 font-semibold transition-colors hover:text-heat">
                    <Flame className="h-3.5 w-3.5 text-ember" />
                    harshOS
                </a>
                <span className="hidden text-muted-foreground sm:inline">{activeTitle || 'desktop'}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
                <span className="hidden items-center gap-1.5 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#28c840] shadow-[0_0_6px_#28c840]" />thermal: nominal</span>
                <Wifi className="h-3.5 w-3.5 text-ice/70" />
                <BatteryFull className="h-3.5 w-3.5 text-ice/70" />
                <span className="text-frost/85">
                    {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
                    {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}
