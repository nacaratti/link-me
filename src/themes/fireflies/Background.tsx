import { useEffect, useRef } from 'react';

interface Firefly {
  x: number; y: number;
  vx: number; vy: number;
  phase: number;
  blinkSpeed: number;
  size: number;
  r: number; g: number; b: number;
}

export default function FirefliesBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let fireflies: Firefly[] = [];

    const palette = [
      [180, 255, 110],
      [220, 255,  75],
      [100, 255, 150],
      [255, 235,  70],
    ] as const;

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      fireflies = Array.from({ length: 44 }, () => {
        const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          phase: Math.random() * Math.PI * 2,
          blinkSpeed: 0.008 + Math.random() * 0.028,
          size: 1.5 + Math.random() * 2.6,
          r, g, b,
        };
      });
    };

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      fireflies.forEach(f => {
        f.x += f.vx + Math.sin(t * 0.75 + f.phase) * 0.28;
        f.y += f.vy + Math.cos(t * 0.58 + f.phase * 1.3) * 0.24;

        if (f.x < 0 || f.x > canvas.width)  { f.vx *= -1; f.x = Math.max(0, Math.min(canvas.width, f.x)); }
        if (f.y < 0 || f.y > canvas.height) { f.vy *= -1; f.y = Math.max(0, Math.min(canvas.height, f.y)); }

        const bright = 0.28 + 0.72 * Math.pow(Math.sin(t * f.blinkSpeed * 60 + f.phase), 2);

        if (bright < 0.12) return;

        // Outer glow
        const glowR = f.size * (7 + bright * 11);
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowR);
        g.addColorStop(0,   `rgba(${f.r},${f.g},${f.b},${bright * 0.48})`);
        g.addColorStop(0.38,`rgba(${f.r},${f.g},${f.b},${bright * 0.14})`);
        g.addColorStop(1,   'transparent');
        ctx.beginPath();
        ctx.arc(f.x, f.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * bright, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${f.r},${f.g},${f.b},${bright})`;
        ctx.fill();
      });

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
