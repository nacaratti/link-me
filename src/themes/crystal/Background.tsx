import { Canvas } from '@react-three/fiber';
import CrystalLatticeScene from './Scene';

export default function CrystalBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 55 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
        <color attach="background" args={['#00050a']} />
        <ambientLight intensity={0.2} />
        <CrystalLatticeScene />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,5,10,0.9)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00050a]/90 via-transparent to-[#00050a]/70" />
    </div>
  );
}
