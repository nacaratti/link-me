import { Canvas } from '@react-three/fiber';
import LiquidMercury from './LiquidMercury';

/**
 * Renders the Liquid Mercury WebGL canvas.
 * Must be placed inside a `position: relative; overflow: hidden` container.
 * mix-blend-mode: screen makes white blobs glow over the dark background.
 */
export default function MercuryBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: 'screen' }}
    >
      <Canvas
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <LiquidMercury />
      </Canvas>
    </div>
  );
}
