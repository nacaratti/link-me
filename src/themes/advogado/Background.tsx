const IMAGE = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80&auto=format&fit=crop';

export default function AdvogadoBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `linear-gradient(to bottom, rgba(12,16,23,0.65) 0%, rgba(12,16,23,0.88) 100%), url('${IMAGE}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} />
  );
}
