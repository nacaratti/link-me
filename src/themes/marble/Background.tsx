export default function MarbleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#f5f3ef' }}>
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }}>
        <filter id="marble-vein">
          <feTurbulence type="turbulence" baseFrequency="0.012 0.025" numOctaves="3" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="40" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.52  0 0 0 0 0.50  0 0 0 0.55 0" />
        </filter>
        <rect width="100%" height="100%" fill="#cccac4" filter="url(#marble-vein)" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 70% at 50% 30%, rgba(255,255,255,0.65) 0%, transparent 70%)',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(190,140,120,0.55) 50%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(190,140,120,0.55) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(245,243,239,0.5) 100%)',
      }} />
    </div>
  );
}
