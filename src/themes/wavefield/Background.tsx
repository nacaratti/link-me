import { Canvas } from '@react-three/fiber';
import WaveFieldScene from './Scene';

export default function WaveFieldBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
        <color attach="background" args={['#000814']} />
        <WaveFieldScene />
      </Canvas>
      {/* Vignette + fade top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#000814_100%)]" />
    </div>
  );
}
