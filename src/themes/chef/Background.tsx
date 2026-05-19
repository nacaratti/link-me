export default function ChefBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#2a2522' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #3a3530 0%, #1a1614 100%)',
      }} />

      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.10 }}>
        <filter id="chef-stone">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.55  0 0 0 0 0.40  0 0 0 0.55 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#chef-stone)" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="55%" height="55%" viewBox="0 0 100 100" style={{ opacity: 0.11, maxWidth: 280 }}>
          <g fill="none" stroke="#b87333" strokeWidth="0.7" strokeLinecap="round">
            <g transform="rotate(-30 50 50)">
              <line x1="30" y1="20" x2="30" y2="80" />
              <path d="M 27 18 L 33 18 L 33 35 L 27 35 Z" />
            </g>
            <g transform="rotate(30 50 50)">
              <line x1="70" y1="35" x2="70" y2="80" />
              <line x1="65" y1="20" x2="65" y2="35" />
              <line x1="68" y1="20" x2="68" y2="35" />
              <line x1="72" y1="20" x2="72" y2="35" />
              <line x1="75" y1="20" x2="75" y2="35" />
              <path d="M 65 35 L 75 35" />
            </g>
            <circle cx="50" cy="55" r="35" />
            <circle cx="50" cy="55" r="28" />
          </g>
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,115,51,0.7) 50%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,115,51,0.7) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(26,22,20,0.55) 100%)',
      }} />
    </div>
  );
}
