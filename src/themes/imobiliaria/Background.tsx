export default function ImobiliariaBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#1a1d24' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 80% at 50% 30%, #242830 0%, #0f1218 100%)',
      }} />

      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="imob-col" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4b896" stopOpacity="0" />
            <stop offset="50%" stopColor="#d4b896" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d4b896" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="15%" y1="0" x2="15%" y2="100%" stroke="url(#imob-col)" strokeWidth="0.6" opacity="0.7" />
        <line x1="35%" y1="0" x2="35%" y2="100%" stroke="url(#imob-col)" strokeWidth="0.6" opacity="0.7" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="url(#imob-col)" strokeWidth="0.8" opacity="0.7" />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="url(#imob-col)" strokeWidth="0.6" opacity="0.7" />
        <line x1="85%" y1="0" x2="85%" y2="100%" stroke="url(#imob-col)" strokeWidth="0.6" opacity="0.7" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="55%" height="55%" viewBox="0 0 100 100" style={{ opacity: 0.09, maxWidth: 280 }}>
          <g fill="none" stroke="#d4b896" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="50,15 80,40 80,80 20,80 20,40" />
            <polyline points="20,40 50,15 80,40" />
            <rect x="42" y="55" width="16" height="25" />
            <rect x="28" y="48" width="10" height="10" />
            <rect x="62" y="48" width="10" height="10" />
          </g>
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(212,184,150,0.65) 50%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(212,184,150,0.65) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(15,18,24,0.55) 100%)',
      }} />
    </div>
  );
}
