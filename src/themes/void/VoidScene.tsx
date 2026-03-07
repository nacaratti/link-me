import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function ParticleCloud({
  count,
  spread,
  size,
  opacity,
  speedY,
  speedX,
  color,
}: {
  count: number;
  spread: number;
  size: number;
  opacity: number;
  speedY: number;
  speedX: number;
  color: string;
}) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3]     = (Math.random() - 0.5) * spread;
      p[i * 3 + 1] = (Math.random() - 0.5) * spread;
      p[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return p;
  }, [count, spread]);

  const ref = useRef<THREE.Points>(null!);

  useFrame(() => {
    ref.current.rotation.y += speedY;
    ref.current.rotation.x += speedX;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function VoidScene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 6, 18]} />

      <ambientLight intensity={0.3} />
      <pointLight position={[-8, -8, -8]} color="#3730a3" intensity={1.5} />
      <pointLight position={[8, 4, 4]} color="#1e1b4b" intensity={1} />

      {/* Core dense cloud — slow, medium particles */}
      <ParticleCloud
        count={1200}
        spread={10}
        size={0.018}
        opacity={0.55}
        speedY={0.0008}
        speedX={0.0004}
        color="#ffffff"
      />

      {/* Outer wispy shell — faster, tiny */}
      <ParticleCloud
        count={800}
        spread={16}
        size={0.01}
        opacity={0.3}
        speedY={-0.0012}
        speedX={0.0006}
        color="#a5b4fc"
      />

      {/* Inner bright nucleus — slow micro-particles */}
      <ParticleCloud
        count={400}
        spread={4}
        size={0.022}
        opacity={0.7}
        speedY={0.0015}
        speedX={-0.0008}
        color="#e0e7ff"
      />

      <Stars radius={100} depth={60} count={4000} factor={4} saturation={0} fade speed={0.6} />
    </>
  );
}
