export default function PsicologoBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#f5ede0' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(ellipse 70% 80% at 50% 40%, rgba(255,255,255,0.5) 0%, transparent 60%), linear-gradient(160deg, #f5ede0 0%, #e8ddd0 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="65%" height="65%" viewBox="0 0 200 200" style={{ opacity: 0.12, maxWidth: 380 }}>
          <g fill="none" stroke="#a05a3c" strokeWidth="0.8" strokeLinecap="round">
            <path d="M100,100 a30,30 0 0 1 30,-30 a48,48 0 0 1 30,48 a60,60 0 0 1 -78,30 a90,90 0 0 1 -30,-78 a108,108 0 0 1 48,-30" />
            <circle cx="100" cy="100" r="2" fill="#a05a3c" />
          </g>
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(122,138,108,0.45) 50%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(160,90,60,0.45) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(232,221,208,0.5) 100%)',
      }} />
    </div>
  );
}
