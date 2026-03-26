import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      // Desabilitado para evitar dupla-troca do código PKCE:
      // o AuthCallback (/auth/callback) faz a troca explicitamente.
      detectSessionInUrl: false,
      // Importante: por padrão o supabase-js usa "implicit", que retorna tokens no #hash
      // e exige detectSessionInUrl=true. Como este app troca o code manualmente no
      // /auth/callback, precisamos forçar PKCE para receber ?code=.
      flowType: 'pkce',
    },
  }
);
