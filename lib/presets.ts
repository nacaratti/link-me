/**
 * O que o questionário sabe sobre cada profissão: qual modelo e quais paletas
 * sugerir, exemplos de texto e que tipo de destaque costuma fazer sentido.
 */

import type { TemplateId } from "./templates";

export type ProfessionId =
  | "musica"
  | "saude"
  | "direito"
  | "criador"
  | "negocio"
  | "tech"
  | "visual"
  | "outro";

export type GoalId = "divulgar" | "contato" | "vender" | "redes";

export type FeaturedKind = "lancamento" | "servico" | "produto" | "agenda";

export interface ProfessionPreset {
  id: ProfessionId;
  label: string;
  emoji: string;
  /** Em ordem de preferência; o questionário usa o primeiro que o plano permite */
  templates: TemplateId[];
  palettes: string[];
  headlineExample: string;
  bioExample: string;
  featured: FeaturedKind;
}

export const PROFESSIONS: ProfessionPreset[] = [
  {
    id: "musica", label: "Música e arte", emoji: "🎷",
    templates: ["editorial", "vitrine", "minimo"],
    palettes: ["latao", "papel", "noite", "ameixa"],
    headlineExample: "Cantora · Compositora",
    bioExample: "Samba, choro e MPB. Shows, aulas e gravações.",
    featured: "lancamento",
  },
  {
    id: "saude", label: "Saúde e bem-estar", emoji: "🩺",
    templates: ["cartao", "editorial", "minimo"],
    palettes: ["menta", "papel", "terracota", "oceano"],
    headlineExample: "Psicóloga · CRP 06/12345",
    bioExample: "Atendimento presencial e online. Agende sua primeira conversa.",
    featured: "agenda",
  },
  {
    id: "direito", label: "Direito e consultoria", emoji: "⚖️",
    templates: ["editorial", "minimo", "cartao"],
    palettes: ["papel", "grafite", "oliva", "oceano"],
    headlineExample: "Advogado · Direito do Trabalho",
    bioExample: "Atuação em causas trabalhistas e previdenciárias. Primeira consulta sem compromisso.",
    featured: "servico",
  },
  {
    id: "criador", label: "Criador de conteúdo", emoji: "🎬",
    templates: ["cartao", "vitrine", "editorial"],
    palettes: ["noite", "rose", "terracota", "grafite"],
    headlineExample: "Criadora de conteúdo · Viagens",
    bioExample: "Roteiros baratos pelo Brasil. Vídeo novo toda semana.",
    featured: "lancamento",
  },
  {
    id: "negocio", label: "Negócio local", emoji: "🛍️",
    templates: ["vitrine", "cartao", "editorial"],
    palettes: ["terracota", "papel", "oliva", "menta"],
    headlineExample: "Padaria artesanal · Botafogo",
    bioExample: "Fermentação natural, todo dia. Encomendas pelo WhatsApp.",
    featured: "produto",
  },
  {
    id: "tech", label: "Tecnologia e design", emoji: "💻",
    templates: ["minimo", "editorial", "cartao"],
    palettes: ["grafite", "papel", "noite", "oceano"],
    headlineExample: "Designer de produto",
    bioExample: "Desenho produtos digitais simples. Disponível para projetos.",
    featured: "servico",
  },
  {
    id: "visual", label: "Fotografia e gastronomia", emoji: "📷",
    templates: ["vitrine", "editorial", "cartao"],
    palettes: ["papel", "latao", "terracota", "oliva"],
    headlineExample: "Fotógrafa de casamentos",
    bioExample: "Casamentos e ensaios no Rio e em São Paulo. Agenda 2027 aberta.",
    featured: "servico",
  },
  {
    id: "outro", label: "Outra coisa", emoji: "✨",
    templates: ["cartao", "editorial", "minimo"],
    palettes: ["papel", "terracota", "oceano", "grafite"],
    headlineExample: "O que você faz, em uma linha",
    bioExample: "Uma ou duas frases sobre você.",
    featured: "servico",
  },
];

export const GOALS: { id: GoalId; label: string }[] = [
  { id: "divulgar", label: "Divulgar meu trabalho" },
  { id: "contato", label: "Receber contatos e agendamentos" },
  { id: "vender", label: "Vender" },
  { id: "redes", label: "Juntar minhas redes" },
];

export const FEATURED_KINDS: { id: FeaturedKind; label: string; badge: string; cta: string; hint: string }[] = [
  { id: "lancamento", label: "Um lançamento", badge: "Lançamento", cta: "Ouvir agora", hint: "Álbum, vídeo, livro, episódio…" },
  { id: "servico", label: "Um serviço", badge: "Serviço", cta: "Saiba mais", hint: "Consulta, pacote, mentoria…" },
  { id: "produto", label: "Um produto", badge: "Destaque", cta: "Comprar", hint: "O mais vendido, a novidade…" },
  { id: "agenda", label: "Agenda / horários", badge: "Agenda aberta", cta: "Agendar", hint: "Link do Calendly, Doctoralia, site…" },
];

export function getProfession(id: string | null | undefined): ProfessionPreset {
  return PROFESSIONS.find((p) => p.id === id) ?? PROFESSIONS[PROFESSIONS.length - 1];
}
