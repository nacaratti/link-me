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

    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) {
      navigate('/entrar', { replace: true });
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('OAuth callback error:', error.message);
        navigate('/entrar', { replace: true });
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
