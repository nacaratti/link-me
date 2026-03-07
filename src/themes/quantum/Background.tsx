import { Canvas } from '@react-three/fiber';
import QuantumScene from './QuantumSphere';

export default function QuantumBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
        <QuantumScene />
      </Canvas>
      {/* Depth gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
    </div>
  );
}
