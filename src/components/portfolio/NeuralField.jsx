import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import useReducedMotion from './useReducedMotion';

const VERT = /* glsl */ `
    uniform float uTime;
    uniform vec3 uHeat;      // cursor position in world space
    uniform float uHeatOn;
    uniform vec3 uBurst;     // last click position in world space
    uniform float uBurstT;   // seconds since last click
    attribute float aSeed;
    varying float vHeat;
    varying float vSeed;

    // cheap pseudo-noise drift
    vec3 drift(vec3 p, float t, float seed) {
        return vec3(
            sin(t * 0.35 + seed * 6.28 + p.y * 0.7),
            cos(t * 0.28 + seed * 3.14 + p.x * 0.6),
            sin(t * 0.22 + seed * 9.42 + p.z * 0.8)
        ) * 0.35;
    }

    void main() {
        vSeed = aSeed;
        vec3 p = position + drift(position, uTime, aSeed);

        float d = distance(p, uHeat);
        float heat = smoothstep(3.2, 0.0, d) * uHeatOn;
        vHeat = heat;

        // heat repels: particles boil away from the probe
        vec3 away = normalize(p - uHeat + 0.0001);
        p += away * heat * 1.4;

        // click shockwave: an expanding pressure ring that shoves particles
        // outward and flashes them hot as it passes
        float bd = distance(p, uBurst);
        float ring = exp(-pow(bd - uBurstT * 9.0, 2.0) * 0.55) * exp(-uBurstT * 1.7);
        vec3 bdir = normalize(p - uBurst + 0.0001);
        p += bdir * ring * 2.8;
        vHeat = clamp(heat + ring * 1.2, 0.0, 1.0);

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float size = (1.1 + heat * 2.5 + aSeed * 0.9) * (34.0 / -mv.z);
        gl_PointSize = clamp(size, 1.0, 6.5);
        gl_Position = projectionMatrix * mv;
    }
`;

const FRAG = /* glsl */ `
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
        vec3 col = mix(cold, hot, vHeat);

        float alpha = glow * (0.22 + vHeat * 0.6);
        gl_FragColor = vec4(col, alpha);
    }
`;

// Full-bleed particle field: a slowly-breathing lattice of ~7k points that the
// cursor heats and scatters like a probe over a Grad-CAM map.
export default function NeuralField({ className = '' }) {
    const mountRef = useRef(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.z = 11;

        // No WebGL (old device, headless, blocked context) → keep the CSS
        // gradient backdrop instead of taking the whole page down.
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
        } catch {
            return undefined;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const COUNT = isMobile ? 2600 : 7000;

        // Layered lattice: a torus-knot-ish band + scattered halo reads as a
        // latent manifold rather than a generic sphere.
        const positions = new Float32Array(COUNT * 3);
        const seeds = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) {
            const t = Math.random() * Math.PI * 2;
            const band = Math.random();
            let x, y, z;
            if (band < 0.72) {
                // twisted ribbon
                const u = t * 3;
                const rad = 5.2 + Math.sin(u * 1.5) * 1.2 + (Math.random() - 0.5) * 0.9;
                x = Math.cos(t) * rad;
                y = Math.sin(u) * 1.9 + (Math.random() - 0.5) * 0.8;
                z = Math.sin(t) * rad * 0.55;
            } else {
                // sparse halo
                const r = 7 + Math.random() * 4;
                const phi = Math.acos(2 * Math.random() - 1);
                x = r * Math.sin(phi) * Math.cos(t);
                y = r * Math.cos(phi) * 0.6;
                z = r * Math.sin(phi) * Math.sin(t) * 0.6;
            }
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            seeds[i] = Math.random();
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

        const mat = new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uHeat: { value: new THREE.Vector3(999, 999, 999) },
                uHeatOn: { value: 0 },
                uBurst: { value: new THREE.Vector3(999, 999, 999) },
                uBurstT: { value: 100 },
            },
        });

        const points = new THREE.Points(geo, mat);
        scene.add(points);

        // Map cursor to a plane at z=0 in world space
        const clock = new THREE.Clock();
        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const ndc = new THREE.Vector2(-10, -10);
        const heatTarget = new THREE.Vector3(999, 999, 999);
        let heatOn = 0;

        const onMove = (e) => {
            const rect = mount.getBoundingClientRect();
            ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(ndc, camera);
            raycaster.ray.intersectPlane(plane, heatTarget);
            heatOn = 1;
        };
        const onLeave = () => { heatOn = 0; };
        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseout', onLeave);

        // click (anywhere over the hero) detonates a shockwave in the field
        let burstAt = -100;
        const onPointerDown = (e) => {
            const rect = mount.getBoundingClientRect();
            if (e.clientY < rect.top || e.clientY > rect.bottom) return;
            ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(ndc, camera);
            const hit = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(plane, hit)) {
                mat.uniforms.uBurst.value.copy(hit);
                burstAt = clock.getElapsedTime();
            }
        };
        window.addEventListener('pointerdown', onPointerDown);

        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', onResize);

        let raf;
        const animate = () => {
            const t = clock.getElapsedTime();
            mat.uniforms.uTime.value = t;
            mat.uniforms.uHeat.value.lerp(heatTarget, 0.08);
            mat.uniforms.uHeatOn.value += (heatOn - mat.uniforms.uHeatOn.value) * 0.05;
            mat.uniforms.uBurstT.value = t - burstAt;

            points.rotation.y = t * 0.04;
            points.rotation.x = Math.sin(t * 0.1) * 0.08;

            // gentle parallax drift toward cursor
            camera.position.x += (ndc.x * 0.7 - camera.position.x) * 0.02;
            camera.position.y += (ndc.y * 0.4 - camera.position.y) * 0.02;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };

        if (reduced) {
            // static frame only
            renderer.render(scene, camera);
        } else {
            animate();
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseout', onLeave);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('resize', onResize);
            geo.dispose();
            mat.dispose();
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
    }, [reduced]);

    return (
        <div
            ref={mountRef}
            className={`absolute inset-0 ${className}`}
            style={{
                background:
                    'radial-gradient(ellipse 70% 50% at 50% 40%, hsl(215 45% 10%) 0%, transparent 70%)',
            }}
            aria-hidden
        />
    );
}
