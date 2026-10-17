"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { buildPage, type Answers } from "@/lib/builder";
import { pageTag } from "@/lib/data";
import { planErrorMessage } from "@/lib/plans";
import { normalizeUsername, usernameError } from "@/lib/reserved";
import { requireUser } from "@/lib/session";

/** Confere formato e disponibilidade do endereço */
export async function checkUsername(raw: string): Promise<{ username: string; error: string | null }> {
  const username = normalizeUsername(raw);
  const error = usernameError(username);
  if (error) return { username, error };

  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("profiles").select("id").eq("username", username).maybeSingle();
  if (data && data.id !== user.id) return { username, error: "Esse endereço já tem dono. Tente outro." };
  return { username, error: null };
}

/**
 * Publica a página montada pelo questionário: grava o perfil e troca todos
 * os blocos pelos novos. Refazer o questionário substitui a página inteira.
 */
export async function publish(answers: Answers, rawUsername: string): Promise<{ error: string } | void> {
  const { supabase, user, profile } = await requireUser();
  if (!profile) return { error: "Perfil não encontrado. Saia e entre de novo." };

  let username = profile.username;
  if (!username) {
    const check = await checkUsername(rawUsername);
    if (check.error) return { error: check.error };
    username = check.username;
  }

  const built = buildPage(answers, profile.plan);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      ...built.profile,
      username,
      onboarding_answers: answers,
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (profileError) {
    if (profileError.code === "23505") return { error: "Esse endereço acabou de ser escolhido por outra pessoa." };
    return { error: planErrorMessage(profileError.message) ?? "Não foi possível salvar. Tente de novo." };
  }

  const { error: deleteError } = await supabase.from("blocks").delete().eq("profile_id", user.id);
  if (deleteError) return { error: "Não foi possível salvar os links. Tente de novo." };

  if (built.blocks.length) {
    const { error: blocksError } = await supabase
      .from("blocks")
      .insert(built.blocks.map((b) => ({ ...b, profile_id: user.id })));
    if (blocksError) return { error: planErrorMessage(blocksError.message) ?? "Não foi possível salvar os links." };
  }

  updateTag(pageTag(username));
  revalidatePath(`/${username}`);
  redirect("/painel?publicado=1");
}
