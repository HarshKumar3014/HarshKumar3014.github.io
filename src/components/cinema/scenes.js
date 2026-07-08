// Scroll-cinema scene map. Each scene is a tall section with a sticky
// full-screen stage inside; the particle field morphs at the boundaries.
export const SCENES = [
    { id: 'signal', label: 'signal', vh: 260 },
    { id: 'research', label: 'research', vh: 340 },
    { id: 'builds', label: 'builds', vh: 460 },
    { id: 'log', label: 'log', vh: 340 },
    { id: 'contact', label: 'contact', vh: 180 },
];

export const TOTAL_VH = SCENES.reduce((a, s) => a + s.vh, 0);

// Scene boundaries as fractions of the scrollable range (document minus
// one viewport, which is what scrollY/scrollMax actually spans).
const SCROLLABLE = TOTAL_VH - 100;
let acc = 0;
export const BOUNDS = SCENES.map((s) => {
    const start = acc / SCROLLABLE;
    acc += s.vh;
    return { id: s.id, start, end: Math.min(acc / SCROLLABLE, 1) };
});

export const boundsOf = (id) => BOUNDS.find((b) => b.id === id);

// px offset to the top of a scene (for HUD jumps)
export const sceneTopPx = (id) => {
    let sum = 0;
    for (const s of SCENES) {
        if (s.id === id) break;
        sum += s.vh;
    }
    return (sum / 100) * window.innerHeight;
};
