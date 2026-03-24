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
    supabase.auth.getSession()
      .then(({ data, error }) => {
        // Refresh token inválido (sessão antiga no localStorage) — limpa e desloga
        if (error) {
          supabase.auth.signOut();
          return;
        }
        const u = data.session?.user ?? null;
        setUser(u);
        if (u) return checkUsername(u.id);
      })
      .finally(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // TOKEN_REFRESHED com sessão nula = token inválido — limpa localStorage
      if (!session && event === 'TOKEN_REFRESHED') {
        supabase.auth.signOut();
        setUser(null);
        setHasUsername(false);
        setLoading(false);
        return;
      }

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
