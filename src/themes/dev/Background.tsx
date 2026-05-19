const CODE_LINES = [
  '{ }       < />          ( )           [ ]',
  '       =>            const            void',
  '',
  '   const auth = async () => {',
  '     return await session.user;',
  '   }',
  '',
  '         { }       < />          ( )',
  '              =>            const',
];

export default function DevBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, background: '#0a0e1a' }}>
      <svg className="absolute inset-0 w-full h-full">
        <pattern id="dev-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#22d3ee" strokeWidth="0.4" opacity="0.18" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dev-grid)" />
      </svg>

      <pre style={{
        position: 'absolute', inset: 0,
        margin: 0,
        padding: '40px 24px',
        fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, "Courier New", monospace',
        color: '#22d3ee',
        opacity: 0.06,
        userSelect: 'none',
        fontSize: '13px',
        lineHeight: '24px',
        whiteSpace: 'pre',
        pointerEvents: 'none',
      }}>
        {CODE_LINES.join('\n')}
      </pre>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.6) 50%, transparent)',
      }} />

      <div style={{
        position: 'absolute', bottom: 16, left: 24,
        fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, "Courier New", monospace',
        color: '#22d3ee',
        opacity: 0.55,
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span>~</span>
        <span style={{
          display: 'inline-block', width: '7px', height: '14px',
          background: '#22d3ee',
          animation: 'dev-blink 1.2s steps(2) infinite',
        }} />
      </div>
      <style>{`@keyframes dev-blink { 50% { opacity: 0; } }`}</style>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(10,14,26,0.7) 100%)',
      }} />
    </div>
  );
}
