/**
 * Páginas de exemplo para a landing e para /preview. As fotos vêm do
 * picsum.photos (imagens livres), só para mostrar os modelos.
 */

import type { Block, PageProfile } from "./types";

const pic = (seed: string, w = 900, h = 1100) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

function base(p: Partial<PageProfile>): PageProfile {
  return {
    id: "sample",
    username: "exemplo",
    display_name: "",
    headline: "",
    bio: "",
    avatar_url: "",
    photos: [],
    template_id: "cartao",
    palette_id: "papel",
    font_id: null,
    whatsapp_number: "",
    whatsapp_enabled: false,
    plan: "free",
    ...p,
  };
}

let n = 0;
const link = (title: string, url: string, note?: string): Block => ({
  id: `s${++n}`, type: "link", sort_order: n, is_active: true, data: { title, url, note },
});
const feat = (badge: string, title: string, subtitle: string, image: string, url: string, cta: string): Block => ({
  id: `s${++n}`, type: "featured", sort_order: n, is_active: true, data: { badge, title, subtitle, image, url, cta },
});

export const SAMPLES: { profile: PageProfile; blocks: Block[] }[] = [
  {
    profile: base({
      username: "marina.sax",
      display_name: "Marina Alves",
      headline: "Saxofonista · Compositora",
      bio: "Choro, samba e jazz brasileiro. Shows, aulas e gravações.",
      photos: [pic("sax-1"), pic("sax-2")],
      template_id: "editorial",
      palette_id: "latao",
      whatsapp_number: "21999990000",
      whatsapp_enabled: true,
    }),
    blocks: [
      feat("Novo álbum", "Rua das Flores", "Marina Alves · 2026", pic("album", 800, 800), "https://open.spotify.com", "Ouvir no Spotify"),
      link("Instagram", "https://instagram.com/marina.sax"),
      link("YouTube", "https://youtube.com/@marinasax"),
      link("Agenda de shows", "https://marinaalves.com.br/agenda", "marinaalves.com.br"),
      link("Contato para shows", "mailto:producao@marinaalves.com.br"),
    ],
  },
  {
    profile: base({
      username: "dra.luiza",
      display_name: "Dra. Luiza Prado",
      headline: "Nutricionista · CRN 12345",
      bio: "Nutrição sem terrorismo. Atendimento presencial em Niterói e online.",
      avatar_url: pic("nutri", 400, 400),
      template_id: "cartao",
      palette_id: "terracota",
      whatsapp_number: "21988887777",
      whatsapp_enabled: true,
    }),
    blocks: [
      feat("Agenda aberta", "Consulta online", "Primeira consulta + plano alimentar", pic("food", 1200, 700), "https://calendly.com", "Agendar agora"),
      link("Instagram", "https://instagram.com/dra.luiza"),
      link("Receitas no blog", "https://luizaprado.com.br/receitas"),
      link("Agendar horário", "https://calendly.com/luiza"),
    ],
  },
  {
    profile: base({
      username: "casa.forno",
      display_name: "Casa Forno",
      headline: "Padaria artesanal · Botafogo",
      bio: "Fermentação natural desde 2019. Encomendas até as 18h.",
      photos: [pic("bakery", 1600, 900)],
      avatar_url: pic("bread-logo", 300, 300),
      template_id: "vitrine",
      palette_id: "papel",
      plan: "pro",
    }),
    blocks: [
      feat("Mais pedido", "Pão de campanha", "R$ 28", pic("bread", 700, 700), "https://ifood.com.br", "Pedir"),
      feat("Novidade", "Focaccia de alecrim", "R$ 34", pic("focaccia", 700, 700), "https://ifood.com.br", "Pedir"),
      link("Pedir no iFood", "https://ifood.com.br/casaforno"),
      link("Instagram", "https://instagram.com/casa.forno"),
      link("Como chegar", "https://maps.google.com", "Rua Voluntários da Pátria, 100"),
    ],
  },
  {
    profile: base({
      username: "rafa.dev",
      display_name: "Rafael Souza",
      headline: "Engenheiro de software",
      bio: "Construo produtos web. Escrevo sobre TypeScript e sistemas distribuídos.",
      template_id: "minimo",
      palette_id: "grafite",
    }),
    blocks: [
      feat("Artigo", "Filas sem dor de cabeça", "8 min de leitura", "", "https://rafa.dev/filas", "Ler"),
      link("GitHub", "https://github.com/rafasouza"),
      link("LinkedIn", "https://linkedin.com/in/rafasouza"),
      link("Blog", "https://rafa.dev"),
      link("E-mail", "mailto:oi@rafa.dev"),
    ],
  },
];
