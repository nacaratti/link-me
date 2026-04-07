import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Crown, Check, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ConstellationBackground from './ConstellationBackground';

const C = {
  black:    '#000000',
  white:    '#e7e9ea',
  blue:     '#1c9cf0',
  gray1:    '#17181c',
  gray2:    '#242628',
  muted:    '#72767a',
  amber:    '#f59e0b',
  amberDim: 'rgba(245,158,11,0.12)',
  amberGlow:'rgba(245,158,11,0.25)',
};

const PRO_FEATURES = [
  'Temas exclusivos animados (Beyhive, Aurora Boreal e mais)',
  'Links ilimitados',
  'Whatsapp flutuante no perfil',
  'Tag de status personalizada',
  'Botão flutuante personalizado',
  'Novos temas todo mês',
];

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 11)
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_,a,b,c,e) =>
      [a, b, c].filter(Boolean).join('.') + (e ? '-' + e : ''));
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_,a,b,c,d2,e) =>
    `${a}.${b}.${c}/${d2}` + (e ? '-' + e : ''));
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, (_,a,b,c) =>
      `(${a}) ${b}` + (c ? '-' + c : ''));
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, (_,a,b,c) =>
    `(${a}) ${b}` + (c ? '-' + c : ''));
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${C.gray2}`,
  borderRadius: 10,
  outline: 'none',
  fontSize: 15,
  color: C.white,
  fontFamily: "'Open Sans', sans-serif",
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: C.muted,
  marginBottom: 6,
  fontFamily: "'Open Sans', sans-serif",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [taxId, setTaxId]   = useState('');
  const [phone, setPhone]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cpf = taxId.replace(/\D/g, '');
    if (cpf.length < 11) { setError('Informe um CPF ou CNPJ válido.'); return; }

    const cel = phone.replace(/\D/g, '');
    if (cel.length < 10) { setError('Informe um número de celular válido.'); return; }

    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('payment-create', {
        body: { taxId: cpf, cellphone: cel },
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

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 24 }}>

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
          <p style={{ fontSize: 13, color: C.muted }}>Assine o plano PRO</p>
        </div>

        {/* Two column layout on desktop */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="checkout-cols">
          <style>{`
            @media (min-width: 640px) {
              .checkout-cols { flex-direction: row !important; align-items: flex-start; }
              .checkout-cols > * { flex: 1; }
            }
          `}</style>

          {/* Left — Plan summary */}
          <div style={{
            background: 'rgba(23,24,28,0.82)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${C.amberGlow}`,
            borderRadius: 20,
            padding: '28px 24px',
          }}>
            {/* Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: C.amberDim,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Crown size={22} color={C.amber} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.white }}>linqu.es PRO</div>
                <div style={{ fontSize: 13, color: C.muted }}>Plano mensal</div>
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.gray2}` }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: C.amber }}>R$ 9</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: C.amber }}>,90</span>
              <span style={{ fontSize: 14, color: C.muted }}> / mês</span>
            </div>

            {/* Features */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PRO_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.white }}>
                  <Check size={16} color={C.amber} style={{ flexShrink: 0, marginTop: 2 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Form */}
          <div style={{
            background: 'rgba(23,24,28,0.82)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${C.gray2}`,
            borderRadius: 20,
            padding: '28px 24px',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>
              Dados para cobrança
            </h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
              Necessários para emissão da nota fiscal. Você será redirecionado para o checkout seguro da AbacatePay.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>CPF ou CNPJ</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={taxId}
                  onChange={e => setTaxId(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = C.amber)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.gray2)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Celular com DDD</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = C.amber)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.gray2)}
                  required
                />
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
                type="submit"
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
                  transition: 'opacity 0.2s, transform 0.15s',
                  marginTop: 4,
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
              >
                {loading
                  ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                  : <Crown size={18} />
                }
                {loading ? 'Aguarde...' : 'Ir para o checkout'}
              </button>
            </form>

            <p style={{ fontSize: 11, color: C.muted, marginTop: 16, textAlign: 'center', lineHeight: 1.6 }}>
              Pagamento processado com segurança pela AbacatePay.<br />
              Aceitamos PIX e cartão de crédito.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
