import type { Block, FeaturedData, LinkData, PageProfile } from "@/lib/types";
import type { Palette } from "@/lib/palettes";

export interface TemplateProps {
  profile: PageProfile;
  links: (LinkData & { id: string })[];
  featured: (FeaturedData & { id: string })[];
  palette: Palette;
  /** Renderizado dentro do celular de prévia (painel / questionário) */
  preview?: boolean;
}

export function splitBlocks(blocks: Block[]) {
  const active = blocks.filter((b) => b.is_active).sort((a, b) => a.sort_order - b.sort_order);
  return {
    links: active.flatMap((b) => (b.type === "link" ? [{ ...b.data, id: b.id }] : [])),
    featured: active.flatMap((b) => (b.type === "featured" ? [{ ...b.data, id: b.id }] : [])),
  };
}

/** Atributos comuns de todo link de bloco (o Tracker conta cliques por data-block) */
export function blockLinkProps(id: string, url: string) {
  const external = /^https?:/i.test(url);
  return {
    href: url,
    "data-block": id,
    ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
  };
}
