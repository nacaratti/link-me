export default function DesignerBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, background: '#fafaf7' }}>
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.20 }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 1200"
      >
        <polygon points="0,200 200,200 100,30" fill="#f5c63d" opacity="0.75" />
        <rect x="600" y="80" width="160" height="160" fill="#d94a3a" opacity="0.75" />
        <circle cx="100" cy="1000" r="120" fill="#3960a8" opacity="0.75" />
        <circle cx="700" cy="1100" r="50" fill="none" stroke="#1a1a1a" strokeWidth="2" opacity="0.55" />
        <line x1="0" y1="600" x2="800" y2="600" stroke="#1a1a1a" strokeWidth="1" />
        <line x1="400" y1="0" x2="400" y2="1200" stroke="#1a1a1a" strokeWidth="1" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(250,250,247,0.55) 0%, rgba(250,250,247,0.0) 60%)',
      }} />
    </div>
  );
}
