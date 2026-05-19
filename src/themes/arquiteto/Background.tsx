export default function ArquitetoBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#f4ede0' }}>
      <svg className="absolute inset-0 w-full h-full">
        <pattern id="arq-fine" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3a3327" strokeWidth="0.3" opacity="0.13" />
        </pattern>
        <pattern id="arq-coarse" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#arq-fine)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#3a3327" strokeWidth="0.6" opacity="0.20" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#arq-coarse)" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="65%" height="65%" viewBox="0 0 200 200" style={{ opacity: 0.13, maxWidth: 380 }}>
          <g fill="none" stroke="#3a3327" strokeWidth="0.7" strokeLinecap="round">
            <rect x="20" y="20" width="160" height="160" />
            <line x1="20" y1="100" x2="100" y2="100" />
            <line x1="100" y1="100" x2="100" y2="180" />
            <line x1="140" y1="20" x2="140" y2="60" />
            <line x1="140" y1="60" x2="180" y2="60" />
            <path d="M 100 100 A 12 12 0 0 1 112 88" />
            <line x1="20" y1="10" x2="180" y2="10" strokeWidth="0.4" />
            <line x1="20" y1="6" x2="20" y2="14" strokeWidth="0.4" />
            <line x1="180" y1="6" x2="180" y2="14" strokeWidth="0.4" />
            <line x1="10" y1="20" x2="10" y2="180" strokeWidth="0.4" />
            <line x1="6" y1="20" x2="14" y2="20" strokeWidth="0.4" />
            <line x1="6" y1="180" x2="14" y2="180" strokeWidth="0.4" />
          </g>
        </svg>
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(244,237,224,0.6) 100%)',
      }} />
    </div>
  );
}
