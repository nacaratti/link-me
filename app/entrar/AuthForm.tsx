"use client";

import { useActionState, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { authenticate, type AuthState } from "./actions";

export default function AuthForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"entrar" | "criar">("criar");
  const [state, action, pending] = useActionState<AuthState, FormData>(authenticate, {});
  const [googleLoading, setGoogleLoading] = useState(false);

  async function google() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex gap-6 border-b border-rule">
        {(["criar", "entrar"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
              mode === m ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {m === "criar" ? "Criar conta" : "Já tenho conta"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={google}
        disabled={googleLoading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-rule bg-bg font-medium transition-colors hover:bg-surface disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 01-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
          <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0012 23z" />
          <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 010-4.2V7.1H2.1a11 11 0 000 9.8l3.7-2.8z" />
          <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 002.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
        </svg>
        Continuar com Google
      </button>

      <div className="my-6 flex items-center gap-4 text-xs text-muted">
        <span className="h-px flex-1 bg-rule" /> ou com e-mail <span className="h-px flex-1 bg-rule" />
      </div>

      <form action={action} className="space-y-3">
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="mode" value={mode} />
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className="h-12 w-full rounded-xl border border-rule bg-bg px-4 outline-none transition-colors focus:border-ink"
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "entrar" ? "current-password" : "new-password"}
          placeholder={mode === "entrar" ? "Sua senha" : "Crie uma senha (mín. 6)"}
          className="h-12 w-full rounded-xl border border-rule bg-bg px-4 outline-none transition-colors focus:border-ink"
        />
        {state.error && <p className="text-sm text-[#b42318]">{state.error}</p>}
        {state.info && <p className="text-sm text-accent">{state.info}</p>}
        <button
          disabled={pending}
          className="h-12 w-full rounded-full bg-ink font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {pending ? "Um instante…" : mode === "entrar" ? "Entrar" : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
