import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import useReducedMotion from '../portfolio/useReducedMotion';
import { NODES } from './nodes';

// The navigable world: a breathing neural core, four orbital stations wired
// to it, nebulae and a deep starfield. Drag orbits, wheel zooms, focusing a
// node flies the camera there with a velocity FOV punch. Label chips are DOM
// (World.jsx); this writes their projected positions every frame.

function makeSphereCloud(count, radius, jitter = 0.3, interiorEvery = 0) {
    const out = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        let r = radius;
        if (interiorEvery && i % interiorEvery === 0) r = radius * (0.2 + Math.random() * 0.7);
        const y = 1 - (i / (count - 1)) * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const th = golden * i;
        out[i * 3] = Math.cos(th) * rad * r + (Math.random() - 0.5) * jitter;
        out[i * 3 + 1] = y * r + (Math.random() - 0.5) * jitter;
        out[i * 3 + 2] = Math.sin(th) * rad * r + (Math.random() - 0.5) * jitter;
    }
    return out;
}

function pointsMaterial(size, color, opacity) {
    return new THREE.PointsMaterial({
        size,
        color: new THREE.Color(...color),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });
}

// soft radial glow texture for nebula sprites
function glowTexture(r, g, b) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.55)`);
    grad.addColorStop(0.4, `rgba(${r},${g},${b},0.18)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    return tex;
}

