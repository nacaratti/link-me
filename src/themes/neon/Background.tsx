export default function NeonBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes ng-scroll {
          from { background-position:0 0; }
          to   { background-position:0 60px; }
        }
        @keyframes ng-horizon {
          0%,100% { opacity:.55; }
          50%  { opacity:1; }
        }
        @keyframes ng-orb1 {
          0%,100% { opacity:.7; transform:scale(1); }
          50%  { opacity:1; transform:scale(1.22); }
        }
        @keyframes ng-orb2 {
          0%,100% { opacity:.55; transform:scale(1); }
          50%  { opacity:.9; transform:scale(1.3); }
        }
        @keyframes ng-scan {
          0%   { transform:translateY(-8px); opacity:.06; }
          50%  { opacity:.12; }
          100% { transform:translateY(100vh); opacity:.06; }
        }
      `}</style>

      {/* Perspective grid */}
      <div style={{
        position:'absolute', width:'100%', height:'62%', bottom:0,
        backgroundImage:`
          repeating-linear-gradient(to right,rgba(0,255,220,.18) 0px,rgba(0,255,220,.18) 1px,transparent 1px,transparent 60px),
          repeating-linear-gradient(to bottom,rgba(0,255,220,.18) 0px,rgba(0,255,220,.18) 1px,transparent 1px,transparent 60px)
        `,
        backgroundSize:'60px 60px',
        transform:'perspective(340px) rotateX(56deg)',
        transformOrigin:'bottom center',
        animation:'ng-scroll 1.4s linear infinite',
        maskImage:'linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.7) 14%,black 100%)',
        WebkitMaskImage:'linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.7) 14%,black 100%)',
      }} />

      {/* Horizon glow line */}
      <div style={{
        position:'absolute', width:'100%', height:'1px', bottom:'60%',
        background:'linear-gradient(90deg,transparent,rgba(0,255,220,.85) 18%,rgba(255,0,220,1) 50%,rgba(0,255,220,.85) 82%,transparent)',
        filter:'blur(2px)', animation:'ng-horizon 3s ease-in-out infinite',
      }} />
      <div style={{
        position:'absolute', width:'100%', height:'22px', bottom:'59%',
        background:'linear-gradient(180deg,rgba(255,0,200,.28) 0%,rgba(0,255,220,.1) 55%,transparent 100%)',
        filter:'blur(7px)', animation:'ng-horizon 3s ease-in-out infinite',
      }} />

      {/* Orb — cyan, upper left */}
      <div style={{
        position:'absolute', width:'320px', height:'320px', top:'-110px', left:'-110px',
        background:'radial-gradient(circle,rgba(0,255,220,.5) 0%,rgba(0,200,255,.18) 38%,transparent 68%)',
        filter:'blur(18px)', animation:'ng-orb1 7s ease-in-out infinite',
      }} />

      {/* Orb — magenta, upper right */}
      <div style={{
        position:'absolute', width:'290px', height:'290px', top:'-90px', right:'-90px',
        background:'radial-gradient(circle,rgba(255,0,200,.5) 0%,rgba(200,0,255,.18) 38%,transparent 68%)',
        filter:'blur(18px)', animation:'ng-orb2 9s ease-in-out infinite',
      }} />

      {/* Scanline */}
      <div style={{
        position:'absolute', width:'100%', height:'3px',
        background:'linear-gradient(180deg,transparent,rgba(0,255,220,.08),transparent)',
        animation:'ng-scan 5s linear infinite',
      }} />
    </div>
  );
}
