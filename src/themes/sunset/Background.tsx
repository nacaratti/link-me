export default function SunsetBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes ss-sun {
          0%,100% { opacity:.8; transform:scale(1); }
          50%  { opacity:1; transform:scale(1.06); }
        }
        @keyframes ss-mag {
          0%,100% { transform:translate(0%,0%); }
          50%  { transform:translate(-8%,-5%); }
        }
        @keyframes ss-vio {
          0%,100% { transform:translate(0%,0%); }
          50%  { transform:translate(9%,3%); }
        }
        @keyframes ss-gold {
          0%,100% { transform:translate(0%,0%) scale(1); }
          40%  { transform:translate(-5%,5%) scale(1.1); }
          80%  { transform:translate(5%,-3%) scale(.95); }
        }
        @keyframes ss-cloud {
          0%,100% { opacity:.18; transform:translateX(0%); }
          50%  { opacity:.32; transform:translateX(-4%); }
        }
      `}</style>

      {/* Sun glow — bottom centre */}
      <div style={{
        position:'absolute', width:'70%', height:'75%', bottom:'-28%', left:'15%',
        background:'radial-gradient(ellipse,rgba(255,120,0,.38) 0%,rgba(255,60,0,.22) 28%,rgba(200,0,80,.1) 55%,transparent 78%)',
        filter:'blur(18px)', animation:'ss-sun 8s ease-in-out infinite',
      }} />

      {/* Magenta atmosphere */}
      <div style={{
        position:'absolute', width:'145%', height:'105%', top:'-2%', left:'-22%',
        background:'radial-gradient(ellipse at 50% 88%,rgba(255,0,120,.32) 0%,rgba(180,0,200,.18) 40%,transparent 68%)',
        animation:'ss-mag 20s ease-in-out infinite',
      }} />

      {/* Violet upper haze */}
      <div style={{
        position:'absolute', width:'145%', height:'72%', top:'-10%', left:'-22%',
        background:'radial-gradient(ellipse at 40% 30%,rgba(100,0,200,.26) 0%,rgba(60,0,120,.14) 48%,transparent 75%)',
        animation:'ss-vio 25s ease-in-out infinite',
      }} />

      {/* Golden shimmer */}
      <div style={{
        position:'absolute', width:'125%', height:'55%', bottom:'-8%', left:'-12%',
        background:'radial-gradient(ellipse at 60% 80%,rgba(255,200,0,.22) 0%,rgba(255,140,0,.15) 34%,transparent 64%)',
        filter:'blur(14px)', animation:'ss-gold 15s ease-in-out infinite',
      }} />

      {/* Subtle cloud streaks */}
      {[20, 42, 60].map((top, i) => (
        <div key={i} style={{
          position:'absolute', width:'80%', height:'1px', top:`${top}%`, left:'10%',
          background:`linear-gradient(90deg,transparent,rgba(255,${160 - i * 30},${60 + i * 20},.35) 30%,rgba(255,${180 - i * 25},${80 + i * 20},.3) 60%,transparent)`,
          filter:'blur(3px)', animation:`ss-cloud ${12 + i * 3}s ease-in-out ${i * 2}s infinite`,
        }} />
      ))}
    </div>
  );
}
