import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ScanLinesScene() {
  const mesh = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00f2ff') },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
    mesh.current.rotation.x += 0.005;
    mesh.current.rotation.y += 0.008;
  });

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    void main() {
      float scan = sin(vUv.y * 100.0 + uTime * 10.0);
      scan = step(0.8, scan);
      vec3 color = mix(vec3(0.01), uColor, scan * 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  return (
    <>
      {/* Main torus */}
      <mesh ref={mesh}>
        <torusGeometry args={[1.4, 0.5, 32, 100]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      {/* Secondary smaller torus, counter-rotating */}
      <SecondaryTorus uniforms={uniforms} />
    </>
  );
}

function SecondaryTorus({ uniforms }: { uniforms: Record<string, { value: unknown }> }) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    mesh.current.rotation.x -= 0.007;
    mesh.current.rotation.z += 0.004;
  });

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    void main() {
      float scan = sin(vUv.y * 80.0 + uTime * 8.0);
      scan = step(0.85, scan);
      vec3 color = mix(vec3(0.01), uColor * 0.7, scan * 0.4);
      gl_FragColor = vec4(color, 0.7);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  return (
    <mesh ref={mesh} rotation={[Math.PI / 3, 0, 0]}>
      <torusGeometry args={[2.2, 0.25, 24, 80]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
