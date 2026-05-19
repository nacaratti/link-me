const HERO_IMAGE =
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85&auto=format&fit=crop';

export default function AdvogadoBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, background: '#0a0f1c' }}
    >
      {/* Atmospheric photo — heavily blurred + desaturated, never competes with text */}
      <div
        style={{
          position: 'absolute',
          inset: '-30px',
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'blur(28px) brightness(0.5) saturate(0.55) contrast(0.95)',
          opacity: 0.55,
        }}
      />

      {/* Strong dark overlay — drops the photo to mood-only role */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,15,28,0.72) 0%, rgba(10,15,28,0.90) 100%)',
        }}
      />

      {/* Warm gold glow up top — subtle depth, premium feel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 22%, rgba(201,168,76,0.10) 0%, transparent 60%)',
        }}
      />

      {/* Edge vignette focuses attention to center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(5,8,15,0.7) 100%)',
        }}
      />
    </div>
  );
}
