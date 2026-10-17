import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToProfile } from "@/lib/profile";
import type { PageProfile } from "@/lib/types";

/** Colunas que o próprio usuário lê do perfil (ver grants da migração 100) */
const OWN_PROFILE_COLUMNS =
  "id, username, display_name, headline, bio, avatar_url, photos, template_id, palette_id, whatsapp_number, whatsapp_enabled, plan, pro_expires_at, onboarding_answers, onboarded_at";

export interface OwnProfile extends PageProfile {
  pro_expires_at: string | null;
  onboarding_answers: unknown;
  onboarded_at: string | null;
}

/** Usuário logado + perfil; manda para /entrar se não houver sessão */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const { data: row } = await supabase
    .from("profiles")
    .select(OWN_PROFILE_COLUMNS)
    .eq("id", user.id)
    .single();

  const profile = row
    ? ({ ...rowToProfile({ ...row, username: row.username ?? "" }), username: row.username ?? "" } as OwnProfile)
    : null;

  return { supabase, user, profile };
}
