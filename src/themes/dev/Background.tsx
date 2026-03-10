const IMAGE = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80&auto=format&fit=crop';

export default function DevBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `linear-gradient(to bottom, rgba(8,18,8,0.55) 0%, rgba(8,18,8,0.85) 100%), url('${IMAGE}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} />
  );
}
