import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import useReducedMotion from '../portfolio/useReducedMotion';
import { boundsOf } from './scenes';

// One persistent particle system for the whole journey. Every particle owns
// four home positions — name glyphs, brain globe, flight tunnel, ember core —
// and the scroll position blends between them. Cursor heat and click
// shockwaves stay live in every scene.
const VERT = /* glsl */ `
    uniform float uTime;
    uniform float uFly;        // tunnel flight distance
    uniform float uWName;
    uniform float uWGlobe;
    uniform float uWTunnel;
    uniform float uWCollapse;
    uniform vec3 uHeat;
    uniform float uHeatOn;
    uniform vec3 uBurst;
    uniform float uBurstT;
    attribute vec3 aName;
    attribute vec3 aGlobe;
    attribute vec3 aTunnel;
    attribute float aSeed;
    varying float vHeat;
    varying float vSeed;

    vec3 drift(vec3 p, float t, float seed) {
        return vec3(
            sin(t * 0.35 + seed * 6.28 + p.y * 0.7),
            cos(t * 0.28 + seed * 3.14 + p.x * 0.6),
            sin(t * 0.22 + seed * 9.42 + p.z * 0.8)
        ) * 0.3;
    }

    void main() {
        vSeed = aSeed;

        // tunnel rings recede forever: wrap z as the camera "flies"
        vec3 tun = aTunnel;
        tun.z = mod(tun.z + uFly, 52.0) - 44.0;

        // ember core: a tight breathing kernel
        vec3 core = normalize(vec3(
            sin(aSeed * 99.7), cos(aSeed * 57.3), sin(aSeed * 31.1)
        )) * (0.3 + aSeed * 0.5 + sin(uTime * 1.4 + aSeed * 12.0) * 0.1);

        vec3 p = aName * uWName + aGlobe * uWGlobe + tun * uWTunnel + core * uWCollapse;
        // letters need to stay crisp; looser states can breathe more
        p += drift(p, uTime, aSeed) * (0.1 + (1.0 - uWName) * 0.35 + uWGlobe * 0.45 + uWTunnel * 0.3);

        float d = distance(p, uHeat);
        float heat = smoothstep(3.2, 0.0, d) * uHeatOn;
        vec3 away = normalize(p - uHeat + 0.0001);
        p += away * heat * 1.2;

        float bd = distance(p, uBurst);
        float ring = exp(-pow(bd - uBurstT * 9.0, 2.0) * 0.55) * exp(-uBurstT * 1.7);
        p += normalize(p - uBurst + 0.0001) * ring * 2.6;
        vHeat = clamp(heat + ring * 1.2, 0.0, 1.0);

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float size = (1.15 + vHeat * 2.2 + aSeed * 0.9 + uWCollapse * 2.2) * (34.0 / -mv.z);
        gl_PointSize = clamp(size, 1.0, 7.5);
        gl_Position = projectionMatrix * mv;
    }
`;

const FRAG = /* glsl */ `
    uniform float uTemp; // 0 = deep cold intro, 1 = ember finale
    varying float vHeat;
    varying float vSeed;

    void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float r = length(uv);
        if (r > 0.5) discard;
        float glow = smoothstep(0.5, 0.05, r);

        vec3 ice = vec3(0.49, 0.88, 1.0);
        vec3 ember = vec3(1.0, 0.36, 0.18);
        vec3 heatCol = vec3(1.0, 0.68, 0.27);
        vec3 cold = mix(ice, vec3(0.55, 0.65, 0.85), vSeed * 0.7);
        vec3 hot = mix(ember, heatCol, vSeed);
        float warmth = clamp(vHeat + uTemp * (0.3 + vSeed * 0.6), 0.0, 1.0);
        vec3 col = mix(cold, hot, warmth);

        float alpha = glow * (0.24 + vHeat * 0.6 + uTemp * 0.12);
        gl_FragColor = vec4(col, alpha);
    }
`;

