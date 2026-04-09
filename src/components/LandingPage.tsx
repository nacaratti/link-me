import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { motion, useInView, AnimatePresence } from 'motion/react';
import ConstellationBackground from './ConstellationBackground';

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
const NAV_LINKS = [
  { label: 'Recursos',       href: '#recursos' },
  { label: 'Como funciona',  href: '#como-funciona' },
  { label: 'Planos',         href: '#planos' },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Nav({ onCTA }: { onCTA: () => void }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <motion.nav
        className="lp-nav"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 20,
          left: 0,
          right: 0,
          margin: '0 auto',
          width: 'calc(100% - 24px)',
          maxWidth: 1000,
          zIndex: 100,
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(24, 25, 28, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 16,
          boxShadow: '0 2px 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LinqIcon size={32} />
          <LinqWordmark size={20} />
        </div>

        {/* Links centrais */}
        <div className="lp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              style={{
                background: 'transparent',
                border: 'none',
                color: C.mutedLt,
                fontSize: 14,
                cursor: 'pointer',
                padding: '8px 14px',
                fontFamily: "'Open Sans', sans-serif",
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = C.mutedLt)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Ações desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onCTA}
            style={{
              background: 'transparent',
              border: 'none',
              color: C.mutedLt,
              fontSize: 14,
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 8,
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
            className="lp-nav-cta-desktop"
            style={{
              background: C.blue,
              border: 'none',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '10px 22px',
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

          {/* Hambúrguer — só mobile */}
          <button
            className="lp-nav-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              color: C.white,
              flexDirection: 'column',
              gap: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Menu"
          >
            <span style={{ display: 'block', width: 22, height: 2, background: C.white, borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: C.white, borderRadius: 2, transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 2, background: C.white, borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </motion.nav>

      {/* Menu dropdown mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lp-nav-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'none',
              position: 'fixed',
              top: 80,
              left: 0,
              right: 0,
              margin: '0 auto',
              width: 'calc(100% - 24px)',
              maxWidth: 600,
              zIndex: 99,
              background: 'rgba(24, 25, 28, 0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              padding: '12px 0',
              flexDirection: 'column',
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => { scrollTo(href); setMenuOpen(false); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: C.white,
                  fontSize: 16,
                  cursor: 'pointer',
                  padding: '14px 24px',
                  fontFamily: "'Open Sans', sans-serif",
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {label}
              </button>
            ))}
            <div style={{ height: 1, background: C.gray2, margin: '8px 24px' }} />
            <button
              onClick={() => { onCTA(); setMenuOpen(false); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: C.mutedLt,
                fontSize: 16,
                cursor: 'pointer',
                padding: '14px 24px',
                fontFamily: "'Open Sans', sans-serif",
                textAlign: 'left',
                width: '100%',
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => { onCTA(); setMenuOpen(false); }}
              style={{
                background: C.blue,
                border: 'none',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '12px 24px',
                margin: '8px 16px 4px',
                borderRadius: 100,
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              Criar grátis
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup() {
  const links = ['Portfolio', 'GitHub', 'LinkedIn'];

  // Aurora Boreal theme — cores reais do sistema
  const bg         = '#030d1a';
  const textColor  = '#d0fff0';
  const mutedColor = '#6bbda0';
  const btnColor   = 'rgba(0,200,120,0.18)';
  const btnText    = '#a0ffd0';
  const btnRadius  = '20px 4px'; // leaf

  return (
    <div style={{
      width: 220,
      height: 440,
      background: bg,
      borderRadius: 36,
      border: '2px solid rgba(255,255,255,0.07)',
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

      {/* Aurora glow */}
      <div style={{
        position: 'absolute',
        top: -40, left: -40,
        width: 260, height: 260,
        background: 'radial-gradient(ellipse, rgba(0,200,120,0.10) 0%, transparent 70%)',
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
          width: 56, height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00c878 0%, #0099ff 100%)',
          marginBottom: 4,
          boxShadow: '0 0 18px rgba(0,200,120,0.35)',
        }} />

        <div style={{ fontSize: 13, fontWeight: 700, color: textColor, fontFamily: 'Raleway, sans-serif' }}>Ana Oliveira</div>
        <div style={{ fontSize: 10, color: mutedColor, textAlign: 'center', lineHeight: 1.4, fontFamily: 'Raleway, sans-serif' }}>
          Design • Branding • UX
        </div>

        {/* Status tag */}
        <div style={{
          background: 'rgba(22,163,74,0.12)',
          border: '1px solid rgba(22,163,74,0.3)',
          borderRadius: 100,
          padding: '3px 10px',
          fontSize: 9,
          color: '#ffffff',
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#16a34a',
            display: 'inline-block',
            animation: 'pulse-green 1.8s ease-in-out infinite',
          }} />
          Open to Work
        </div>

        {/* Links */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          {links.map((name, i) => (
            <div
              key={name}
              style={{
                width: '100%',
                padding: '9px 12px',
                background: btnColor,
                border: `1px solid rgba(0,200,120,${0.25 - i * 0.04})`,
                opacity: 1 - i * 0.12,
                borderRadius: btnRadius,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 600,
                color: btnText,
                fontFamily: 'Raleway, sans-serif',
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Botão flutuante WhatsApp */}
      <div style={{
        position: 'absolute',
        bottom: 18,
        right: 14,
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: '#25D366',
        boxShadow: '0 4px 14px rgba(37,211,102,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulse-green 2s ease-in-out infinite',
        zIndex: 20,
      }}>
        {/* Ícone WhatsApp simplificado */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.526 5.845L.057 23.428a.75.75 0 00.915.915l5.638-1.47A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.502-5.187-1.381l-.372-.217-3.853 1.004 1.026-3.748-.235-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
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
              <path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5L7 1Z" fill="#FFD700" />
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
            color: C.white,
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
            <span style={{ color: C.white }}>linqu.es/</span>
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
    <section id="recursos" className="lp-section-pad" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
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
// 8 temas reais — thumbnail como fundo, accent/btnRadius dos dados reais do sistema
const SHOWCASE_THEMES = [
  { name: 'Treliça de Cristal', tag: 'PRO',   img: '/temas/cristal.png',     accent: 'rgba(0,242,255,0.45)',   btnRadius: '6px',       textColor: '#00f2ff' },
  { name: 'Aurora Boreal',    tag: 'Animado', img: '/temas/aurora.png',      accent: 'rgba(0,200,120,0.50)',   btnRadius: '20px 4px',  textColor: '#d0fff0' },
  { name: 'Constelação',      tag: 'Canvas',  img: '/temas/constelacao.png', accent: 'rgba(150,180,255,0.50)', btnRadius: '9999px',    textColor: '#c8d8ff' },
  { name: 'Fluxo Dourado',    tag: 'Canvas',  img: '/temas/fluxo.png',       accent: 'rgba(255,180,50,0.55)',  btnRadius: '20px 4px',  textColor: '#ffd080' },
  { name: 'Esfera Quântica',  tag: 'Animado', img: '/temas/esfera.png',      accent: 'rgba(255,255,255,0.18)', btnRadius: '9999px',    textColor: '#ffffff' },
  { name: 'Void',             tag: 'Animado', img: '/temas/void.png',        accent: 'rgba(165,180,252,0.35)', btnRadius: '6px',       textColor: '#e0e7ff' },
  { name: 'Laser',            tag: 'Animado', img: '/temas/laser.png',       accent: 'rgba(0,255,255,0.35)',   btnRadius: '0px 16px',  textColor: '#ffffff' },
  { name: 'Vagalumes',        tag: 'Canvas',  img: '/temas/vagalumes.png',   accent: 'rgba(100,255,100,0.40)', btnRadius: '6px',       textColor: '#c8ffcc' },
];

function ThemeShowcase() {
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
          {SHOWCASE_THEMES.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{
                backgroundImage: `url(${t.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
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
              {/* Overlay para legibilidade */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', pointerEvents: 'none' }} />

              {/* Mini profile preview */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: t.accent,
                  border: `2px solid rgba(255,255,255,0.2)`,
                }} />
                <div style={{ width: 60, height: 4, borderRadius: 4, background: t.accent }} />
                <div style={{ width: 40, height: 3, borderRadius: 4, background: t.accent, opacity: 0.5 }} />
                <div style={{ width: 100, height: 22, borderRadius: t.btnRadius, background: t.accent, marginTop: 4 }} />
                <div style={{ width: 100, height: 22, borderRadius: t.btnRadius, background: t.accent, opacity: 0.6 }} />
              </div>

              {/* Tags */}
              <div style={{
                position: 'absolute',
                bottom: 12, left: 12, right: 12,
                zIndex: 1,
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
                  background: 'rgba(255,255,255,0.1)',
                  color: t.textColor,
                  padding: '3px 7px',
                  borderRadius: 100,
                  border: `1px solid rgba(255,255,255,0.15)`,
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
    <section id="como-funciona" className="lp-section-pad" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
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
// ─── Pricing Section ─────────────────────────────────────────────────────────
function PricingSection({ onCTA }: { onCTA: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const freeFeatures = [
    'Página pública personalizada',
    'Links limitados (5 links)',
    'Temas gratuitos (10+)',
    'Cores e fontes customizáveis',
    'Status tag',
  ];

  const proFeatures = [
    'Tudo do plano grátis',
    'Links ilimitados',
    'Botão de WhatsApp flutuante',
    'Temas animados exclusivos',
    'Temas de vídeos exclusivos',
    'Novos temas em primeira mão',
    'Estatísticas de cliques',
    'Suporte prioritário',
  ];

  return (
    <section id="planos" className="lp-section-pad" style={{ padding: '100px 40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader
          tag="Planos"
          title={<>Simples assim.<br /><span style={{ color: C.blue }}>Sem surpresas.</span></>}
          sub="Comece grátis. Faça upgrade quando quiser ir além."
        />

        <div ref={ref} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}>

          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: C.gray1,
              border: `1px solid ${C.gray2}`,
              borderRadius: 24,
              padding: '36px 32px',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: C.muted, textTransform: 'uppercase', marginBottom: 16 }}>Grátis</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>R$ 0</span>
              <span style={{ fontSize: 14, color: C.muted, paddingBottom: 6 }}>/mês</span>
            </div>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>Para sempre. Sem cartão.</p>

            <button
              onClick={onCTA}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 100,
                border: `1px solid ${C.gray2}`,
                background: 'transparent',
                color: C.white,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Open Sans', sans-serif",
                marginBottom: 28,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.gray2}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Criar conta grátis
            </button>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {freeFeatures.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.mutedLt }}>
                  <span style={{ color: '#4ade80', fontSize: 15 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* PRO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'linear-gradient(160deg, #0d1a0a 0%, #0a0700 100%)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 24,
              padding: '36px 32px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(245,158,11,0.07)',
            }}
          >
            {/* Glow */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 200, height: 200,
              background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#f59e0b', textTransform: 'uppercase' }}>PRO</div>
              <div style={{ fontSize: 10, fontWeight: 800, background: '#f59e0b', color: '#000', padding: '3px 8px', borderRadius: 100 }}>
                MAIS POPULAR
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: C.white }}>R$ 9</span>
              <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: C.white, paddingBottom: 2 }}>,90</span>
              <span style={{ fontSize: 14, color: C.muted, paddingBottom: 6 }}>/mês</span>
            </div>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>Cancele quando quiser.</p>

            <button
              onClick={onCTA}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 100,
                border: 'none',
                background: '#f59e0b',
                color: '#000',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Open Sans', sans-serif",
                marginBottom: 28,
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 24px rgba(245,158,11,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(245,158,11,0.3)';
              }}
            >
              ✦ Assinar PRO — R$ 9,90/mês
            </button>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {proFeatures.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.mutedLt }}>
                  <span style={{ color: '#f59e0b', fontSize: 15 }}>✦</span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

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
        @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0.7)} 50%{box-shadow:0 0 0 4px rgba(22,163,74,0)} }
        @media (max-width: 767px) {
          .lp-nav { padding: 10px 16px !important; border-radius: 12px !important; }
          .lp-nav-login { display: none !important; }
          .lp-nav-links { display: none !important; }
          .lp-nav-cta-desktop { display: none !important; }
          .lp-nav-hamburger { display: flex !important; }
          .lp-nav-mobile-menu { display: flex !important; }
          .lp-hero { flex-direction: column !important; padding: 140px 20px 56px !important; gap: 32px !important; min-height: auto !important; }
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

  // Three.js Particle Constellation — REMOVE_START
  useEffect(() => {
    const canvas_UNUSED = null;
    if (!canvas_UNUSED) return;

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
      <ConstellationBackground />

      {/* Scrollable content */}
      <div style={S.content}>
        <Nav onCTA={() => navigate('/entrar')} />
        <HeroSection onCTA={() => navigate('/entrar')} />
        <MarqueeStrip />
        <StatsBar />
        <FeaturesSection />
        <ThemeShowcase />
        <HowItWorks />
        <PricingSection onCTA={() => navigate('/entrar')} />
        <CTASection onCTA={() => navigate('/entrar')} />
        <Footer />
      </div>
    </div>
  );
}
