import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function LightBeam({ color = '#00ffff', speed = 1 }: { color?: string; speed?: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [pos] = useState(() => new THREE.Vector3(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 5
  ));
  const [vel] = useState(() => new THREE.Vector3(
    (Math.random() - 0.5) * 0.2 * speed,
    (Math.random() - 0.5) * 0.2 * speed,
    (Math.random() - 0.5) * 0.1 * speed
  ));

  const bounds = { x: 15, y: 10, z: 5 };

  useFrame(() => {
    if (!lightRef.current || !meshRef.current) return;

    pos.add(vel);

    if (Math.abs(pos.x) > bounds.x) vel.x *= -1;
    if (Math.abs(pos.y) > bounds.y) vel.y *= -1;
    if (Math.abs(pos.z) > bounds.z) vel.z *= -1;

    lightRef.current.position.copy(pos);
    meshRef.current.position.copy(pos);
  });

  return (
    <Trail
      width={2}
      length={20}
      color={new THREE.Color(color)}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight ref={lightRef} intensity={15} distance={8} color={color} />
    </Trail>
  );
}

export default function LaserScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />
      <color attach="background" args={['#010101']} />

      <ambientLight intensity={0.05} />

      <LightBeam color="#00ffff" speed={1.2} />
      <LightBeam color="#ff00ff" speed={0.8} />
      <LightBeam color="#00ff00" speed={1.5} />
      <LightBeam color="#ffff00" speed={1.1} />
      <LightBeam color="#ff4400" speed={1.3} />
      <LightBeam color="#4400ff" speed={0.9} />

      <Environment preset="night" />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.5} radius={0.6} />
      </EffectComposer>
    </>
  );
}
