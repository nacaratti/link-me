import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleAmp: number;
  wobbleFreq: number;
  phase: number;
  r: number; g: number; b: number;
  alpha: number;
}

const PALETTE = [
  [255,  80, 120], // rosa
  [255, 160,  40], // laranja
  [ 80, 200, 255], // azul claro
  [120, 255, 160], // verde menta
  [200,  80, 255], // roxo
  [255, 220,  50], // amarelo
  [ 60, 220, 200], // turquesa
  [255, 130, 200], // rosa claro
];

function makeBubble(w: number, h: number, fromBottom = false): Bubble {
  const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const radius = 8 + Math.random() * 36;
  return {
    x: Math.random() * w,
    y: fromBottom ? h + radius + Math.random() * h : Math.random() * h + radius,
    radius,
    speed: 0.3 + Math.random() * 0.7,
    wobbleAmp: 0.4 + Math.random() * 1.2,
    wobbleFreq: 0.005 + Math.random() * 0.012,
    phase: Math.random() * Math.PI * 2,
    r, g, b,
    alpha: 0.18 + Math.random() * 0.22,
  };
}

export default function BubblesBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let bubbles: Bubble[] = [];
    let t = 0;

    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      bubbles = Array.from({ length: 55 }, () =>
        makeBubble(canvas.width, canvas.height, false)
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      bubbles.forEach((b, i) => {
        // Move para cima com oscilação lateral
        b.y -= b.speed;
        b.x += Math.sin(t * b.wobbleFreq + b.phase) * b.wobbleAmp;

        // Reinicia quando sai pelo topo
        if (b.y + b.radius < 0) {
          bubbles[i] = makeBubble(canvas.width, canvas.height, true);
          return;
        }

        // Gradiente radial para efeito translúcido
        const grd = ctx.createRadialGradient(
          b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.05,
          b.x, b.y, b.radius
        );
        grd.addColorStop(0,   `rgba(255,255,255,${b.alpha * 1.1})`);
        grd.addColorStop(0.35,`rgba(${b.r},${b.g},${b.b},${b.alpha})`);
        grd.addColorStop(1,   `rgba(${b.r},${b.g},${b.b},0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Borda sutil
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${b.r},${b.g},${b.b},${b.alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Reflexo pequeno no topo
        ctx.beginPath();
        ctx.ellipse(
          b.x - b.radius * 0.28,
          b.y - b.radius * 0.32,
          b.radius * 0.18,
          b.radius * 0.1,
          -Math.PI / 4,
          0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(255,255,255,${b.alpha * 1.6})`;
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
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}
