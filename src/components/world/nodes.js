// The world: a neural core with orbital stations. Positions in world units.
export const NODES = [
    {
        id: 'research',
        label: '01 research',
        pos: [7.2, 2.6, -1.8],
        color: [0.49, 0.88, 1.0], // ice
    },
    {
        id: 'builds',
        label: '02 builds',
        pos: [4.6, -3.4, 3.2],
        color: [1.0, 0.36, 0.18], // ember
    },
    {
        id: 'log',
        label: '03 field log',
        pos: [-6.6, -2.4, 2.4],
        color: [1.0, 0.68, 0.27], // heat
    },
    {
        id: 'contact',
        label: '04 contact',
        pos: [-5.2, 3.6, -2.2],
        color: [0.72, 0.82, 1.0], // frost
    },
];

// the core itself is clickable too — it's "who is this"
export const CORE = { id: 'core', label: 'harsh — signal', pos: [0, 0, 0] };
