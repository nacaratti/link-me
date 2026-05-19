export default function DentistaBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, background: 'linear-gradient(135deg, #f0f4f8 0%, #e6f0ee 100%)' }}
    >
      <svg className="absolute inset-0 w-full h-full">
        <pattern id="dentista-hex" x="0" y="0" width="42" height="48" patternUnits="userSpaceOnUse">
          <polygon
            points="21,2 39,12 39,36 21,46 3,36 3,12"
            fill="none"
            stroke="#0d9488"
            strokeWidth="0.5"
            opacity="0.18"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dentista-hex)" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 50% 60% at 50% 30%, rgba(255,255,255,0.7) 0%, transparent 60%)',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.5) 50%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.5) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(230,240,238,0.55) 100%)',
      }} />
    </div>
  );
}
