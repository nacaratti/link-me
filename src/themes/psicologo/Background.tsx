const IMAGE = 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=1920&q=80&auto=format&fit=crop';

export default function PsicologoBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `linear-gradient(to bottom, rgba(15,10,30,0.62) 0%, rgba(15,10,30,0.88) 100%), url('${IMAGE}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} />
  );
}
