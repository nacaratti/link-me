export default function BeyhiveBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: '#000' }}>
      {/* Vídeo enquadrado (contain) em ambos mobile e desktop */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/temas/bey.mp4"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'contain' }}
      />

      {/* Filtro escuro */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'rgba(0,0,0,0.52)',
        }}
      />
    </div>
  );
}
