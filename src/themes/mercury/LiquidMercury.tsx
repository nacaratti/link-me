import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uBlobs[60];
  uniform int uBlobCount;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = vUv;
    float aspect = uResolution.x / uResolution.y;

    vec2 distortedST = st;
    distortedST.x *= aspect;
    distortedST += snoise(st * 2.5 + uTime * 0.15) * 0.09;

    float sum = 0.0;
    for (int i = 0; i < 20; i++) {
      if (i >= uBlobCount) break;
      vec2 bPos = vec2(uBlobs[i*3], uBlobs[i*3+1]);
      bPos.x *= aspect;
      float bRad = uBlobs[i*3+2];
      float d = distance(distortedST, bPos);
      sum += (bRad * bRad) / (d * d);
    }

    float threshold = 1.0;
    float edge = 0.01;
    float alpha = smoothstep(threshold - edge, threshold + edge, sum);

    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

const BLOB_COUNT = 7;

export default function LiquidMercury() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();

  // Mutable blob state — persists across re-renders without recreating
  const blobs = useRef(
    Array.from({ length: BLOB_COUNT }, () => ({
      x: 0.3 + Math.random() * 0.4,
      y: 0.2 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.0012,
      vy: (Math.random() - 0.5) * 0.0012,
      radius: 0.055 + Math.random() * 0.04,
    }))
  );

  // Pre-allocated buffer — never recreated, avoids GC pressure
  const blobsBuffer = useRef(new Float32Array(60));

  // Uniforms created once — size is updated every frame in useFrame,
  // so we don't include it as a dependency (avoids ShaderMaterial teardown on resize)
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uBlobs: { value: blobsBuffer.current },
    uBlobCount: { value: BLOB_COUNT },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uResolution.value.set(size.width, size.height);

    const buf = blobsBuffer.current;
    blobs.current.forEach((b, i) => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < 0.1 || b.x > 0.9) b.vx *= -1;
      if (b.y < 0.05 || b.y > 0.95) b.vy *= -1;
      buf[i * 3]     = b.x;
      buf[i * 3 + 1] = b.y;
      buf[i * 3 + 2] = b.radius;
    });
    // Mutate in place — Three.js reads the reference each frame
    mat.uniforms.uBlobs.value = buf;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
