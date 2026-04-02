import { Canvas } from '@react-three/fiber';
import FractalScene from './Scene';

export default function FractalBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
        <FractalScene />
      </Canvas>
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
    </div>
  );
}
