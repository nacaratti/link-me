import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Full-screen Three.js particle constellation background.
 * Fixed-position, pointer-events: none — place as first child of a
 * position:relative or position:fixed container.
 */
export default function ConstellationBackground({ opacity = 0.55 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile  = window.innerWidth < 768;
    const PARTICLES = isMobile ? 80 : 170;
    const CONN_DIST = 4.2;
    const MAX_LINES = isMobile ? 300 : 700;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Particle geometry ──────────────────────────────────────────────────────
    const pPos = new Float32Array(PARTICLES * 3);
    const pVel = new Float32Array(PARTICLES * 3);
    const pCol = new Float32Array(PARTICLES * 3);

    for (let i = 0; i < PARTICLES; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 42;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const spd = 0.008;
      pVel[i * 3]     = (Math.random() - 0.5) * spd;
      pVel[i * 3 + 1] = (Math.random() - 0.5) * spd;
      pVel[i * 3 + 2] = (Math.random() - 0.5) * spd * 0.4;

      // ~18% blue-tinted, rest grey
      const isBlue = Math.random() < 0.18;
      if (isBlue) {
        pCol[i * 3]     = 0.11; // R
        pCol[i * 3 + 1] = 0.61; // G
        pCol[i * 3 + 2] = 0.94; // B  → ~#1c9cf0
      } else {
        const b = 0.3 + Math.random() * 0.6;
        pCol[i * 3]     = b;
        pCol[i * 3 + 1] = b;
        pCol[i * 3 + 2] = b;
      }
    }

    const pGeo  = new THREE.BufferGeometry();
    const pAttr = new THREE.BufferAttribute(pPos, 3);
    pAttr.setUsage(THREE.DynamicDrawUsage);
    pGeo.setAttribute('position', pAttr);
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat   = new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ── Line geometry ──────────────────────────────────────────────────────────
    const lPos  = new Float32Array(MAX_LINES * 6);
    const lGeo  = new THREE.BufferGeometry();
    const lAttr = new THREE.BufferAttribute(lPos, 3);
    lAttr.setUsage(THREE.DynamicDrawUsage);
    lGeo.setAttribute('position', lAttr);
    lGeo.setDrawRange(0, 0);

    const lMat  = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 });
    const lines = new THREE.LineSegments(lGeo, lMat);
    scene.add(lines);

    // ── Events ─────────────────────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / W - 0.5) * 2,
        y: -(e.clientY / H - 0.5) * 2,
      };
    };
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize, { passive: true });

    // ── Animation ──────────────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      for (let i = 0; i < PARTICLES; i++) {
        pPos[i * 3]     += pVel[i * 3];
        pPos[i * 3 + 1] += pVel[i * 3 + 1];
        pPos[i * 3 + 2] += pVel[i * 3 + 2];

        if (Math.abs(pPos[i * 3])     > 22) pVel[i * 3]     *= -1;
        if (Math.abs(pPos[i * 3 + 1]) > 17) pVel[i * 3 + 1] *= -1;
        if (Math.abs(pPos[i * 3 + 2]) > 10) pVel[i * 3 + 2] *= -1;
      }
      pAttr.needsUpdate = true;

      let li = 0;
      for (let i = 0; i < PARTICLES && li < MAX_LINES; i++) {
        for (let j = i + 1; j < PARTICLES && li < MAX_LINES; j++) {
          const dx = pPos[i * 3]     - pPos[j * 3];
          const dy = pPos[i * 3 + 1] - pPos[j * 3 + 1];
          const dz = pPos[i * 3 + 2] - pPos[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < CONN_DIST * CONN_DIST) {
            lPos[li * 6]     = pPos[i * 3];
            lPos[li * 6 + 1] = pPos[i * 3 + 1];
            lPos[li * 6 + 2] = pPos[i * 3 + 2];
            lPos[li * 6 + 3] = pPos[j * 3];
            lPos[li * 6 + 4] = pPos[j * 3 + 1];
            lPos[li * 6 + 5] = pPos[j * 3 + 2];
            li++;
          }
        }
      }
      lGeo.setDrawRange(0, li * 2);
      lAttr.needsUpdate = true;

      camera.position.x += (mouseRef.current.x * 2.5 - camera.position.x) * 0.018;
      camera.position.y += (mouseRef.current.y * 1.8 - camera.position.y) * 0.018;
      camera.lookAt(scene.position);

      points.rotation.y = t * 0.025;
      lines.rotation.y  = t * 0.025;

      renderer.render(scene, camera);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      pGeo.dispose();
      lGeo.dispose();
      pMat.dispose();
      lMat.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity,
        }}
      />
      {/* Radial vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(7,7,7,0.6) 100%)',
      }} />
    </>
  );
}
