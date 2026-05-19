export default function FotografoBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#0a0a0a' }}>
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.18, mixBlendMode: 'overlay' }}>
        <filter id="foto-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.85 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#foto-grain)" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="55%" height="55%" viewBox="0 0 100 100" style={{ opacity: 0.08, maxWidth: 280 }}>
          <g fill="none" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round">
            <circle cx="50" cy="50" r="38" />
            <circle cx="50" cy="50" r="28" />
            <polygon points="50,18 75,32 75,68 50,82 25,68 25,32" strokeWidth="0.5" />
            <polygon points="50,28 68,40 68,60 50,72 32,60 32,40" strokeWidth="0.4" />
          </g>
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, bottom: 16,
        border: '1px solid rgba(255,255,255,0.18)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.45) 100%)',
      }} />
    </div>
  );
}
