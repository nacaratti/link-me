export default function NutricionistaBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#f7f9f4' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(ellipse 60% 70% at 50% 30%, rgba(255,255,255,0.7) 0%, transparent 70%), linear-gradient(180deg, #f7f9f4 0%, #eef2e6 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="60%" height="60%" viewBox="0 0 100 100" style={{ opacity: 0.11, maxWidth: 320 }}>
          <g fill="none" stroke="#5a7a4a" strokeWidth="0.8" strokeLinecap="round">
            <path d="M50,15 Q 25,40 30,75 Q 50,85 70,75 Q 75,40 50,15 Z" />
            <line x1="50" y1="15" x2="50" y2="85" />
            <path d="M50,30 Q 40,38 35,50" />
            <path d="M50,30 Q 60,38 65,50" />
            <path d="M50,45 Q 40,53 35,65" />
            <path d="M50,45 Q 60,53 65,65" />
            <path d="M50,60 Q 42,68 38,75" />
            <path d="M50,60 Q 58,68 62,75" />
          </g>
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(90,122,74,0.4) 50%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(90,122,74,0.4) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(238,242,230,0.5) 100%)',
      }} />
    </div>
  );
}
