import { Canvas } from '@react-three/fiber';
import VoidScene from './VoidScene';

export default function VoidBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
        <VoidScene />
      </Canvas>
      {/* Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#050505_100%)]" />
    </div>
  );
}
