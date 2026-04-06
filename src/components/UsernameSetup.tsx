import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AdaptiveLogo from './AdaptiveLogo';

const RESERVED = new Set(['admin', 'help', 'settings', 'api', 'auth', 'dashboard', 'entrar', 'login', 'register']);

export default function UsernameSetup() {
  const { user, refreshUsername } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (RESERVED.has(username)) {
      setError('Esse username é reservado. Escolha outro.');
      return;
    }

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existing) {
        setError('Username já está em uso. Escolha outro.');
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user!.id);

      if (updateError) {
        if (updateError.code === '23505') {
          setError('Username já está em uso. Escolha outro.');
        } else {
          throw updateError;
        }
        return;
      }

      await refreshUsername();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <AdaptiveLogo className="h-30 w-auto" />
          </div>
          <p className="text-muted-foreground text-sm">Seus links em um só lugar</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          <h2 className="text-lg font-semibold text-foreground mb-1">Escolha seu username</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sua página ficará em <span className="text-primary">linqu.es/seuusername</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border border-border rounded-lg focus-within:ring-2 focus-within:ring-ring overflow-hidden">
              <span className="px-3 py-2.5 bg-muted text-muted-foreground text-sm border-r border-border whitespace-nowrap">
                linqu.es/
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                placeholder="seuusername"
                className="flex-1 px-3 py-2.5 outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
                required
                minLength={3}
                maxLength={30}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-400">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || username.length < 3}
              className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/85 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Continuar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
