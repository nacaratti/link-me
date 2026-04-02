import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WaveFieldScene() {
  const mesh = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00f2ff') },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + uTime) * 0.2;
      pos.z += cos(pos.y * 2.5 + uTime * 0.8) * 0.2;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform vec3 uColor;
    void main() {
      float grid = sin(vUv.x * 50.0) * sin(vUv.y * 50.0);
      grid = step(0.9, grid);
      vec3 color = mix(vec3(0.02), uColor, grid);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 3, 0, 0]}>
      <planeGeometry args={[8, 8, 120, 120]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
