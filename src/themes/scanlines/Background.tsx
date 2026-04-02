import { Canvas } from '@react-three/fiber';
import ScanLinesScene from './Scene';

export default function ScanLinesBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
        <color attach="background" args={['#000000']} />
        <ScanLinesScene />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
    </div>
  );
}
