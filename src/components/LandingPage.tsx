import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { motion, useInView, AnimatePresence } from 'motion/react';

// ─── Palette (always dark — matches dark theme tokens) ───────────────────────
const C = {
  black:   '#000000',
  white:   '#e7e9ea',
  blue:    '#1c9cf0',
  blueDim: 'rgba(28,156,240,0.12)',
  blueGlow:'rgba(28,156,240,0.25)',
  gray1:   '#17181c',
  gray2:   '#242628',
  gray3:   '#061216',
  muted:   '#72767a',
  mutedLt: '#72767a',
};

// ─── Inline styles ────────────────────────────────────────────────────────────
const S = {
  page: {
    background: C.black,
    color: C.white,
    fontFamily: "'Open Sans', sans-serif",
    minHeight: '100vh',
    overflowX: 'hidden' as const,
    position: 'relative' as const,
  },
  canvas: {
    position: 'fixed' as const,
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 0,
    pointerEvents: 'none' as const,
    opacity: 0.55,
  },
  content: {
    position: 'relative' as const,
    zIndex: 1,
  },
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
function LinqIcon({ size = 36 }: { size?: number }) {
  return <img src="/logo_white.png" alt="linqu.es" style={{ height: size, width: 'auto', display: 'block' }} />;
}

function LinqWordmark({ size = 22 }: { size?: number }) {
  return <img src="/nome_white.png" alt="linqu.es" style={{ height: size, width: 'auto', display: 'block' }} />;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      className="lp-nav"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(0,0,0,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.gray2}` : '1px solid transparent',
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <LinqIcon size={32} />
        <LinqWordmark size={20} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onCTA}
          style={{
            background: 'transparent',
            border: 'none',
            color: C.mutedLt,
            fontSize: 14,
            cursor: 'pointer',
            padding: '8px 16px',
            fontFamily: "'Open Sans', sans-serif",
            transition: 'color 0.2s',
          }}
          className="lp-nav-login"
          onMouseEnter={e => (e.currentTarget.style.color = C.white)}
          onMouseLeave={e => (e.currentTarget.style.color = C.mutedLt)}
        >
          Entrar
        </button>
        <button
          onClick={onCTA}
          style={{
            background: C.blue,
            border: 'none',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: 100,
            fontFamily: "'Open Sans', sans-serif",
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            boxShadow: `0 0 0 0 ${C.blueGlow}`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 0 20px ${C.blueGlow}`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 0 0 0 ${C.blueGlow}`;
          }}
        >
          Criar grátis
        </button>
      </div>
    </motion.nav>
  );
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup() {
  const links = ['Portfolio', 'GitHub', 'LinkedIn', 'Dribbble', 'Newsletter'];
  return (
    <div style={{
      width: 220,
      height: 440,
      background: '#0D0D0D',
      borderRadius: 36,
      border: `2px solid ${C.gray3}`,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px ${C.gray2}, inset 0 1px 0 rgba(255,255,255,0.05)`,
      flexShrink: 0,
    }}>
      {/* Dynamic Island notch */}
      <div style={{
        position: 'absolute',
        top: 12, left: '50%',
        transform: 'translateX(-50%)',
        width: 80, height: 22,
        background: '#000',
        borderRadius: 100,
        zIndex: 10,
      }} />

      {/* Animated background glow */}
      <div style={{
        position: 'absolute',
        top: -60, left: -60,
        width: 280, height: 280,
        background: 'radial-gradient(ellipse, rgba(28,156,240,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        padding: '52px 16px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        height: '100%',
        overflowY: 'hidden',
      }}>
        {/* Avatar */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.blue} 0%, #00E5FF 100%)`,
          marginBottom: 4,
          boxShadow: `0 0 20px ${C.blueGlow}`,
        }} />

        <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>Ana Oliveira</div>
        <div style={{ fontSize: 10, color: C.muted, textAlign: 'center', lineHeight: 1.4 }}>
          Design • Branding • UX
        </div>

        {/* Status tag */}
        <div style={{
          background: 'rgba(28,156,240,0.12)',
          border: `1px solid rgba(28,156,240,0.3)`,
          borderRadius: 100,
          padding: '3px 10px',
          fontSize: 9,
          color: C.blue,
          marginTop: 2,
        }}>
          ● Open to Work
        </div>

        {/* Links */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          {links.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.5, duration: 0.4 }}
              style={{
                width: '100%',
                padding: '9px 12px',
                background: i === 0
                  ? `linear-gradient(90deg, rgba(28,156,240,0.15), rgba(28,156,240,0.05))`
                  : 'rgba(255,255,255,0.05)',
                border: i === 0 ? `1px solid rgba(28,156,240,0.25)` : `1px solid rgba(255,255,255,0.07)`,
                borderRadius: 12,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 500,
                color: i === 0 ? C.blue : C.white,
              }}
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="lp-hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '120px 40px 80px',
      maxWidth: 1200,
      margin: '0 auto',
      gap: 60,
    }}>
      {/* Left */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: C.blueDim,
            border: `1px solid rgba(28,156,240,0.25)`,
            borderRadius: 100,
            padding: '6px 14px',
            fontSize: 12,
            color: C.blue,
            marginBottom: 24,
            fontWeight: 500,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue, display: 'inline-block' }} />
          Plataforma de links para criadores
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(42px, 6vw, 80px)',
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            margin: '0 0 24px',
          }}
        >
          Um link.<br />
          <span style={{
            background: `linear-gradient(90deg, ${C.blue} 0%, #0ea5e9 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Tudo o que você é.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: C.mutedLt,
            lineHeight: 1.6,
            margin: '0 0 40px',
            maxWidth: 440,
            fontWeight: 300,
          }}
        >
          Crie sua página personalizada em minutos. Compartilhe links, redes sociais e contato —
          tudo em um único endereço.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lp-hero-ctas"
          style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
        >
          <button
            onClick={onCTA}
            style={{
              background: C.blue,
              border: 'none',
              color: C.black,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '16px 32px',
              borderRadius: 100,
              fontFamily: "'Open Sans', sans-serif",
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: `0 0 0 0 ${C.blueGlow}`,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 30px ${C.blueGlow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = `0 0 0 0 ${C.blueGlow}`;
            }}
          >
            Criar minha página grátis →
          </button>

          <span style={{ fontSize: 13, color: C.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5L7 1Z" fill={C.blue} opacity="0.7" />
            </svg>
            100% gratuito • sem cartão
          </span>
        </motion.div>

        {/* URL preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="lp-hero-url"
          style={{
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            color: C.muted,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: C.gray2,
            border: `1px solid ${C.gray3}`,
            borderRadius: 100,
            padding: '8px 16px',
          }}>
            <span style={{ color: C.muted }}>linqu.es/</span>
            <TypingText words={['anadesigner', 'joaodev', 'mariafoto', 'pedromusic', 'luizarq']} />
          </div>
          <span>← seu endereço único</span>
        </motion.div>
      </div>

      {/* Right — Phone */}
      <motion.div
        className="lp-hero-phone"
        initial={{ opacity: 0, x: 40, rotateY: -20 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          perspective: 1200,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'perspective(1000px) rotateX(4deg) rotateY(-8deg)' }}
        >
          <PhoneMockup />
        </motion.div>
        <div style={{
          width: 120,
          height: 20,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }} />
      </motion.div>
    </section>
  );
}

// ─── Typing Text ──────────────────────────────────────────────────────────────
function TypingText({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    if (!deleting) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIdx((idx + 1) % words.length);
      }
    }
  }, [displayed, deleting, idx, words]);

  return (
    <span style={{ color: C.blue, fontWeight: 600, minWidth: 100 }}>
      {displayed}
      <span style={{ animation: 'blink 1s step-end infinite', color: C.blue }}>|</span>
    </span>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const stats = [
    { value: '5.000+', label: 'criadores ativos' },
    { value: '23',     label: 'temas únicos' },
    { value: '100%',   label: 'gratuito' },
    { value: '1',      label: 'link para tudo' },
  ];

  return (
    <div ref={ref} style={{
      borderTop: `1px solid ${C.gray2}`,
      borderBottom: `1px solid ${C.gray2}`,
      background: C.gray1,
    }}>
      <div className="lp-statsbar-grid" style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="lp-stat-item"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            style={{
              padding: '32px 24px',
              borderRight: i < stats.length - 1 ? `1px solid ${C.gray2}` : 'none',
              textAlign: 'center',
            }}
          >
            <div style={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(24px, 3vw, 36px)',
              color: C.blue,
              letterSpacing: '-0.03em',
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ tag, title, sub }: { tag: string; title: React.ReactNode; sub?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="lp-section-header"
      style={{ textAlign: 'center', marginBottom: 56 }}
    >
      <div style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: C.blue,
        marginBottom: 16,
      }}>
        {tag}
      </div>
      <h2 style={{
        fontFamily: "'Open Sans', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(28px, 4vw, 52px)',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
        margin: '0 0 16px',
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 16, color: C.mutedLt, maxWidth: 480, margin: '0 auto', lineHeight: 1.6, fontWeight: 300 }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: '◈',
      title: 'Temas que impressionam',
      desc: '23+ temas únicos — de WebGL a CSS animado. Mercúrio Líquido, Aurora, Constelação e muito mais.',
      accent: '#1c9cf0',
    },
    {
      icon: '⊹',
      title: 'Personalização total',
      desc: 'Cores, fontes (21 opções), estilos de botão, bordas, background de vídeo ou imagem. 100% do seu jeito.',
      accent: '#00E5FF',
    },
    {
      icon: '◎',
      title: 'Links inteligentes',
      desc: 'Arraste para reordenar, ative/desative sem apagar, monitore cliques. Redes sociais com ícones automáticos.',
      accent: '#FF6B6B',
    },
    {
      icon: '⬡',
      title: 'Status dinâmicos',
      desc: '"Open to Work", "Disponível", "Building in Public" — badge animado que aparece no seu perfil.',
      accent: '#FFD93D',
    },
    {
      icon: '⊞',
      title: 'WhatsApp integrado',
      desc: 'Botão flutuante do WhatsApp com mensagem personalizada. Seus visitantes chegam direto no seu chat.',
      accent: '#25D366',
    },
    {
      icon: '◉',
      title: 'Temas profissionais',
      desc: 'Layouts para advogados, médicos, dentistas, psicólogos e devs — identidade visual pronta para usar.',
      accent: '#1c9cf0',
    },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="lp-section-pad" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <SectionHeader
        tag="Recursos"
        title={<>Tudo o que você precisa.<br /><span style={{ color: C.blue }}>Nada do que não precisa.</span></>}
        sub="Simples de usar, poderoso o suficiente para impressionar qualquer um que visitar seu link."
      />
      <div ref={ref} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 2,
      }}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: C.gray1,
              border: `1px solid ${C.gray2}`,
              padding: '32px',
              cursor: 'default',
              transition: 'background 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = C.gray2;
              el.style.borderColor = C.gray3;
              el.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = C.gray1;
              el.style.borderColor = C.gray2;
              el.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              fontSize: 24,
              marginBottom: 16,
              color: f.accent,
              lineHeight: 1,
            }}>
              {f.icon}
            </div>
            <h3 style={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 17,
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}>
              {f.title}
            </h3>
            <p style={{
              fontSize: 14,
              color: C.mutedLt,
              lineHeight: 1.6,
              margin: 0,
              fontWeight: 300,
            }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Theme Showcase ───────────────────────────────────────────────────────────
function ThemeShowcase() {
  const themes = [
    { name: 'Mercúrio Líquido', tag: 'WebGL', bg: 'radial-gradient(ellipse at 35% 65%,#2a1f2a 0%,#0a0a0a 100%)', accent: 'rgba(255,255,255,0.4)', textColor: '#f0f0f0' },
    { name: 'Aurora Boreal',    tag: 'CSS',   bg: 'linear-gradient(135deg,#0d1b2a 0%,#1a472a 50%,#0d2b3a 100%)', accent: 'rgba(100,255,180,0.4)', textColor: '#e0ffe8' },
    { name: 'Constelação',      tag: 'Canvas',bg: 'radial-gradient(ellipse at 20% 30%, #0a0a1a 0%, #050508 100%)', accent: 'rgba(150,180,255,0.4)', textColor: '#c8d8ff' },
    { name: 'Laser',            tag: 'Canvas',bg: 'linear-gradient(160deg,#0a0005 0%,#1a0010 100%)', accent: 'rgba(255,50,100,0.4)', textColor: '#ffd0d8' },
    { name: 'Quantum Sphere',   tag: 'WebGL', bg: 'radial-gradient(ellipse at 60% 40%, #001533 0%, #000816 100%)', accent: 'rgba(0,200,255,0.4)', textColor: '#b0e8ff' },
    { name: 'Bolhas',           tag: 'Canvas',bg: 'linear-gradient(135deg,#e8f4f8 0%,#d0e8f0 100%)', accent: 'rgba(0,120,180,0.35)', textColor: '#1a3a4a' },
    { name: 'Dourado',          tag: 'Canvas',bg: 'linear-gradient(135deg,#1a0f00 0%,#2a1800 100%)', accent: 'rgba(255,200,50,0.5)', textColor: '#ffe8b0' },
    { name: 'Elegância',        tag: 'Pro',   bg: 'linear-gradient(160deg,#f5f0eb 0%,#e8e0d8 100%)', accent: 'rgba(80,40,20,0.35)', textColor: '#2a1a0a' },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="lp-section-pad" style={{
      background: C.gray1,
      borderTop: `1px solid ${C.gray2}`,
      borderBottom: `1px solid ${C.gray2}`,
      padding: '100px 40px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader
          tag="Temas"
          title={<>Visual que representa<br /><span style={{ color: C.blue }}>quem você é.</span></>}
          sub="Cada tema é uma identidade. Do minimalista ao cinematográfico — encontre o seu estilo."
        />
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          {themes.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{
                background: t.bg,
                borderRadius: 16,
                padding: '28px 20px',
                height: 180,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                border: `1px solid rgba(255,255,255,0.06)`,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Mini profile preview */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: t.accent,
                  border: `2px solid rgba(255,255,255,0.2)`,
                }} />
                <div style={{ width: 60, height: 4, borderRadius: 4, background: t.accent }} />
                <div style={{ width: 40, height: 3, borderRadius: 4, background: t.accent, opacity: 0.5 }} />
                <div style={{ width: 100, height: 22, borderRadius: 6, background: t.accent, marginTop: 4 }} />
                <div style={{ width: 100, height: 22, borderRadius: 6, background: t.accent, opacity: 0.6 }} />
              </div>

              {/* Tags */}
              <div style={{
                position: 'absolute',
                bottom: 12, left: 12, right: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: t.textColor,
                  fontFamily: "'Open Sans', sans-serif",
                }}>
                  {t.name}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  background: t.tag === 'Pro' ? 'rgba(28,156,240,0.2)' : 'rgba(255,255,255,0.1)',
                  color: t.tag === 'Pro' ? C.blue : t.textColor,
                  padding: '3px 7px',
                  borderRadius: 100,
                  border: t.tag === 'Pro' ? `1px solid rgba(28,156,240,0.3)` : `1px solid rgba(255,255,255,0.15)`,
                }}>
                  {t.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: 32 }}
        >
          <span style={{ fontSize: 13, color: C.muted }}>
            + muito mais temas em breve
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Crie sua conta',
      desc: 'Cadastro em menos de 30 segundos. Escolha seu @usuário e pronto.',
      detail: 'Sem cartão de crédito. Sem pegadinha.',
    },
    {
      num: '02',
      title: 'Personalize tudo',
      desc: 'Escolha um tema, adicione seus links, ajuste cores e fontes.',
      detail: 'Visualização em tempo real enquanto você edita.',
    },
    {
      num: '03',
      title: 'Compartilhe seu link',
      desc: 'Seu endereço: linqu.es/seu-nome. Cole na bio, cartão, email.',
      detail: 'Um link que centraliza tudo o que você é.',
    },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="lp-section-pad" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <SectionHeader
        tag="Como funciona"
        title={<>Três passos.<br /><span style={{ color: C.blue }}>Uma página incrível.</span></>}
      />
      <div ref={ref} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 40,
        position: 'relative',
      }}>
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative' }}
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="lp-step-connector" style={{
                position: 'absolute',
                top: 28,
                right: -20,
                width: 40,
                height: 1,
                background: `linear-gradient(90deg, ${C.gray3}, transparent)`,
              }} />
            )}

            <div style={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 800,
              fontSize: 48,
              color: C.gray3,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              marginBottom: 20,
            }}>
              {s.num}
            </div>
            <h3 style={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}>
              {s.title}
            </h3>
            <p style={{
              fontSize: 15,
              color: C.mutedLt,
              lineHeight: 1.6,
              margin: '0 0 12px',
              fontWeight: 300,
            }}>
              {s.desc}
            </p>
            <p style={{
              fontSize: 12,
              color: C.blue,
              opacity: 0.7,
              margin: 0,
            }}>
              {s.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Marquee (theme names) ─────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = [
    'Mercúrio Líquido', '·', 'Aurora Boreal', '·', 'Constelação', '·',
    'Quantum Sphere', '·', 'Laser', '·', 'Bolhas', '·', 'Fractal Pulse', '·',
    'Vazio', '·', 'Lago de Ondas', '·', 'Vagalumes', '·', 'Fluxo Dourado', '·',
  ];

  return (
    <div style={{
      overflow: 'hidden',
      borderTop: `1px solid ${C.gray2}`,
      borderBottom: `1px solid ${C.gray2}`,
      padding: '14px 0',
      background: C.gray1,
    }}>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <div style={{
        display: 'flex',
        animation: 'marquee 30s linear infinite',
        width: 'max-content',
        gap: 32,
      }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontSize: 12,
            fontWeight: item === '·' ? 400 : 600,
            color: item === '·' ? C.gray3 : C.muted,
            letterSpacing: item === '·' ? 0 : '0.05em',
            textTransform: item === '·' ? 'none' : 'uppercase' as const,
            whiteSpace: 'nowrap',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection({ onCTA }: { onCTA: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="lp-cta-section" style={{
      padding: '120px 40px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow BG */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(28,156,240,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: C.blueDim,
            border: `1px solid rgba(28,156,240,0.25)`,
            borderRadius: 100,
            padding: '6px 16px',
            fontSize: 12,
            color: C.blue,
            marginBottom: 32,
            fontWeight: 600,
          }}>
            Comece agora
          </div>

          <h2 style={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 64px)',
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            margin: '0 0 24px',
          }}>
            Sua identidade digital<br />
            <span style={{
              background: `linear-gradient(90deg, ${C.blue} 0%, #0ea5e9 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              começa aqui.
            </span>
          </h2>

          <p style={{
            fontSize: 17,
            color: C.mutedLt,
            lineHeight: 1.6,
            margin: '0 auto 48px',
            maxWidth: 420,
            fontWeight: 300,
          }}>
            Junte-se a milhares de criadores que já têm sua página linqu.es.
            Leva menos de 2 minutos.
          </p>

          <button
            onClick={onCTA}
            style={{
              background: C.blue,
              border: 'none',
              color: C.black,
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '18px 40px',
              borderRadius: 100,
              fontFamily: "'Open Sans', sans-serif",
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: `0 0 40px ${C.blueGlow}`,
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 16px 60px rgba(28,156,240,0.4)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = `0 0 40px ${C.blueGlow}`;
            }}
          >
            Criar minha página grátis →
          </button>

          <p style={{ fontSize: 13, color: C.muted, marginTop: 20 }}>
            Grátis para sempre. Sem cartão de crédito.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="lp-footer" style={{
      borderTop: `1px solid ${C.gray2}`,
      padding: '32px 40px',
      background: C.gray1,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LinqIcon size={24} />
          <LinqWordmark size={16} />
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Termos', href: '/termos' },
            { label: 'Privacidade', href: '/privacidade' },
            { label: 'Entrar', href: '/entrar' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: 13,
                color: C.muted,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >
              {label}
            </a>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.muted }}>
          © 2025 linqu.es
        </div>
      </div>
    </footer>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const navigate  = useNavigate();

  // Fonts
  useEffect(() => {
    const id = 'landing-fonts-v1';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&display=swap';
      document.head.appendChild(link);
    }
    // Global cursor blink + mobile responsive styles
    if (!document.getElementById('landing-styles-v1')) {
      const style = document.createElement('style');
      style.id = 'landing-styles-v1';
      style.textContent = `
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 767px) {
          .lp-nav { padding: 12px 20px !important; }
          .lp-nav-login { display: none !important; }
          .lp-hero { flex-direction: column !important; padding: 88px 20px 56px !important; gap: 32px !important; min-height: auto !important; }
          .lp-hero-phone { display: none !important; }
          .lp-hero-ctas { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .lp-hero-url { flex-wrap: wrap !important; }
          .lp-statsbar-grid { grid-template-columns: repeat(2, 1fr) !important; padding: 0 20px !important; }
          .lp-stat-item { border-right: none !important; border-bottom: 1px solid #242628; padding: 24px 16px !important; }
          .lp-stat-item:nth-child(odd) { border-right: 1px solid #242628 !important; }
          .lp-stat-item:nth-last-child(-n+2) { border-bottom: none !important; }
          .lp-section-pad { padding: 56px 20px !important; }
          .lp-cta-section { padding: 72px 20px !important; }
          .lp-footer { padding: 24px 20px !important; }
          .lp-section-header { margin-bottom: 36px !important; }
          .lp-step-connector { display: none !important; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Three.js Particle Constellation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile    = window.innerWidth < 768;
    const PARTICLES   = isMobile ? 80 : 170;
    const CONN_DIST   = 4.2;
    const MAX_LINES   = isMobile ? 300 : 700;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Particle geometry ──────────────────────────────────────────────────────
    const pPos = new Float32Array(PARTICLES * 3);
    const pVel = new Float32Array(PARTICLES * 3);
    const pCol = new Float32Array(PARTICLES * 3);

    for (let i = 0; i < PARTICLES; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 42;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const spd = 0.008;
      pVel[i * 3]     = (Math.random() - 0.5) * spd;
      pVel[i * 3 + 1] = (Math.random() - 0.5) * spd;
      pVel[i * 3 + 2] = (Math.random() - 0.5) * spd * 0.4;

      const isLime = Math.random() < 0.18;
      if (isLime) {
        pCol[i * 3]     = 0.78;
        pCol[i * 3 + 1] = 1.0;
        pCol[i * 3 + 2] = 0.0;
      } else {
        const b = 0.3 + Math.random() * 0.6;
        pCol[i * 3]     = b;
        pCol[i * 3 + 1] = b;
        pCol[i * 3 + 2] = b;
      }
    }

    const pGeo   = new THREE.BufferGeometry();
    const pAttr  = new THREE.BufferAttribute(pPos, 3);
    pAttr.setUsage(THREE.DynamicDrawUsage);
    pGeo.setAttribute('position', pAttr);
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat   = new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ── Line geometry ──────────────────────────────────────────────────────────
    const lPos  = new Float32Array(MAX_LINES * 6);
    const lGeo  = new THREE.BufferGeometry();
    const lAttr = new THREE.BufferAttribute(lPos, 3);
    lAttr.setUsage(THREE.DynamicDrawUsage);
    lGeo.setAttribute('position', lAttr);
    lGeo.setDrawRange(0, 0);

    const lMat   = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 });
    const lines  = new THREE.LineSegments(lGeo, lMat);
    scene.add(lines);

    // ── Events ─────────────────────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / W - 0.5) * 2,
        y: -(e.clientY / H - 0.5) * 2,
      };
    };
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize, { passive: true });

    // ── Animation ──────────────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Drift particles
      for (let i = 0; i < PARTICLES; i++) {
        pPos[i * 3]     += pVel[i * 3];
        pPos[i * 3 + 1] += pVel[i * 3 + 1];
        pPos[i * 3 + 2] += pVel[i * 3 + 2];

        if (Math.abs(pPos[i * 3])     > 22) pVel[i * 3]     *= -1;
        if (Math.abs(pPos[i * 3 + 1]) > 17) pVel[i * 3 + 1] *= -1;
        if (Math.abs(pPos[i * 3 + 2]) > 10) pVel[i * 3 + 2] *= -1;
      }
      pAttr.needsUpdate = true;

      // Rebuild connection lines
      let li = 0;
      for (let i = 0; i < PARTICLES && li < MAX_LINES; i++) {
        for (let j = i + 1; j < PARTICLES && li < MAX_LINES; j++) {
          const dx = pPos[i * 3]     - pPos[j * 3];
          const dy = pPos[i * 3 + 1] - pPos[j * 3 + 1];
          const dz = pPos[i * 3 + 2] - pPos[j * 3 + 2];
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < CONN_DIST * CONN_DIST) {
            lPos[li * 6]     = pPos[i * 3];
            lPos[li * 6 + 1] = pPos[i * 3 + 1];
            lPos[li * 6 + 2] = pPos[i * 3 + 2];
            lPos[li * 6 + 3] = pPos[j * 3];
            lPos[li * 6 + 4] = pPos[j * 3 + 1];
            lPos[li * 6 + 5] = pPos[j * 3 + 2];
            li++;
          }
        }
      }
      lGeo.setDrawRange(0, li * 2);
      lAttr.needsUpdate = true;

      // Mouse parallax on camera
      camera.position.x += (mouseRef.current.x * 2.5 - camera.position.x) * 0.018;
      camera.position.y += (mouseRef.current.y * 1.8 - camera.position.y) * 0.018;
      camera.lookAt(scene.position);

      // Slow global rotation
      points.rotation.y = t * 0.025;
      lines.rotation.y  = t * 0.025;

      renderer.render(scene, camera);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      pGeo.dispose();
      lGeo.dispose();
      pMat.dispose();
      lMat.dispose();
    };
  }, []);

  return (
    <div style={S.page}>
      {/* Three.js background */}
      <canvas ref={canvasRef} style={S.canvas} />

      {/* Radial vignette over canvas */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(7,7,7,0.6) 100%)',
      }} />

      {/* Scrollable content */}
      <div style={S.content}>
        <Nav onCTA={() => navigate('/entrar')} />
        <HeroSection onCTA={() => navigate('/entrar')} />
        <MarqueeStrip />
        <StatsBar />
        <FeaturesSection />
        <ThemeShowcase />
        <HowItWorks />
        <CTASection onCTA={() => navigate('/entrar')} />
        <Footer />
      </div>
    </div>
  );
}
