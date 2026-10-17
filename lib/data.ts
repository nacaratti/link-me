import { unstable_cache } from "next/cache";
import { anon } from "@/lib/supabase/anon";
import { effectiveStyle, rowToProfile, type ProfileRow } from "@/lib/profile";
import type { Block, PageProfile } from "@/lib/types";

/**
 * Colunas que o banco libera para leitura pública (ver migração 100: o anon
 * não tem SELECT nas colunas do Stripe, então nunca usar select("*")).
 */
export const PUBLIC_PROFILE_COLUMNS =
  "id, username, display_name, headline, bio, avatar_url, photos, template_id, palette_id, font_id, whatsapp_number, whatsapp_enabled, plan";

export const BLOCK_COLUMNS = "id, type, data, sort_order, is_active, clicks";

export const pageTag = (username: string) => `page:${username}`;

async function fetchPublicPage(username: string): Promise<{ profile: PageProfile; blocks: Block[] } | null> {
  const { data: row } = await anon
    .from("profiles")
    .select(PUBLIC_PROFILE_COLUMNS)
    .eq("username", username)
    .maybeSingle<ProfileRow>();
  if (!row) return null;

  const { data: blocks } = await anon
    .from("blocks")
    .select(BLOCK_COLUMNS)
    .eq("profile_id", row.id)
    .eq("is_active", true)
    .order("sort_order");

  return { profile: effectiveStyle(rowToProfile(row)), blocks: (blocks ?? []) as Block[] };
}

/** Página pública em cache; o painel invalida com revalidateTag(pageTag(username)) */
export function getPublicPage(username: string) {
  return unstable_cache(() => fetchPublicPage(username), ["public-page", username], {
    tags: [pageTag(username)],
    revalidate: 3600,
  })();
}
