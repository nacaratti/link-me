import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasUsername: boolean;
  refreshUsername: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasUsername: false,
  refreshUsername: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);

  async function checkUsername(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .maybeSingle();
    setHasUsername(!!data?.username);
  }

  // Chamado pelo UsernameSetup após salvar o username no banco
  async function refreshUsername() {
    if (user) await checkUsername(user.id);
  }

  useEffect(() => {
    // Não usar getSession() + onAuthStateChange em paralelo para OAuth PKCE:
    // getSession() pode retornar null antes da troca do ?code= completar,
    // causando redirect para /entrar antes do SIGNED_IN disparar.
    // onAuthStateChange dispara INITIAL_SESSION *após* a troca do code,
    // então é a única fonte de verdade para o estado inicial.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Refresh token inválido — limpa sessão corrompida no localStorage
      if (event === 'TOKEN_REFRESHED' && !session) {
        supabase.auth.signOut();
        setUser(null);
        setHasUsername(false);
        setLoading(false);
        return;
      }

      // INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, USER_UPDATED
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        checkUsername(u.id).finally(() => setLoading(false));
      } else {
        setHasUsername(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, hasUsername, refreshUsername, signOut: () => supabase.auth.signOut().then(() => {}) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
