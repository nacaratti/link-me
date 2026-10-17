/**
 * Modelos de página. Cada modelo é um layout fixo com sua própria dupla de
 * fontes; o usuário escolhe só o modelo e a paleta. O componente de cada um
 * fica em components/templates/.
 */

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  /** Livre no plano gratuito */
  free: boolean;
  /** Paleta que melhor mostra o modelo nas miniaturas */
  showcasePalette: string;
}

export type TemplateId = "editorial" | "cartao" | "vitrine" | "minimo";

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "editorial",
    name: "Editorial",
    description: "Foto grande em sangria, nome em serifa e links em linhas finas. Cara de encarte de disco.",
    free: true,
    showcasePalette: "latao",
  },
  {
    id: "cartao",
    name: "Cartão",
    description: "Foto redonda no centro e botões cheios. O clássico link na bio, direto ao ponto.",
    free: true,
    showcasePalette: "terracota",
  },
  {
    id: "vitrine",
    name: "Vitrine",
    description: "Capa larga e destaques em grade com imagem. Para quem tem trabalho para mostrar.",
    free: false,
    showcasePalette: "papel",
  },
  {
    id: "minimo",
    name: "Mínimo",
    description: "Só tipografia. Sem foto grande, links em texto. Silencioso e rápido.",
    free: true,
    showcasePalette: "grafite",
  },
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "cartao";

export function getTemplate(id: string | null | undefined): TemplateInfo {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE_ID)!;
}
