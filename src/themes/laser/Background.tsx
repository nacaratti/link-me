import { useEffect, useRef } from 'react';

interface Beam {
  x: number; y: number;
  vx: number; vy: number;
  r: number; g: number; b: number;
  trail: Array<{ x: number; y: number }>;
}

const PALETTE: [number, number, number][] = [
  [0, 255, 255],
  [255, 0, 255],
  [0, 255, 100],
  [255, 220, 0],
  [255, 60, 0],
  [100, 0, 255],
];

export default function LaserBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let beams: Beam[] = [];
    const TRAIL = 90;
    const BASE_SPEED = 3.2;

    const init = () => {
      canvas.width  = canvas.offsetWidth  || 400;
      canvas.height = canvas.offsetHeight || 600;
      ctx.fillStyle = '#010101';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beams = PALETTE.map(([r, g, b]) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = BASE_SPEED * (0.75 + Math.random() * 0.5);
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r, g, b,
          trail: [],
        };
      });
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(1,1,1,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const beam of beams) {
        beam.trail.push({ x: beam.x, y: beam.y });
        if (beam.trail.length > TRAIL) beam.trail.shift();

        if (beam.x <= 0 || beam.x >= canvas.width)  beam.vx *= -1;
        if (beam.y <= 0 || beam.y >= canvas.height) beam.vy *= -1;
        beam.x = Math.max(0, Math.min(canvas.width,  beam.x + beam.vx));
        beam.y = Math.max(0, Math.min(canvas.height, beam.y + beam.vy));

        if (beam.trail.length < 2) continue;

        // 3 passes: wide outer glow → inner glow → bright core
        const passes = [
          { width: 14, alphaMax: 0.05 },
          { width: 5,  alphaMax: 0.20 },
          { width: 1.5, alphaMax: 0.95 },
        ];
        for (const { width, alphaMax } of passes) {
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          for (let i = 1; i < beam.trail.length; i++) {
            const t = i / beam.trail.length;
            ctx.beginPath();
            ctx.moveTo(beam.trail[i - 1].x, beam.trail[i - 1].y);
            ctx.lineTo(beam.trail[i].x,     beam.trail[i].y);
            ctx.strokeStyle = `rgba(${beam.r},${beam.g},${beam.b},${t * alphaMax})`;
            ctx.stroke();
          }
        }

        // Glowing tip
        const tip = beam.trail[beam.trail.length - 1];
        const grd = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 28);
        grd.addColorStop(0,   `rgba(${beam.r},${beam.g},${beam.b},0.95)`);
        grd.addColorStop(0.3, `rgba(${beam.r},${beam.g},${beam.b},0.35)`);
        grd.addColorStop(1,   'transparent');
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 28, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}
