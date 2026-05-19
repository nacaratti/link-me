export default function CoachBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#3a0e1a' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #5a1c2a 0%, #2a0712 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="55%" height="55%" viewBox="0 0 100 100" style={{ opacity: 0.11, maxWidth: 280 }}>
          <g fill="none" stroke="#c9a86b" strokeWidth="0.6" strokeLinecap="round">
            <polygon points="50,15 85,50 50,85 15,50" />
            <polygon points="50,28 72,50 50,72 28,50" />
            <line x1="50" y1="15" x2="50" y2="85" />
            <line x1="15" y1="50" x2="85" y2="50" />
            <circle cx="50" cy="50" r="3" fill="#c9a86b" />
          </g>
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,107,0.7) 50%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,107,0.7) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(42,7,18,0.6) 100%)',
      }} />
    </div>
  );
}
