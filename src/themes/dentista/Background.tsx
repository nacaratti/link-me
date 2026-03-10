const IMAGE = 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1920&q=80&auto=format&fit=crop';

export default function DentistaBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `linear-gradient(to bottom, rgba(7,26,23,0.62) 0%, rgba(7,26,23,0.88) 100%), url('${IMAGE}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} />
  );
}
