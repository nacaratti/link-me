/** Tipos compartilhados entre página pública, painel e questionário. */

export type Plan = "free" | "pro";

export interface PageProfile {
  id: string;
  username: string;
  display_name: string;
  /** Profissão em uma linha, aparece como rótulo acima do nome */
  headline: string;
  bio: string;
  avatar_url: string;
  /** Fotos de capa (1 a 4); com mais de uma, os modelos fazem rodízio */
  photos: string[];
  template_id: string;
  palette_id: string;
  /** Par de fontes (lib/fontPairs.ts); null = o padrão do modelo */
  font_id: string | null;
  whatsapp_number: string;
  whatsapp_enabled: boolean;
  plan: Plan;
}

export interface LinkData {
  title: string;
  url: string;
  /** Legenda curta abaixo do título (opcional) */
  note?: string;
}

export interface FeaturedData {
  /** Selo pequeno, ex.: "Lançamento", "Serviço" */
  badge: string;
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
  cta: string;
}

interface BlockBase {
  id: string;
  sort_order: number;
  is_active: boolean;
  clicks?: number;
}

export type Block =
  | (BlockBase & { type: "link"; data: LinkData })
  | (BlockBase & { type: "featured"; data: FeaturedData });

export type BlockType = Block["type"];
