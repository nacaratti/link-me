const PHOTO =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=85&auto=format&fit=crop';

export default function MedicoBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, background: '#020c18' }}
    >
      {/* Photo — blurred, deep navy tint */}
      <div
        style={{
          position: 'absolute',
          inset: '-30px',
          backgroundImage: `url('${PHOTO}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          filter: 'blur(22px) brightness(0.22) saturate(0.5)',
          opacity: 0.9,
        }}
      />

      {/* Cinematic sapphire overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(2,12,24,0.55) 0%, rgba(3,18,42,0.40) 40%, rgba(2,12,24,0.80) 100%)',
        }}
      />

      {/* Cyan crown glow — focal depth from top */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(14,165,233,0.18) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)',
        }}
      />

      {/* Fine precision grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(56,189,248,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.035) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* DNA double helix — diagonal watermark */}
      <svg
        className="absolute"
        style={{ left: '-5%', top: 0, width: '110%', height: '100%', opacity: 0.11 }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
        aria-hidden="true"
      >
        {/* Strand A */}
        <path
          d="M-50 0 C100 80, 300 200, 500 250 S900 320, 1050 400"
          stroke="#38bdf8" strokeWidth="1.8" fill="none"
        />
        <path
          d="M-50 150 C100 230, 300 350, 500 400 S900 470, 1050 550"
          stroke="#38bdf8" strokeWidth="1.8" fill="none"
        />
        <path
          d="M-50 300 C100 380, 300 500, 500 550 S900 620, 1050 700"
          stroke="#38bdf8" strokeWidth="1.8" fill="none"
        />
        <path
          d="M-50 450 C100 530, 300 650, 500 700 S900 770, 1050 850"
          stroke="#38bdf8" strokeWidth="1.8" fill="none"
        />
        <path
          d="M-50 600 C100 680, 300 800, 500 850 S900 920, 1050 1000"
          stroke="#38bdf8" strokeWidth="1.8" fill="none"
        />
        {/* Strand B — offset phase */}
        <path
          d="M-50 75 C100 155, 300 275, 500 325 S900 395, 1050 475"
          stroke="#7dd3fc" strokeWidth="1.4" fill="none"
        />
        <path
          d="M-50 225 C100 305, 300 425, 500 475 S900 545, 1050 625"
          stroke="#7dd3fc" strokeWidth="1.4" fill="none"
        />
        <path
          d="M-50 375 C100 455, 300 575, 500 625 S900 695, 1050 775"
          stroke="#7dd3fc" strokeWidth="1.4" fill="none"
        />
        <path
          d="M-50 525 C100 605, 300 725, 500 775 S900 845, 1050 925"
          stroke="#7dd3fc" strokeWidth="1.4" fill="none"
        />
        {/* Crossbars connecting the strands */}
        <line x1="50"  y1="38"  x2="50"  y2="113" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="150" y1="100" x2="150" y2="175" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="250" y1="162" x2="250" y2="237" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="350" y1="212" x2="350" y2="287" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="450" y1="237" x2="450" y2="312" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="550" y1="255" x2="550" y2="330" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="650" y1="275" x2="650" y2="350" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="750" y1="295" x2="750" y2="370" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="850" y1="310" x2="850" y2="385" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="950" y1="325" x2="950" y2="400" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="50"  y1="188" x2="50"  y2="263" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="150" y1="250" x2="150" y2="325" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="250" y1="312" x2="250" y2="387" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="350" y1="362" x2="350" y2="437" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="450" y1="387" x2="450" y2="462" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="550" y1="405" x2="550" y2="480" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="650" y1="425" x2="650" y2="500" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="750" y1="445" x2="750" y2="520" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="850" y1="460" x2="850" y2="535" stroke="#38bdf8" strokeWidth="0.8" />
        <line x1="950" y1="475" x2="950" y2="550" stroke="#38bdf8" strokeWidth="0.8" />
      </svg>

      {/* Molecular nodes — left side */}
      <svg
        className="absolute"
        style={{ left: 0, top: 0, width: '30%', height: '50%', opacity: 0.22 }}
        viewBox="0 0 300 500"
        aria-hidden="true"
      >
        <line x1="30"  y1="60"  x2="90"  y2="140" stroke="#38bdf8" strokeWidth="0.7" />
        <line x1="90"  y1="140" x2="50"  y2="220" stroke="#38bdf8" strokeWidth="0.7" />
        <line x1="90"  y1="140" x2="160" y2="110" stroke="#38bdf8" strokeWidth="0.7" />
        <line x1="50"  y1="220" x2="110" y2="290" stroke="#38bdf8" strokeWidth="0.7" />
        <circle cx="30"  cy="60"  r="4"   fill="#7dd3fc" />
        <circle cx="90"  cy="140" r="6.5" fill="#38bdf8" />
        <circle cx="50"  cy="220" r="4.5" fill="#7dd3fc" />
        <circle cx="160" cy="110" r="3.5" fill="#7dd3fc" />
        <circle cx="110" cy="290" r="4"   fill="#38bdf8" />
      </svg>

      {/* Molecular nodes — right side */}
      <svg
        className="absolute"
        style={{ right: 0, bottom: '10%', width: '28%', height: '45%', opacity: 0.20 }}
        viewBox="0 0 280 450"
        aria-hidden="true"
      >
        <line x1="240" y1="80"  x2="180" y2="160" stroke="#38bdf8" strokeWidth="0.7" />
        <line x1="180" y1="160" x2="220" y2="250" stroke="#38bdf8" strokeWidth="0.7" />
        <line x1="180" y1="160" x2="110" y2="130" stroke="#38bdf8" strokeWidth="0.7" />
        <line x1="220" y1="250" x2="160" y2="320" stroke="#38bdf8" strokeWidth="0.7" />
        <line x1="160" y1="320" x2="210" y2="390" stroke="#38bdf8" strokeWidth="0.7" />
        <circle cx="240" cy="80"  r="3.5" fill="#7dd3fc" />
        <circle cx="180" cy="160" r="6"   fill="#38bdf8" />
        <circle cx="220" cy="250" r="4.5" fill="#7dd3fc" />
        <circle cx="110" cy="130" r="3"   fill="#7dd3fc" />
        <circle cx="160" cy="320" r="5"   fill="#38bdf8" />
        <circle cx="210" cy="390" r="3.5" fill="#7dd3fc" />
      </svg>

      {/* ECG heartbeat line with glow */}
      <svg
        className="absolute"
        style={{ left: 0, right: 0, top: '60%', width: '100%', height: '60px', opacity: 1 }}
        preserveAspectRatio="none"
        viewBox="0 0 1200 60"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ecg-grad-med" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="15%"  stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="85%"  stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <filter id="ecg-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path
          d="M0 30 L240 30 L265 30 L285 8 L302 52 L318 30 L560 30 L585 30 L605 6 L622 54 L638 30 L880 30 L905 30 L925 10 L942 50 L958 30 L1200 30"
          stroke="url(#ecg-grad-med)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecg-glow)"
        />
        {/* Glow duplicate */}
        <path
          d="M0 30 L240 30 L265 30 L285 8 L302 52 L318 30 L560 30 L585 30 L605 6 L622 54 L638 30 L880 30 L905 30 L925 10 L942 50 L958 30 L1200 30"
          stroke="url(#ecg-grad-med)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.12"
        />
      </svg>

      {/* Large medical cross — bottom right watermark */}
      <svg
        className="absolute"
        style={{ right: '-4%', bottom: '-4%', width: '260px', height: '260px', opacity: 0.038 }}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <rect x="36" y="8"  width="28" height="84" rx="5" fill="#38bdf8" />
        <rect x="8"  y="36" width="84" height="28" rx="5" fill="#38bdf8" />
      </svg>

      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 5%, rgba(56,189,248,0.7) 50%, transparent 95%)',
          boxShadow: '0 0 18px rgba(56,189,248,0.35)',
        }}
      />

      {/* Bottom gradient fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '35%',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(2,12,24,0.7) 100%)',
        }}
      />

      {/* Edge vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 88% 88% at 50% 50%, transparent 48%, rgba(2,12,24,0.65) 100%)',
        }}
      />
    </div>
  );
}
