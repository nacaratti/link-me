export default function NoirBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#000000' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(40,28,12,0.55) 0%, #000000 80%)',
      }} />

      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 10%, rgba(201,168,76,0.85) 50%, transparent 90%)',
      }} />

      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07, mixBlendMode: 'overlay' }}>
        <filter id="noir-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.85 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noir-grain)" />
      </svg>
    </div>
  );
}