// Sample "HARSH / KUMAR" into particle home positions via offscreen canvas.
// halfW = visible world half-width at z=0, so the name always fits the frustum.
async function sampleName(count, halfW, fillRatio = 1) {
    try {
        await document.fonts.load('700 170px "Clash Display"');
    } catch {
        /* fall through to whatever font is available */
    }
    const cw = 1000;
    const ch = 420;
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.font = '700 168px "Clash Display", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HARSH', cw / 2, 110);
    ctx.fillText('KUMAR', cw / 2, 300);
    const img = ctx.getImageData(0, 0, cw, ch).data;
    const wX = Math.min(8.6, halfW * 0.92);
    const wY = wX * (3.6 / 8.6);
    const pts = [];
    for (let y = 0; y < ch; y += 3) {
        for (let x = 0; x < cw; x += 3) {
            if (img[(y * cw + x) * 4 + 3] > 140) {
                pts.push([
                    ((x - cw / 2) / (cw / 2)) * wX,
                    (-(y - ch / 2) / (ch / 2)) * wY,
                    (Math.random() - 0.5) * 0.7,
                ]);
            }
        }
    }
    const out = new Float32Array(count * 3);
    const glyphCount = Math.floor(count * fillRatio);
    for (let i = 0; i < count; i++) {
        if (i < glyphCount && pts.length) {
            const [x, y, z] = pts[Math.floor(Math.random() * pts.length)];
            out[i * 3] = x + (Math.random() - 0.5) * 0.06;
            out[i * 3 + 1] = y + (Math.random() - 0.5) * 0.06;
            out[i * 3 + 2] = z;
        } else {
            // spare particles hang back as distant starfield
            const r = 7 + Math.random() * 6;
            const a = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            out[i * 3] = r * Math.sin(phi) * Math.cos(a);
            out[i * 3 + 1] = r * Math.cos(phi) * 0.7;
            out[i * 3 + 2] = -4 - Math.random() * 6;
        }
    }
    return out;
}

function makeGlobe(count) {
    const out = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        let r = 5.4;
        if (i % 9 === 0) r = 5.4 * (0.25 + Math.random() * 0.65); // interior sparks
        const yy = 1 - (i / (count - 1)) * 2;
        const rad = Math.sqrt(1 - yy * yy);
        const th = golden * i;
        out[i * 3] = Math.cos(th) * rad * r + (Math.random() - 0.5) * 0.35;
        out[i * 3 + 1] = yy * r * 0.92 + (Math.random() - 0.5) * 0.35;
        out[i * 3 + 2] = Math.sin(th) * rad * r * 0.9 + (Math.random() - 0.5) * 0.35;
    }
    return out;
}

function makeTunnel(count) {
    // store z in [0, 52); shader wraps it with uFly into [-44, 8)
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 4.2 + Math.random() * 2.6 + Math.sin(a * 3) * 0.5;
        out[i * 3] = Math.cos(a) * r;
        out[i * 3 + 1] = Math.sin(a) * r * 0.85;
        out[i * 3 + 2] = Math.random() * 52;
    }
    return out;
}

const smooth = (p, a, b) => {
    const t = Math.min(Math.max((p - a) / (b - a || 1e-6), 0), 1);
    return t * t * (3 - 2 * t);
};

