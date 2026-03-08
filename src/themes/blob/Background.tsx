export default function BlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes bl-1 {
          0%,100% { border-radius:62% 38% 32% 68%/58% 32% 68% 42%; transform:translate(0%,0%) scale(1); }
          25%  { border-radius:32% 62% 68% 38%/50% 60% 32% 58%; transform:translate(3%,-4%) scale(1.06); }
          50%  { border-radius:42% 68% 48% 58%/42% 52% 58% 48%; transform:translate(-3%,3%) scale(.95); }
          75%  { border-radius:68% 32% 42% 58%/32% 68% 42% 58%; transform:translate(4%,2%) scale(1.02); }
        }
        @keyframes bl-2 {
          0%,100% { border-radius:42% 58% 58% 42%/52% 42% 58% 48%; transform:translate(0%,0%) scale(1); }
          35%  { border-radius:58% 42% 42% 58%/32% 58% 42% 68%; transform:translate(-5%,4%) scale(1.09); }
          70%  { border-radius:48% 52% 68% 32%/58% 42% 52% 52%; transform:translate(5%,-3%) scale(.92); }
        }
        @keyframes bl-3 {
          0%,100% { border-radius:52% 48% 32% 68%/58% 42% 62% 38%; transform:translate(0%,0%) scale(1); }
          50%  { border-radius:68% 32% 52% 48%/42% 58% 38% 62%; transform:translate(-3%,-5%) scale(1.12); }
        }
      `}</style>

      {/* Blob 1 — lavender */}
      <div style={{
        position:'absolute', width:'62%', height:'56%', top:'-12%', left:'-14%',
        background:'rgba(180,130,255,.38)', filter:'blur(52px)',
        animation:'bl-1 12s ease-in-out infinite',
      }} />

      {/* Blob 2 — mint */}
      <div style={{
        position:'absolute', width:'56%', height:'52%', top:'22%', right:'-10%',
        background:'rgba(90,230,190,.32)', filter:'blur(56px)',
        animation:'bl-2 16s ease-in-out infinite',
      }} />

      {/* Blob 3 — peach */}
      <div style={{
        position:'absolute', width:'52%', height:'48%', bottom:'-6%', left:'18%',
        background:'rgba(255,155,175,.3)', filter:'blur(62px)',
        animation:'bl-3 14s ease-in-out infinite',
      }} />
    </div>
  );
}
