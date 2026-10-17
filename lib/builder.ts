/**
 * Questionário → página. Função pura e determinística: recebe as respostas
 * e devolve modelo, paleta, textos e blocos. Sem IA, sem surpresa.
 */

import { defaultTitle, detectBrand, normalizeUrl } from "./links";
import { canUsePalette, canUseTemplate, linkLimit } from "./plans";
import { FEATURED_KINDS, getProfession, type FeaturedKind, type GoalId, type ProfessionId } from "./presets";
import { DEFAULT_PALETTE_ID } from "./palettes";
import { DEFAULT_TEMPLATE_ID } from "./templates";
import type { Block, FeaturedData, LinkData, PageProfile, Plan } from "./types";
import type { BrandName } from "@/components/BrandIcon";

export interface Answers {
  profession: ProfessionId;
  goal: GoalId;
  template_id?: string;
  palette_id?: string;
  display_name: string;
  headline: string;
  bio: string;
  avatar_url?: string;
  photos?: string[];
  featured?: {
    kind: FeaturedKind;
    title: string;
    url: string;
    subtitle?: string;
    image?: string;
  } | null;
  links: { url: string; title?: string }[];
  whatsapp?: string | null;
}

export type NewBlock = Omit<Block, "id">;

export interface BuiltPage {
  profile: Pick<
    PageProfile,
    "display_name" | "headline" | "bio" | "avatar_url" | "photos" | "template_id" | "palette_id" | "whatsapp_number" | "whatsapp_enabled"
  >;
  blocks: NewBlock[];
}

/** Marcas que sobem para o topo da lista conforme o objetivo */
const GOAL_PRIORITY: Record<GoalId, BrandName[]> = {
  divulgar: ["spotify", "youtube", "applemusic", "deezer", "soundcloud", "behance", "dribbble", "website"],
  contato: ["calendly", "whatsapp", "email", "phone", "website"],
  vender: ["ifood", "website", "whatsapp", "instagram"],
  redes: [],
};

/** Texto do botão do destaque quando o link é de uma plataforma conhecida */
const BRAND_CTA: Partial<Record<BrandName, string>> = {
  spotify: "Ouvir no Spotify",
  applemusic: "Ouvir no Apple Music",
  deezer: "Ouvir no Deezer",
  soundcloud: "Ouvir no SoundCloud",
  youtube: "Assistir no YouTube",
  ifood: "Pedir no iFood",
  calendly: "Agendar horário",
  whatsapp: "Chamar no WhatsApp",
};

export function pickTemplate(answers: Pick<Answers, "profession" | "template_id">, plan: Plan): string {
  if (answers.template_id && canUseTemplate(answers.template_id, plan)) return answers.template_id;
  return getProfession(answers.profession).templates.find((t) => canUseTemplate(t, plan)) ?? DEFAULT_TEMPLATE_ID;
}

export function pickPalette(answers: Pick<Answers, "profession" | "palette_id">, plan: Plan): string {
  if (answers.palette_id && canUsePalette(answers.palette_id, plan)) return answers.palette_id;
  return getProfession(answers.profession).palettes.find((p) => canUsePalette(p, plan)) ?? DEFAULT_PALETTE_ID;
}

/** Ordena mantendo a ordem digitada entre links de mesma prioridade */
function sortByGoal<T extends { url: string }>(links: T[], goal: GoalId): T[] {
  const priority = GOAL_PRIORITY[goal];
  const rank = (url: string) => {
    const i = priority.indexOf(detectBrand(url));
    return i === -1 ? priority.length : i;
  };
  return links
    .map((l, i) => ({ l, i }))
    .sort((a, b) => rank(a.l.url) - rank(b.l.url) || a.i - b.i)
    .map(({ l }) => l);
}

export function buildPage(answers: Answers, plan: Plan): BuiltPage {
  const kind = answers.featured ? FEATURED_KINDS.find((k) => k.id === answers.featured!.kind) : undefined;

  // Links: normaliza, tira vazios e repetidos, ordena pelo objetivo, respeita o limite do plano
  const seen = new Set<string>();
  const links: LinkData[] = sortByGoal(
    answers.links
      .map((l) => ({ url: normalizeUrl(l.url), title: l.title?.trim() }))
      .filter((l) => l.url && !seen.has(l.url) && seen.add(l.url)),
    answers.goal,
  )
    .slice(0, linkLimit(plan))
    .map((l) => ({ url: l.url, title: l.title || defaultTitle(l.url) }));

  const blocks: NewBlock[] = [];

  if (answers.featured && kind && answers.featured.title.trim() && answers.featured.url.trim()) {
    const url = normalizeUrl(answers.featured.url);
    const data: FeaturedData = {
      badge: kind.badge,
      title: answers.featured.title.trim(),
      url,
      cta: BRAND_CTA[detectBrand(url)] ?? kind.cta,
      ...(answers.featured.subtitle?.trim() ? { subtitle: answers.featured.subtitle.trim() } : {}),
      ...(answers.featured.image ? { image: answers.featured.image } : {}),
    };
    blocks.push({ type: "featured", data, sort_order: 0, is_active: true });
  }

  links.forEach((data) => blocks.push({ type: "link", data, sort_order: blocks.length, is_active: true }));

  const whatsapp = (answers.whatsapp ?? "").replace(/\D/g, "");

  return {
    profile: {
      display_name: answers.display_name.trim(),
      headline: answers.headline.trim(),
      bio: answers.bio.trim(),
      avatar_url: answers.avatar_url ?? "",
      photos: (answers.photos ?? []).slice(0, 4),
      template_id: pickTemplate(answers, plan),
      palette_id: pickPalette(answers, plan),
      whatsapp_number: whatsapp,
      // Liga o botão flutuante quando há um número com DDD
      whatsapp_enabled: whatsapp.length >= 10,
    },
    blocks,
  };
}
