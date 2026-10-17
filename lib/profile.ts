import { getPalette, DEFAULT_PALETTE_ID } from "./palettes";
import { getTemplate, DEFAULT_TEMPLATE_ID } from "./templates";
import type { PageProfile } from "./types";

export type ProfileRow = Omit<PageProfile, "photos"> & { photos: string[] | null };

export function rowToProfile(row: ProfileRow): PageProfile {
  return {
    ...row,
    display_name: row.display_name || row.username,
    headline: row.headline ?? "",
    bio: row.bio ?? "",
    avatar_url: row.avatar_url ?? "",
    photos: row.photos ?? [],
    whatsapp_number: row.whatsapp_number ?? "",
  };
}

/**
 * Quem voltou para o plano grátis continua com a página no ar: modelo e
 * paleta PRO caem para os equivalentes livres só na renderização.
 */
export function effectiveStyle(profile: PageProfile): PageProfile {
  if (profile.plan === "pro") return profile;
  return {
    ...profile,
    template_id: getTemplate(profile.template_id).free ? profile.template_id : DEFAULT_TEMPLATE_ID,
    palette_id: getPalette(profile.palette_id).free ? profile.palette_id : DEFAULT_PALETTE_ID,
  };
}
