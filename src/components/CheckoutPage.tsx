import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Crown, Check, ArrowLeft, Lock, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ConstellationBackground from './ConstellationBackground';

const C = {
  black:    '#000000',
  white:    '#e7e9ea',
  gray1:    '#17181c',
  gray2:    '#242628',
  muted:    '#72767a',
  amber:    '#f59e0b',
  amberDim: 'rgba(245,158,11,0.12)',
  amberGlow:'rgba(245,158,11,0.25)',
};

const FREE_FEATURES = [
  'Página pública personalizada',
  'Links limitados (5 links)',
  'Temas gratuitos (10+)',
  'Cores e fontes customizáveis',
  'Status tag',
];

const PRO_FEATURES = [
  'Tudo do plano grátis',
  'Links ilimitados',
  'Botão de WhatsApp flutuante',
  'Temas animados exclusivos',
  'Temas de vídeos exclusivos',
  'Novos temas em primeira mão',
  'Estatísticas de cliques',
  'Suporte prioritário',
];

const cardBase: React.CSSProperties = {
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('payment-create', {
        body: {},
      });

      if (fnError) throw new Error(fnError.message ?? 'Erro ao iniciar pagamento');
      if (data?.error) throw new Error(String(data.error));
      if (!data?.checkout_url) throw new Error('URL de checkout não recebida');

      window.location.href = data.checkout_url;
    } catch (err: any) {
      setError(err.message ?? 'Erro inesperado');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.black,
      color: C.white,
      fontFamily: "'Open Sans', sans-serif",
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <ConstellationBackground opacity={0.35} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 960, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14, fontFamily: "'Open Sans', sans-serif", padding: 0, alignSelf: 'flex-start' }}
        >
          <ArrowLeft size={16} /> Voltar ao dashboard
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <img src="/logo_white.png" alt="linqu.es" style={{ height: 40, width: 'auto', margin: '0 auto 8px' }} />
          <p style={{ fontSize: 13, color: C.muted }}>Escolha o seu plano</p>
        </div>

        {/* Three column layout on desktop */}
        <style>{`
          .checkout-cols { display: flex; flex-direction: column; gap: 16px; }
          @media (min-width: 720px) {
            .checkout-cols { flex-direction: row; align-items: stretch; }
            .checkout-cols > * { flex: 1; }
          }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>

        <div className="checkout-cols">

          {/* FREE card */}
          <div style={{
            ...cardBase,
            background: 'rgba(23,24,28,0.82)',
            border: `1px solid ${C.gray2}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: C.muted, textTransform: 'uppercase', marginBottom: 14 }}>Grátis</div>

            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: C.white }}>R$ 0</span>
              <span style={{ fontSize: 13, color: C.muted }}> / mês</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>Para sempre. Sem cartão.</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FREE_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: C.muted }}>
                  <Check size={14} color='#4ade80' style={{ flexShrink: 0, marginTop: 2 }} />
                  {f}
                </li>
              ))}
              {/* itens que o free NÃO tem */}
              {['Links ilimitados', 'WhatsApp flutuante', 'Temas animados e de vídeo'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#3a3d42' }}>
                  <X size={14} color='#3a3d42' style={{ flexShrink: 0, marginTop: 2 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* PRO card */}
          <div style={{
            ...cardBase,
            background: 'linear-gradient(160deg, #0d1a0a 0%, #0a0700 100%)',
            border: `1px solid ${C.amberGlow}`,
            boxShadow: '0 0 40px rgba(245,158,11,0.07)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 180, height: 180,
              background: 'radial-gradient(ellipse, rgba(245,158,11,0.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: C.amber, textTransform: 'uppercase' }}>PRO</div>
              <div style={{ fontSize: 9, fontWeight: 800, background: C.amber, color: '#000', padding: '3px 7px', borderRadius: 100 }}>MAIS POPULAR</div>
            </div>

            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: C.white }}>R$ 9</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: C.white }}>,90</span>
              <span style={{ fontSize: 13, color: C.muted }}> / mês</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>Cancele quando quiser.</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PRO_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: C.white }}>
                  <Check size={14} color={C.amber} style={{ flexShrink: 0, marginTop: 2 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Checkout action card */}
          <div style={{
            ...cardBase,
            background: 'rgba(23,24,28,0.82)',
            border: `1px solid ${C.gray2}`,
            justifyContent: 'center',
            gap: 20,
          }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>
                Pronto para assinar?
              </h2>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                Você será redirecionado para o checkout seguro do Stripe. Aceitamos cartão de crédito e PIX.
              </p>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(244,33,46,0.1)',
                border: '1px solid rgba(244,33,46,0.3)',
                borderRadius: 10,
                fontSize: 13,
                color: '#f87171',
              }}>{error}</div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 0',
                background: C.amber,
                border: 'none',
                borderRadius: 12,
                color: '#000',
                fontSize: 15,
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Open Sans', sans-serif",
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
            >
              {loading
                ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                : <Crown size={18} />
              }
              {loading ? 'Aguarde...' : 'Assinar PRO — R$ 9,90/mês'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Lock size={12} color={C.muted} />
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
                Pagamento seguro pelo Stripe
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
