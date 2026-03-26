import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    // Suporte ao fluxo "implicit" (tokens no #hash), caso algum ambiente ainda esteja assim
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    if (!code) {
      if (accessToken) {
        supabase.auth
          .setSession({
            access_token: accessToken,
            refresh_token: refreshToken ?? '',
          })
          .then(({ error }) => {
            if (error) {
              console.error('OAuth callback error (setSession):', error.message);
              navigate(`/entrar?oauth_error=${encodeURIComponent(error.message)}`, { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          });
        return;
      }

      if (error || errorDescription) {
        const msg = errorDescription || error || 'Erro desconhecido no OAuth';
        console.error('OAuth callback error (no code):', msg);
        navigate(`/entrar?oauth_error=${encodeURIComponent(msg)}`, { replace: true });
        return;
      }

      console.error('OAuth callback: missing code param');
      navigate('/entrar?oauth_error=Missing%20code%20param', { replace: true });
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('OAuth callback error:', error.message);
        navigate(`/entrar?oauth_error=${encodeURIComponent(error.message)}`, { replace: true });
      } else {
        // onAuthStateChange no AuthContext irá detectar o SIGNED_IN
        // e resolver hasUsername antes do ProtectedRoute renderizar
        navigate('/', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <Loader2 className="w-8 h-8 animate-spin text-[#0B76A0]" />
    </div>
  );
}
