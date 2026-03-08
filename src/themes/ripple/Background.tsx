import { useEffect, useRef } from 'react';

interface Wave { x: number; y: number; r: number; maxR: number; alpha: number; color: string; }

export default function RippleBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const waves: Wave[] = [];
    let nextSpawn = 40;
    let frame = 0;

    const colors = ['0,215,210', '0,185,255', '45,240,200', '0,225,175'];

    const spawn = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const maxR = 85 + Math.random() * 145;
      const color = colors[Math.floor(Math.random() * colors.length)];
      waves.push({ x, y, r: 0,   maxR, alpha: 0.65, color });
      waves.push({ x, y, r: -22, maxR, alpha: 0.45, color });
      waves.push({ x, y, r: -44, maxR, alpha: 0.28, color });
    };

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      if (frame >= nextSpawn) {
        spawn();
        nextSpawn = frame + 75 + Math.floor(Math.random() * 75);
      }

      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.r += 0.85;
        if (w.r <= 0) continue;
        if (w.r > w.maxR) { waves.splice(i, 1); continue; }

        const p = w.r / w.maxR;
        const a = w.alpha * (1 - p) * (1 - p);
        if (a < 0.008) { waves.splice(i, 1); continue; }

        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${w.color},${a})`;
        ctx.lineWidth = 1.5 * (1 - p * 0.6);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    init();
    spawn();
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