export default function CinemaField() {
    const mountRef = useRef(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let disposed = false;
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
        } catch {
            return undefined;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 13;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const COUNT = isMobile ? 3000 : 7500;

        const seeds = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) seeds[i] = Math.random();

        const geo = new THREE.BufferGeometry();
        // start everything on the globe; the name buffer is swapped in async
        const globe = makeGlobe(COUNT);
        geo.setAttribute('position', new THREE.BufferAttribute(globe, 3)); // unused but required
        geo.setAttribute('aName', new THREE.BufferAttribute(globe.slice(), 3));
        geo.setAttribute('aGlobe', new THREE.BufferAttribute(globe, 3));
        geo.setAttribute('aTunnel', new THREE.BufferAttribute(makeTunnel(COUNT), 3));
        geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

        const frustumHalfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect;
        // small screens use DOM type for the name; particles stay a starfield
        sampleName(COUNT, frustumHalfW, isMobile ? 0 : 1).then((buf) => {
            if (disposed) return;
            geo.getAttribute('aName').array.set(buf);
            geo.getAttribute('aName').needsUpdate = true;
        });

        const mat = new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uFly: { value: 0 },
                uWName: { value: 1 },
                uWGlobe: { value: 0 },
                uWTunnel: { value: 0 },
                uWCollapse: { value: 0 },
                uTemp: { value: 0 },
                uHeat: { value: new THREE.Vector3(999, 999, 999) },
                uHeatOn: { value: 0 },
                uBurst: { value: new THREE.Vector3(999, 999, 999) },
                uBurstT: { value: 100 },
            },
        });

        const points = new THREE.Points(geo, mat);
        scene.add(points);

        // cursor → world plane
        const clock = new THREE.Clock();
        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const ndc = new THREE.Vector2(-10, -10);
        const heatTarget = new THREE.Vector3(999, 999, 999);
        let heatOn = 0;
        let burstAt = -100;

        const onMove = (e) => {
            ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
            ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(ndc, camera);
            raycaster.ray.intersectPlane(plane, heatTarget);
            heatOn = 1;
        };
        const onLeave = () => {
            heatOn = 0;
        };
        const onPointerDown = (e) => {
            if (e.target.closest('a, button')) return; // let UI clicks be UI clicks
            ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
            ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(ndc, camera);
            const hit = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(plane, hit)) {
                mat.uniforms.uBurst.value.copy(hit);
                burstAt = clock.getElapsedTime();
            }
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseout', onLeave);
        window.addEventListener('pointerdown', onPointerDown);

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        // scroll → smoothed global progress
        let targetP = 0;
        let smoothP = 0;
        const readScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            targetP = max > 0 ? window.scrollY / max : 0;
        };
        readScroll();
        window.addEventListener('scroll', readScroll, { passive: true });

        const gEnd = boundsOf('signal').end;
        const rEnd = boundsOf('research').end;
        const bStart = boundsOf('builds').start;
        const bEnd = boundsOf('builds').end;
        const lEnd = boundsOf('log').end;

        let raf;
        const animate = () => {
            const t = clock.getElapsedTime();
            smoothP += (targetP - smoothP) * (reduced ? 1 : 0.08);
            const p = smoothP;

            // scene weights: name → globe → tunnel → ember core
            const toGlobe = smooth(p, gEnd * 0.55, gEnd * 0.95);
            const toTunnel = smooth(p, rEnd * 0.92, bStart + (bEnd - bStart) * 0.1);
            const toCore = smooth(p, lEnd * 0.97, lEnd + (1 - lEnd) * 0.5);

            mat.uniforms.uWName.value = 1 - toGlobe;
            mat.uniforms.uWGlobe.value = toGlobe * (1 - toTunnel);
            mat.uniforms.uWTunnel.value = toTunnel * (1 - toCore);
            mat.uniforms.uWCollapse.value = toCore;

            // flight speed: cruise through builds, hyperspace through the log
            const flyBuilds = Math.max(0, p - rEnd * 0.92) * 210;
            const flyLog = Math.max(0, p - bEnd) * 520;
            mat.uniforms.uFly.value = flyBuilds + flyLog;

            mat.uniforms.uTemp.value = Math.min(1, p * 1.08);
            mat.uniforms.uTime.value = t;
            mat.uniforms.uHeat.value.lerp(heatTarget, 0.08);
            mat.uniforms.uHeatOn.value += (heatOn - mat.uniforms.uHeatOn.value) * 0.05;
            mat.uniforms.uBurstT.value = t - burstAt;

            points.rotation.y = Math.sin(t * 0.05) * 0.25 * toGlobe * (1 - toTunnel);
            points.rotation.x = Math.sin(t * 0.08) * 0.06 * toGlobe * (1 - toTunnel);

            camera.position.x += (ndc.x * 0.6 - camera.position.x) * 0.02;
            camera.position.y += (ndc.y * 0.35 - camera.position.y) * 0.02;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseout', onLeave);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', readScroll);
            geo.dispose();
            mat.dispose();
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
    }, [reduced]);

    return (
        <div
            ref={mountRef}
            className="fixed inset-0 z-0"
            style={{
                background:
                    'radial-gradient(ellipse 70% 50% at 50% 42%, hsl(215 45% 9%) 0%, transparent 70%)',
            }}
            aria-hidden
        />
    );
}
