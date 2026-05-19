export default function PersonalBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#1a1a1a' }}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="personal-motion" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff6b35" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="-50" y1="20%" x2="120%" y2="22%" stroke="url(#personal-motion)" strokeWidth="1" />
        <line x1="-50" y1="40%" x2="120%" y2="38%" stroke="url(#personal-motion)" strokeWidth="0.6" />
        <line x1="-50" y1="65%" x2="120%" y2="68%" stroke="url(#personal-motion)" strokeWidth="1.4" />
        <line x1="-50" y1="85%" x2="120%" y2="83%" stroke="url(#personal-motion)" strokeWidth="0.8" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,107,53,0.10) 0%, transparent 70%)',
      }} />

      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }}>
        <pattern id="personal-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.6" fill="#ffffff" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#personal-dots)" />
      </svg>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, #ff6b35 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(26,26,26,0.6) 100%)',
      }} />
    </div>
  );
}
