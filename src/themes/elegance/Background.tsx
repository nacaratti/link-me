export default function EleganceBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, background: '#053830' }}
    >
      {/* Logo centralizada, suave, como marca d'água */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src="/elegance-logo.png"
          alt=""
          style={{
            width: '60%',
            maxWidth: '320px',
            opacity: 0.12,
            userSelect: 'none',
            draggable: 'false',
          } as React.CSSProperties}
        />
      </div>

      {/* Linha de ouro sutil no topo */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,151,62,.6) 30%, rgba(196,168,90,.9) 50%, rgba(184,151,62,.6) 70%, transparent)',
      }} />

      {/* Linha de ouro sutil na base */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,151,62,.6) 30%, rgba(196,168,90,.9) 50%, rgba(184,151,62,.6) 70%, transparent)',
      }} />

      {/* Vinheta leve para legibilidade do conteúdo */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,56,48,.55) 100%)',
      }} />
    </div>
  );
}
