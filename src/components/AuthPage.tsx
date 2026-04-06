import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import ConstellationBackground from './ConstellationBackground';

// ─── Same dark palette as LandingPage ─────────────────────────────────────────
const C = {
  black:    '#000000',
  white:    '#e7e9ea',
  blue:     '#1c9cf0',
  blueDim:  'rgba(28,156,240,0.12)',
  blueGlow: 'rgba(28,156,240,0.25)',
  gray1:    '#17181c',
  gray2:    '#242628',
  gray3:    '#061216',
  muted:    '#72767a',
};

export default function AuthPage() {
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthError = params.get('oauth_error');
    if (oauthError) setError(decodeURIComponent(oauthError));
  }, [location.search]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const reserved = ['admin', 'help', 'settings', 'api', 'auth', 'dashboard', 'entrar', 'login', 'register'];
        if (reserved.includes(username)) {
          setError('Esse username é reservado. Escolha outro.');
          return;
        }

        const { data: existing } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .maybeSingle();

        if (existing) {
          setError('Username já está em uso. Escolha outro.');
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username, display_name: displayName || username },
          },
        });

        if (signUpError) throw signUpError;
        setMessage('Conta criada! Verifique seu email para confirmar.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      const msg = err?.message || '';
      const code = String(err?.code ?? '');
      if (msg.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.');
      } else if (msg.includes('User already registered')) {
        setError('Email já cadastrado. Tente entrar.');
      } else if (
        mode === 'register' &&
        (code === '23505' || msg.includes('duplicate') || msg.includes('unique') || msg.includes('Database error'))
      ) {
        setError('Username já está em uso. Escolha outro.');
      } else {
        setError(msg || 'Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  // ── Shared input style ──────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${C.gray2}`,
    borderRadius: 10,
    outline: 'none',
    fontSize: 14,
    color: C.white,
    fontFamily: "'Open Sans', sans-serif",
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: C.white,
    marginBottom: 6,
    fontFamily: "'Open Sans', sans-serif",
  };

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
      {/* Background */}
      <ConstellationBackground opacity={0.45} />

      {/* Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 420,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/logo_white.png" alt="linqu.es" style={{ height: 48, width: 'auto' }} />
            <img src="/nome_white.png" alt="linqu.es" style={{ height: 20, width: 'auto', opacity: 0.85 }} />
          </Link>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Seus links em um só lugar</p>
        </div>

        {/* Form card */}
        <div style={{
          background: 'rgba(23,24,28,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${C.gray2}`,
          borderRadius: 20,
          padding: '32px 28px',
        }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 10,
            padding: 4,
            marginBottom: 28,
          }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setMessage(null); }}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Open Sans', sans-serif",
                  transition: 'background 0.2s, color 0.2s',
                  background: mode === m ? C.gray2 : 'transparent',
                  color: mode === m ? C.white : C.muted,
                }}
              >
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <>
                <div>
                  <label style={labelStyle}>Nome de exibição</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Seu nome completo"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = C.blue)}
                    onBlur={e => (e.currentTarget.style.borderColor = C.gray2)}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Username</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${C.gray2}`,
                    borderRadius: 10,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                    onFocusCapture={e => (e.currentTarget.style.borderColor = C.blue)}
                    onBlurCapture={e => (e.currentTarget.style.borderColor = C.gray2)}
                  >
                    <span style={{
                      padding: '11px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      color: C.muted,
                      fontSize: 13,
                      fontFamily: "'Open Sans', sans-serif",
                      borderRight: `1px solid ${C.gray2}`,
                      whiteSpace: 'nowrap',
                    }}>linqu.es/</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                      placeholder="seuusername"
                      style={{
                        ...inputStyle,
                        border: 'none',
                        borderRadius: 0,
                        background: 'transparent',
                        flex: 1,
                        width: 'auto',
                      }}
                      required
                      minLength={3}
                      maxLength={30}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.blue)}
                onBlur={e => (e.currentTarget.style.borderColor = C.gray2)}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.blue)}
                onBlur={e => (e.currentTarget.style.borderColor = C.gray2)}
                required
                minLength={6}
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
                fontFamily: "'Open Sans', sans-serif",
              }}>{error}</div>
            )}
            {message && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(0,184,122,0.1)',
                border: '1px solid rgba(0,184,122,0.3)',
                borderRadius: 10,
                fontSize: 13,
                color: '#34d399',
                fontFamily: "'Open Sans', sans-serif",
              }}>{message}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px 0',
                background: C.blue,
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Open Sans', sans-serif",
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
            >
              {loading && <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: C.gray2 }} />
            <span style={{ fontSize: 12, color: C.muted }}>ou</span>
            <div style={{ flex: 1, height: 1, background: C.gray2 }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 0',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${C.gray2}`,
              borderRadius: 10,
              color: C.white,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Open Sans', sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: loading ? 0.5 : 1,
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = C.muted; } }}
            onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = C.gray2; } }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continuar com Google
          </button>
        </div>

        {/* Footer links */}
        <p style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 20, lineHeight: 1.6 }}>
          Ao continuar, você concorda com os nossos{' '}
          <Link to="/termos" style={{ color: C.blue, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >Termos de Serviço</Link>
          {' '}e{' '}
          <Link to="/privacidade" style={{ color: C.blue, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >Política de Privacidade</Link>.
        </p>
      </div>

      {/* Spin keyframe for Loader2 */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
