import { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';

// One harshOS window: draggable by its title bar, traffic lights, focus on
// pointer-down. Maximize toggles to (almost) full screen.
export default function OSWindow({ win, app, onClose, onMinimize, onFocus, openApp, isTop, desktopRef }) {
    const controls = useDragControls();
    const [maximized, setMaximized] = useState(false);
    const { Body } = app;

    return (
        <motion.div
            drag={!maximized}
            dragControls={controls}
            dragListener={false}
            dragMomentum={false}
            dragConstraints={desktopRef}
            initial={{ opacity: 0, scale: 0.75, y: 60 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                ...(maximized
                    ? { x: 0 }
                    : {}),
            }}
            exit={{ opacity: 0, scale: 0.85, y: 40, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onPointerDown={() => onFocus(win.id)}
            style={
                maximized
                    ? { zIndex: win.z, position: 'absolute', inset: '8px', width: 'auto', height: 'auto' }
                    : {
                          zIndex: win.z,
                          position: 'absolute',
                          left: win.x,
                          top: win.y,
                          width: `min(${app.w}px, calc(100vw - 24px))`,
                          height: `min(${app.h}px, calc(100dvh - 110px))`,
                      }
            }
            className={`instrument pointer-events-auto flex flex-col overflow-hidden rounded-lg border shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl ${
                isTop ? 'border-[#57ffa3]/40 bg-[#03140b]/90' : 'border-[#57ffa3]/12 bg-[#02100a]/85'
            }`}
            role="dialog"
            aria-label={app.title}
        >
            {/* title bar */}
            <div
                onPointerDown={(e) => {
                    onFocus(win.id);
                    if (!maximized) controls.start(e);
                }}
                onDoubleClick={() => setMaximized((m) => !m)}
                className="flex shrink-0 cursor-grab items-center gap-2 border-b border-[#57ffa3]/12 bg-black/50 px-3 py-2.5 active:cursor-grabbing"
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={() => onClose(win.id)}
                    className="h-3 w-3 rounded-full bg-[#e64533] transition-transform hover:scale-110"
                />
                <button
                    type="button"
                    aria-label="Minimize"
                    onClick={() => onMinimize(win.id)}
                    className="h-3 w-3 rounded-full bg-[#ffb347] transition-transform hover:scale-110"
                />
                <button
                    type="button"
                    aria-label="Maximize"
                    onClick={() => setMaximized((m) => !m)}
                    className="h-3 w-3 rounded-full bg-[#57ffa3] transition-transform hover:scale-110"
                />
                <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-[#57ffa3]/70">
                    <app.Icon className="h-3.5 w-3.5" style={{ color: app.tint }} />
                    {app.title}
                </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <Body openApp={openApp} closeSelf={() => onClose(win.id)} />
            </div>
        </motion.div>
    );
}
