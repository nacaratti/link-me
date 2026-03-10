const IMAGE = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80&auto=format&fit=crop';

export default function MedicoBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `linear-gradient(to bottom, rgba(4,18,24,0.6) 0%, rgba(4,18,24,0.88) 100%), url('${IMAGE}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} />
  );
}
