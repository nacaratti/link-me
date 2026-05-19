export default function LinenBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#f5efe4' }}>
      <svg className="absolute inset-0 w-full h-full">
        <pattern id="linen-h" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
          <line x1="0" y1="1.5" x2="3" y2="1.5" stroke="#a08c6c" strokeWidth="0.4" opacity="0.20" />
        </pattern>
        <pattern id="linen-v" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
          <line x1="1.5" y1="0" x2="1.5" y2="3" stroke="#a08c6c" strokeWidth="0.4" opacity="0.13" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#linen-h)" />
        <rect width="100%" height="100%" fill="url(#linen-v)" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 30%, rgba(255,250,240,0.55) 0%, transparent 70%)',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(140,100,70,0.42) 50%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(140,100,70,0.42) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(245,239,228,0.45) 100%)',
      }} />
    </div>
  );
}
