/**
 * Pares de fontes: título + texto + legenda escolhidos juntos, como as
 * paletas. Cada modelo tem um par padrão; a pessoa pode trocar por outro.
 * As fontes são carregadas em app/fonts.ts (variáveis --font-*).
 */

import type { CSSProperties } from "react";

export interface FontPair {
  id: string;
  name: string;
  /** Descrição curta para o seletor */
  description: string;
  display: string;
  body: string;
  label: string;
}

const serif = "Georgia, serif";
const sans = "system-ui, sans-serif";
const mono = "ui-monospace, monospace";

export const FONT_PAIRS: FontPair[] = [
  {
    id: "classica", name: "Clássica", description: "Bodoni e Archivo",
    display: `var(--font-bodoni), ${serif}`, body: `var(--font-archivo), ${sans}`, label: `var(--font-plex-mono), ${mono}`,
  },
  {
    id: "moderna", name: "Moderna", description: "Plus Jakarta Sans",
    display: `var(--font-jakarta), ${sans}`, body: `var(--font-jakarta), ${sans}`, label: `var(--font-jakarta), ${sans}`,
  },
  {
    id: "elegante", name: "Elegante", description: "Fraunces e Inter",
    display: `var(--font-fraunces), ${serif}`, body: `var(--font-inter), ${sans}`, label: `var(--font-inter), ${sans}`,
  },
  {
    id: "tecnica", name: "Técnica", description: "Geist e Geist Mono",
    display: `var(--font-geist), ${sans}`, body: `var(--font-geist), ${sans}`, label: `var(--font-geist-mono), ${mono}`,
  },
  {
    id: "literaria", name: "Literária", description: "Playfair e Source Sans",
    display: `var(--font-playfair), ${serif}`, body: `var(--font-source-sans), ${sans}`, label: `var(--font-source-sans), ${sans}`,
  },
  {
    id: "geometrica", name: "Geométrica", description: "Space Grotesk e Space Mono",
    display: `var(--font-space-grotesk), ${sans}`, body: `var(--font-space-grotesk), ${sans}`, label: `var(--font-space-mono), ${mono}`,
  },
];

export function getFontPair(id: string | null | undefined, fallback = "classica"): FontPair {
  return FONT_PAIRS.find((f) => f.id === id) ?? FONT_PAIRS.find((f) => f.id === fallback) ?? FONT_PAIRS[0];
}

/** Variáveis CSS que o wrapper da página recebe (lidas pelo @theme em globals.css) */
export function fontVars(f: FontPair): CSSProperties {
  return { "--f-display": f.display, "--f-body": f.body, "--f-label": f.label } as CSSProperties;
}
