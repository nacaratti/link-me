"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  info?: string;
}

function safeNext(raw: FormDataEntryValue | null) {
  const v = typeof raw === "string" ? raw : "";
  // Só caminhos internos, para não virar redirecionamento aberto
  return v.startsWith("/") && !v.startsWith("//") ? v : "/painel";
}

function translate(message: string) {
  if (/invalid login credentials/i.test(message)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(message)) return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  if (/already registered/i.test(message)) return "Esse e-mail já tem conta. Tente entrar.";
  if (/password/i.test(message)) return "A senha precisa ter pelo menos 6 caracteres.";
  return "Não deu certo agora. Tente de novo em instantes.";
}

/** Uma ação só para o formulário; o modo vem num campo escondido */
export async function authenticate(state: AuthState, form: FormData): Promise<AuthState> {
  return form.get("mode") === "entrar" ? signIn(state, form) : signUp(state, form);
}

async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (error) return { error: translate(error.message) };
  redirect(safeNext(form.get("next")));
}

async function signUp(_: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
  const { data, error } = await supabase.auth.signUp({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
    options: { emailRedirectTo: `${origin}/auth/callback?next=/criar` },
  });
  if (error) return { error: translate(error.message) };
  // Com confirmação de e-mail ligada no Supabase, ainda não há sessão
  if (!data.session) return { info: "Enviamos um link de confirmação para o seu e-mail." };
  redirect("/criar");
}
