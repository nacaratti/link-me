export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes au-1 {
          0%,100% { transform:translateX(-4%) rotate(-16deg) scaleY(1); opacity:.75; }
          30%  { transform:translateX(3%) rotate(-11deg) scaleY(1.18); opacity:1; }
          65%  { transform:translateX(-7%) rotate(-20deg) scaleY(.85); opacity:.55; }
        }
        @keyframes au-2 {
          0%,100% { transform:translateX(4%) rotate(5deg) scaleY(1); opacity:.55; }
          35%  { transform:translateX(-5%) rotate(9deg) scaleY(1.28); opacity:.9; }
          70%  { transform:translateX(7%) rotate(2deg) scaleY(.8); opacity:.4; }
        }
        @keyframes au-3 {
          0%,100% { transform:translateX(0%) rotate(-3deg) scaleY(1); opacity:.45; }
          50%  { transform:translateX(6%) rotate(-7deg) scaleY(1.35); opacity:.75; }
        }
        @keyframes au-star {
          0%,100% { opacity:.35; }
          50%  { opacity:.85; }
        }
      `}</style>

      {/* Band 1 — green */}
      <div style={{
        position:'absolute', width:'200%', height:'52%', top:'-6%', left:'-50%',
        background:'linear-gradient(180deg,transparent 0%,rgba(0,255,120,.04) 18%,rgba(20,240,140,.19) 44%,rgba(0,210,110,.23) 60%,rgba(0,255,180,.07) 76%,transparent 100%)',
        filter:'blur(28px)', animation:'au-1 16s ease-in-out infinite', transformOrigin:'50% 50%',
      }} />

      {/* Band 2 — teal / cyan */}
      <div style={{
        position:'absolute', width:'185%', height:'44%', top:'14%', left:'-42%',
        background:'linear-gradient(180deg,transparent 0%,rgba(0,220,255,.05) 20%,rgba(0,200,220,.16) 46%,rgba(50,230,220,.12) 66%,transparent 100%)',
        filter:'blur(38px)', animation:'au-2 22s ease-in-out infinite', transformOrigin:'50% 50%',
      }} />

      {/* Band 3 — purple fringe */}
      <div style={{
        position:'absolute', width:'165%', height:'34%', top:'30%', left:'-32%',
        background:'linear-gradient(180deg,transparent 0%,rgba(120,0,255,.04) 24%,rgba(180,50,255,.13) 50%,rgba(255,80,220,.08) 70%,transparent 100%)',
        filter:'blur(50px)', animation:'au-3 18s ease-in-out infinite', transformOrigin:'50% 50%',
      }} />

      {/* Star field */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`
          radial-gradient(circle,rgba(255,255,255,.9) 1px,transparent 1px),
          radial-gradient(circle,rgba(255,255,255,.55) 1px,transparent 1px),
          radial-gradient(circle,rgba(200,240,255,.7) 1px,transparent 1px),
          radial-gradient(circle,rgba(255,255,255,.38) 1px,transparent 1px)
        `,
        backgroundSize:'200px 200px,350px 250px,280px 320px,450px 400px',
        backgroundPosition:'20px 30px,100px 150px,50px 200px,200px 80px',
        animation:'au-star 7s ease-in-out infinite',
      }} />
    </div>
  );
}
