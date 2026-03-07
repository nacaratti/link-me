import { Canvas } from '@react-three/fiber';
import LaserScene from './LaserScene';

export default function LaserBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} frameloop="always">
        <LaserScene />
      </Canvas>
    </div>
  );
}
