import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Particle = ({
  position,
  color,
  scale = 1,
  distort = 0.4,
  speed = 2,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  distort?: number;
  speed?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.2;
    ref.current.rotation.x = t * 0.5;
    ref.current.rotation.z = t * 0.3;
  });

  return (
    <Sphere ref={ref} args={[1, 32, 32]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.8}
        distort={distort}
        speed={speed}
      />
    </Sphere>
  );
};

export default function QuantumScene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#ccccff" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Particle position={[0, 0, 0]} color="#cccccc" scale={1.2} distort={0.45} speed={1.8} />
      </Float>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Particle position={[-3, 1, -2]} color="#aaaaaa" scale={0.5} distort={0.5} speed={2.5} />
        <Particle position={[3, -1, -3]} color="#dddddd" scale={0.6} distort={0.35} speed={2} />
      </Float>

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <Particle position={[-2, -2, -4]} color="#bbbbbb" scale={0.4} distort={0.6} speed={3} />
        <Particle position={[2.5, 2, -5]} color="#cccccc" scale={0.35} distort={0.4} speed={1.5} />
      </Float>

      <Stars radius={100} depth={50} count={1200} factor={4} saturation={0} fade speed={0.8} />
    </>
  );
}
