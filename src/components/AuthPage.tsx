import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import logo from '../assets/images/logo.png';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
        setMessage('Conta criada! Verifique seu email para confirmar, ou entre agora se a confirmação estiver desativada.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        // redirecionamento via AuthContext + App.tsx
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
        // Unique constraint violation: two users registered the same username simultaneously
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
      options: {
        redirectTo: `${window.location.origin}/setup`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
    // Supabase redireciona para o Google — loading fica true até sair da página
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
          <img src={logo} alt="linqu.es" className="h-30 w-auto" />
          </div>
          <p className="text-[#BFBFBF] text-sm">Seus links em um só lugar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D9D9D9] p-8">
          <div className="flex gap-1 bg-[#ebebeb] rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'login' ? 'bg-white shadow text-[#000000]' : 'text-[#BFBFBF] hover:text-[#333333]'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); setMessage(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'register' ? 'bg-white shadow text-[#000000]' : 'text-[#BFBFBF] hover:text-[#333333]'}`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1">Nome de exibição</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-2.5 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#0B76A0] outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1">Username</label>
                  <div className="flex items-center border border-[#D9D9D9] rounded-lg focus-within:ring-2 focus-within:ring-[#0B76A0] overflow-hidden">
                    <span className="px-3 py-2.5 bg-[#f5f5f5] text-[#BFBFBF] text-sm border-r border-[#D9D9D9] whitespace-nowrap">linqu.es/</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                      placeholder="seuusername"
                      className="flex-1 px-3 py-2.5 outline-none text-sm"
                      required
                      minLength={3}
                      maxLength={30}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#0B76A0] outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:ring-[#0B76A0] outline-none text-sm"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}
            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{message}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0B76A0] text-white font-semibold rounded-lg hover:bg-[#095f7d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#D9D9D9]" />
            <span className="text-xs text-[#BFBFBF]">ou</span>
            <div className="flex-1 h-px bg-[#D9D9D9]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 border border-[#D9D9D9] rounded-lg hover:bg-[#f5f5f5] transition-colors disabled:opacity-50 flex items-center justify-center gap-3 text-sm font-medium text-[#333333]"
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

        <p className="text-center text-xs text-[#BFBFBF] mt-6">
          Ao continuar, você concorda com os nossos{' '}
          <Link to="/termos" className="text-[#0B76A0] hover:underline">Termos de Serviço</Link>
          {' '}e{' '}
          <Link to="/privacidade" className="text-[#0B76A0] hover:underline">Política de Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