export default function WorldScene({ focusRef, labelRefs, telemetryRef }) {
    const mountRef = useRef(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        } catch {
            return undefined;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 300);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const disposables = [];
        const track = (obj) => (disposables.push(obj), obj);

        // --- deep starfield, two parallax shells ---
        const starGeoFar = track(new THREE.BufferGeometry());
        starGeoFar.setAttribute('position', new THREE.BufferAttribute(makeSphereCloud(isMobile ? 900 : 2400, 80, 30), 3));
        scene.add(new THREE.Points(starGeoFar, track(pointsMaterial(0.16, [0.6, 0.75, 0.95], 0.5))));
        const starGeoNear = track(new THREE.BufferGeometry());
        starGeoNear.setAttribute('position', new THREE.BufferAttribute(makeSphereCloud(isMobile ? 400 : 1100, 38, 14), 3));
        const nearStars = new THREE.Points(starGeoNear, track(pointsMaterial(0.1, [0.75, 0.88, 1.0], 0.7)));
        scene.add(nearStars);

        // --- nebulae ---
        const nebulaDefs = [
            { rgb: [125, 224, 255], pos: [-26, 8, -34], scale: 46 },
            { rgb: [255, 92, 46], pos: [30, -10, -40], scale: 52 },
            { rgb: [255, 174, 69], pos: [8, 22, -48], scale: 40 },
        ];
        const nebulae = nebulaDefs.map(({ rgb, pos, scale }) => {
            const tex = track(glowTexture(...rgb));
            const mat = track(new THREE.SpriteMaterial({
                map: tex,
                transparent: true,
                opacity: 0.16,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            }));
            const sprite = new THREE.Sprite(mat);
            sprite.position.set(...pos);
            sprite.scale.setScalar(scale);
            scene.add(sprite);
            return sprite;
        });

        // --- neural core ---
        const coreGroup = new THREE.Group();
        const coreGeo = track(new THREE.BufferGeometry());
        coreGeo.setAttribute('position', new THREE.BufferAttribute(makeSphereCloud(isMobile ? 700 : 1700, 2.3, 0.22, 7), 3));
        coreGroup.add(new THREE.Points(coreGeo, track(pointsMaterial(0.075, [0.49, 0.88, 1.0], 0.85))));
        const emberGeo = track(new THREE.BufferGeometry());
        emberGeo.setAttribute('position', new THREE.BufferAttribute(makeSphereCloud(isMobile ? 130 : 280, 1.1, 0.5), 3));
        const emberMat = track(pointsMaterial(0.1, [1.0, 0.45, 0.2], 0.9));
        coreGroup.add(new THREE.Points(emberGeo, emberMat));
        scene.add(coreGroup);

        // --- orbital stations + wiring + pulses ---
        const nodeGroups = {};
        const pulses = []; // { pts, geo, offset, speed }
        NODES.forEach((node) => {
            const g = new THREE.Group();
            g.position.set(...node.pos);

            const cloudGeo = track(new THREE.BufferGeometry());
            cloudGeo.setAttribute('position', new THREE.BufferAttribute(makeSphereCloud(isMobile ? 90 : 210, 0.75, 0.2, 5), 3));
            g.add(new THREE.Points(cloudGeo, track(pointsMaterial(0.07, node.color, 0.95))));

            const ringPts = [];
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                ringPts.push(new THREE.Vector3(Math.cos(a) * 1.25, 0, Math.sin(a) * 1.25));
            }
            const ring = new THREE.Line(
                track(new THREE.BufferGeometry().setFromPoints(ringPts)),
                track(new THREE.LineBasicMaterial({
                    color: new THREE.Color(...node.color),
                    transparent: true,
                    opacity: 0.5,
                }))
            );
            ring.rotation.x = Math.PI / 2.6 + Math.random() * 0.5;
            ring.rotation.z = Math.random() * Math.PI;
            g.add(ring);
            g.userData.ring = ring;

            // bowed wire back to the core
            const from = new THREE.Vector3(...node.pos).multiplyScalar(0.16);
            const to = new THREE.Vector3(...node.pos).multiplyScalar(0.88);
            const mid = from.clone().add(to).multiplyScalar(0.5).add(
                new THREE.Vector3((Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 2.4)
            );
            const curvePts = new THREE.QuadraticBezierCurve3(from, mid, to).getPoints(60);
            scene.add(new THREE.Line(
                track(new THREE.BufferGeometry().setFromPoints(curvePts)),
                track(new THREE.LineBasicMaterial({ color: 0x7de0ff, transparent: true, opacity: 0.13 }))
            ));

            // two ember pulses travelling the wire
            for (let k = 0; k < 2; k++) {
                const geo = track(new THREE.BufferGeometry());
                geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
                scene.add(new THREE.Points(geo, track(pointsMaterial(0.16, [1.0, 0.5, 0.22], 0.9))));
                pulses.push({ pts: curvePts, geo, offset: Math.random(), speed: 0.1 + Math.random() * 0.12 });
            }

            scene.add(g);
            nodeGroups[node.id] = g;
        });

        // --- camera rig ---
        const HOME_R = isMobile ? 22 : 16.5;
        const rig = {
            theta: 0.9,
            phi: 1.25,
            radius: reduced ? HOME_R : 85, // warp in from deep space
            thetaT: 0.9,
            phiT: 1.25,
            radiusT: HOME_R,
            focusT: 0,
            focusPos: new THREE.Vector3(),
            lookAt: new THREE.Vector3(),
        };

        let dragging = false;
        let lastX = 0;
        let lastY = 0;
        let dragMoved = 0;
        let coreFlash = 0;

        const onDown = (e) => {
            if (e.target.closest('a, button, aside')) return;
            dragging = true;
            dragMoved = 0;
            lastX = e.clientX;
            lastY = e.clientY;
        };
        const onMoveDrag = (e) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            dragMoved += Math.abs(dx) + Math.abs(dy);
            lastX = e.clientX;
            lastY = e.clientY;
            rig.thetaT -= dx * 0.005;
            rig.phiT = Math.min(2.1, Math.max(0.55, rig.phiT - dy * 0.004));
        };
        const onUp = () => {
            if (dragging && dragMoved < 6) coreFlash = 1; // tap = ping the core
            dragging = false;
        };
        const onWheel = (e) => {
            if (focusRef.current) return; // zoom belongs to home orbit
            rig.radiusT = Math.min(30, Math.max(9, rig.radiusT + e.deltaY * 0.012));
        };
        window.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMoveDrag);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('wheel', onWheel, { passive: true });

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        const clock = new THREE.Clock();
        const nodeVec = new THREE.Vector3();
        const projVec = new THREE.Vector3();
        const prevCam = new THREE.Vector3();
        const lookTmp = new THREE.Vector3();
        const dirTmp = new THREE.Vector3();
        const rightTmp = new THREE.Vector3();
        const lerpK = reduced ? 1 : 0.06;
        let frame = 0;

        let raf;
        const animate = () => {
            const t = clock.getElapsedTime();
            const focusId = focusRef.current;
            frame++;

            if (!dragging && !focusId && !reduced) rig.thetaT += 0.0006;

            rig.theta += (rig.thetaT - rig.theta) * (reduced ? 1 : 0.09);
            rig.phi += (rig.phiT - rig.phi) * (reduced ? 1 : 0.09);
            rig.radius += (rig.radiusT - rig.radius) * (reduced ? 1 : 0.045);

            rig.focusT += ((focusId ? 1 : 0) - rig.focusT) * lerpK;

            if (focusId) {
                if (focusId === 'core') {
                    rig.focusPos.set(0, 0.6, 7.5);
                    nodeVec.set(0, 0, 0);
                } else {
                    const node = NODES.find((n) => n.id === focusId);
                    nodeVec.set(...node.pos);
                    // approach at an angle, not dead-radial, so the core
                    // doesn't sit exactly behind the station
                    const off = nodeVec.clone().normalize().multiplyScalar(3.4);
                    dirTmp.crossVectors(nodeVec, camera.up).normalize();
                    off.addScaledVector(dirTmp, 2.4);
                    off.y += 1.0;
                    rig.focusPos.copy(nodeVec).add(off);
                }
                // the panel covers the right half on desktop; look a little
                // to the right of the node so it composes into the left half
                lookTmp.copy(nodeVec);
                if (!isMobile) {
                    dirTmp.subVectors(nodeVec, rig.focusPos).normalize();
                    rightTmp.crossVectors(dirTmp, camera.up).normalize();
                    lookTmp.addScaledVector(rightTmp, focusId === 'core' ? 1.1 : 1.4);
                }
                rig.lookAt.lerp(lookTmp, lerpK);
            } else {
                rig.lookAt.lerp(nodeVec.set(0, 0, 0), lerpK);
            }

            const orbitX = rig.radius * Math.sin(rig.phi) * Math.cos(rig.theta);
            const orbitY = rig.radius * Math.cos(rig.phi);
            const orbitZ = rig.radius * Math.sin(rig.phi) * Math.sin(rig.theta);
            const e = rig.focusT * rig.focusT * (3 - 2 * rig.focusT);
            prevCam.copy(camera.position);
            camera.position.set(
                orbitX + (rig.focusPos.x - orbitX) * e,
                orbitY + (rig.focusPos.y - orbitY) * e,
                orbitZ + (rig.focusPos.z - orbitZ) * e
            );
            camera.lookAt(rig.lookAt);

            // velocity FOV punch: fast flight stretches space
            const speed = prevCam.distanceTo(camera.position);
            const fovTarget = 58 + Math.min(26, speed * 26);
            camera.fov += (fovTarget - camera.fov) * 0.12;
            camera.updateProjectionMatrix();

            // living world
            coreGroup.rotation.y = t * 0.08;
            coreGroup.rotation.x = Math.sin(t * 0.11) * 0.1;
            coreFlash *= 0.94;
            emberMat.opacity = 0.9 * (0.75 + Math.sin(t * 1.6) * 0.25) + coreFlash * 1.6;
            emberMat.size = 0.1 + coreFlash * 0.22;

            NODES.forEach((node) => {
                const g = nodeGroups[node.id];
                g.rotation.y = t * 0.3;
                g.userData.ring.rotation.z += 0.002;
                g.position.y = node.pos[1] + Math.sin(t * 0.5 + node.pos[0]) * 0.18;
            });

            pulses.forEach((p) => {
                const u = (t * p.speed + p.offset) % 1;
                const pt = p.pts[Math.floor(u * (p.pts.length - 1))];
                p.geo.attributes.position.setXYZ(0, pt.x, pt.y, pt.z);
                p.geo.attributes.position.needsUpdate = true;
            });

            nebulae.forEach((n, i) => {
                n.material.rotation += 0.0004 * (i % 2 ? 1 : -1);
            });
            nearStars.rotation.y = t * 0.004;

            // project node anchors onto the screen for the DOM chips
            Object.entries(labelRefs.current).forEach(([id, el]) => {
                if (!el) return;
                if (id === 'core') {
                    projVec.set(0, -3.4, 0);
                } else {
                    const node = NODES.find((n) => n.id === id);
                    const g = nodeGroups[node.id];
                    projVec.set(g.position.x, g.position.y + 1.8, g.position.z);
                }
                projVec.project(camera);
                const behind = projVec.z > 1;
                const x = (projVec.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-projVec.y * 0.5 + 0.5) * window.innerHeight;
                el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
                el.style.opacity = behind || (focusId && focusId !== id) ? '0' : '1';
                el.style.pointerEvents = behind || focusId ? 'none' : 'auto';
            });

            // telemetry readout (throttled)
            if (telemetryRef?.current && frame % 6 === 0) {
                telemetryRef.current.textContent =
                    `az ${((rig.theta * 57.2958) % 360).toFixed(1).padStart(6)}° · ` +
                    `el ${(90 - rig.phi * 57.2958).toFixed(1)}° · ` +
                    `r ${rig.radius.toFixed(1)}u · ` +
                    (focusId ? `docked://${focusId}` : 'orbit://free');
            }

            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMoveDrag);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('resize', onResize);
            disposables.forEach((d) => d.dispose());
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
    }, [reduced, focusRef, labelRefs, telemetryRef]);

    return (
        <div
            ref={mountRef}
            className="fixed inset-0 z-0 cursor-grab active:cursor-grabbing"
            style={{
                background:
                    'radial-gradient(ellipse 75% 60% at 50% 45%, hsl(215 45% 9%) 0%, hsl(216 56% 4%) 75%)',
            }}
            aria-hidden
        />
    );
}
