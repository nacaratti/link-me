import { useEffect, useRef } from 'react';

interface Particle { x: number; y: number; life: number; maxLife: number; }

export default function FlowBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const COUNT = 320;
    const particles: Particle[] = [];

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          life: Math.floor(Math.random() * 200),
          maxLife: 150 + Math.floor(Math.random() * 110),
        });
      }
      // Paint initial dark background
      ctx.fillStyle = '#0a0805';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    let t = 0;

    const draw = () => {
      // Trail fade — near-black overlay
      ctx.fillStyle = 'rgba(0,0,0,.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      t += 0.45;

      particles.forEach(p => {
        p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = 0;
          p.maxLife = 150 + Math.floor(Math.random() * 110);
        }

        const angle =
          Math.sin(p.x * 0.0028 + t * 0.001) *
          Math.cos(p.y * 0.0028 + t * 0.00085) *
          Math.PI * 2.6;
        const speed = 1.15;
        p.x += Math.cos(angle) * speed;
        p.y += Math.sin(angle) * speed;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const lifeRatio = p.life / p.maxLife;
        const alpha = Math.sin(lifeRatio * Math.PI) * 0.72 + 0.08;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,55,${alpha})`;
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
