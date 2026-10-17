"use server";

import { revalidatePath, updateTag } from "next/cache";
import { BLOCK_COLUMNS, pageTag } from "@/lib/data";
import { normalizeUrl, defaultTitle } from "@/lib/links";
import { canUsePalette, canUseTemplate, planErrorMessage } from "@/lib/plans";
import { requireUser } from "@/lib/session";
import type { Block, FeaturedData, LinkData } from "@/lib/types";

export type Result<T = null> = { ok: true; data: T } | { ok: false; error: string };

const fail = (message: string | undefined, fallback = "Não foi possível salvar. Tente de novo."): Result<never> => ({
  ok: false,
  error: (message && planErrorMessage(message)) || fallback,
});

/** Depois de qualquer mudança, a página pública mostra a versão nova na hora */
function refresh(username: string) {
  if (!username) return;
  updateTag(pageTag(username));
  revalidatePath(`/${username}`);
}

function cleanLink(d: LinkData): LinkData {
  const url = normalizeUrl(d.url);
  return { url, title: d.title.trim() || defaultTitle(url), ...(d.note?.trim() ? { note: d.note.trim() } : {}) };
}

function cleanFeatured(d: FeaturedData): FeaturedData {
  return {
    badge: d.badge.trim(),
    title: d.title.trim(),
    url: normalizeUrl(d.url),
    cta: d.cta.trim() || "Saiba mais",
    ...(d.subtitle?.trim() ? { subtitle: d.subtitle.trim() } : {}),
    ...(d.image ? { image: d.image } : {}),
  };
}

export async function saveStyle(template_id: string, palette_id: string): Promise<Result> {
  const { supabase, user, profile } = await requireUser();
  if (!profile) return fail(undefined);
  if (!canUseTemplate(template_id, profile.plan)) return { ok: false, error: "Esse modelo é do plano PRO." };
  if (!canUsePalette(palette_id, profile.plan)) return { ok: false, error: "Essa paleta é do plano PRO." };

  const { error } = await supabase.from("profiles").update({ template_id, palette_id }).eq("id", user.id);
  if (error) return fail(error.message);
  refresh(profile.username);
  return { ok: true, data: null };
}

export interface ProfileInput {
  display_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  photos: string[];
  whatsapp_number: string;
  whatsapp_enabled: boolean;
}

export async function saveProfile(input: ProfileInput): Promise<Result> {
  const { supabase, user, profile } = await requireUser();
  if (!profile) return fail(undefined);
  if (!input.display_name.trim()) return { ok: false, error: "O nome não pode ficar vazio." };

  const whatsapp = input.whatsapp_number.replace(/\D/g, "");
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: input.display_name.trim().slice(0, 60),
      headline: input.headline.trim().slice(0, 60),
      bio: input.bio.trim().slice(0, 160),
      avatar_url: input.avatar_url,
      photos: input.photos.slice(0, 4),
      whatsapp_number: whatsapp,
      whatsapp_enabled: input.whatsapp_enabled && whatsapp.length >= 10,
    })
    .eq("id", user.id);
  if (error) return fail(error.message);
  refresh(profile.username);
  return { ok: true, data: null };
}

export async function addBlock(
  input: { type: "link"; data: LinkData } | { type: "featured"; data: FeaturedData },
): Promise<Result<Block>> {
  const { supabase, user, profile } = await requireUser();
  if (!profile) return fail(undefined);

  const data = input.type === "link" ? cleanLink(input.data) : cleanFeatured(input.data);
  if (!data.url) return { ok: false, error: "Faltou o link." };

  const { data: last } = await supabase
    .from("blocks")
    .select("sort_order")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Destaques entram no topo; links, no fim
  const sort_order = input.type === "featured" ? -1 : (last?.sort_order ?? 0) + 1;
  const { data: row, error } = await supabase
    .from("blocks")
    .insert({ profile_id: user.id, type: input.type, data, sort_order })
    .select(BLOCK_COLUMNS)
    .single();
  if (error) return fail(error.message);
  refresh(profile.username);
  return { ok: true, data: row as Block };
}

export async function updateBlock(
  id: string,
  patch: { data?: LinkData | FeaturedData; is_active?: boolean },
  type?: Block["type"],
): Promise<Result> {
  const { supabase, user, profile } = await requireUser();
  if (!profile) return fail(undefined);

  const update: Record<string, unknown> = {};
  if (patch.is_active !== undefined) update.is_active = patch.is_active;
  if (patch.data) update.data = type === "featured" ? cleanFeatured(patch.data as FeaturedData) : cleanLink(patch.data as LinkData);

  const { error } = await supabase.from("blocks").update(update).eq("id", id).eq("profile_id", user.id);
  if (error) return fail(error.message);
  refresh(profile.username);
  return { ok: true, data: null };
}

export async function deleteBlock(id: string): Promise<Result> {
  const { supabase, user, profile } = await requireUser();
  if (!profile) return fail(undefined);
  const { error } = await supabase.from("blocks").delete().eq("id", id).eq("profile_id", user.id);
  if (error) return fail(error.message, "Não foi possível apagar.");
  refresh(profile.username);
  return { ok: true, data: null };
}

export async function reorderBlocks(ids: string[]): Promise<Result> {
  const { supabase, profile } = await requireUser();
  if (!profile) return fail(undefined);
  const { error } = await supabase.rpc("reorder_blocks", { p_ids: ids });
  if (error) return fail(error.message, "Não foi possível reordenar.");
  refresh(profile.username);
  return { ok: true, data: null };
}
