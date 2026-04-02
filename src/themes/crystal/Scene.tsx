import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 8;
const TOTAL = COUNT * COUNT * COUNT;

export default function CrystalLatticeScene() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    let i = 0;
    for (let x = 0; x < COUNT; x++) {
      for (let y = 0; y < COUNT; y++) {
        for (let z = 0; z < COUNT; z++) {
          const s = Math.sin(time * 0.8 + (x + y + z) * 0.5) * 0.5 + 0.5;
          dummy.position.set(
            (x - COUNT / 2) * 0.9,
            (y - COUNT / 2) * 0.9,
            (z - COUNT / 2) * 0.9,
          );
          dummy.scale.setScalar(s * 0.18 + 0.02);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i++, dummy.matrix);
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.12;
    meshRef.current.rotation.x = time * 0.06;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00f2ff" wireframe />
    </instancedMesh>
  );
}
