/**
 * Paletas fechadas. Cada uma é um conjunto de tokens que vira variáveis CSS
 * (--p-*) no wrapper da página; os modelos só usam as classes ligadas a elas
 * (bg-bg, text-ink, text-accent, border-rule...). Por isso qualquer modelo
 * funciona com qualquer paleta, e o usuário nunca escolhe cor por item.
 */

import type { CSSProperties } from "react";

export interface Palette {
  id: string;
  name: string;
  dark: boolean;
  /** Livre no plano gratuito */
  free: boolean;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  rule: string;
  accent: string;
  /** Texto sobre fundo accent (botões cheios) */
  onAccent: string;
}

export const PALETTES: Palette[] = [
  {
    id: "papel", name: "Papel", dark: false, free: true,
    bg: "#faf7f2", surface: "#f0ebe2", ink: "#12100e", muted: "#6b645b",
    rule: "rgba(18,16,14,0.13)", accent: "#8a6a2f", onAccent: "#faf7f2",
  },
  {
    id: "latao", name: "Latão", dark: true, free: false,
    bg: "#12100e", surface: "#1d1a16", ink: "#faf7f2", muted: "rgba(250,247,242,0.58)",
    rule: "rgba(250,247,242,0.15)", accent: "#c9a961", onAccent: "#12100e",
  },
  {
    id: "grafite", name: "Grafite", dark: true, free: true,
    bg: "#0f1012", surface: "#1a1c1f", ink: "#f2f3f5", muted: "#9a9ea6",
    rule: "rgba(242,243,245,0.12)", accent: "#f2f3f5", onAccent: "#0f1012",
  },
  {
    id: "terracota", name: "Terracota", dark: false, free: true,
    bg: "#f7efe7", surface: "#eedfd1", ink: "#2b1a12", muted: "#7a5e50",
    rule: "rgba(43,26,18,0.13)", accent: "#b4532a", onAccent: "#fff8f2",
  },
  {
    id: "oceano", name: "Oceano", dark: true, free: true,
    bg: "#0b1a26", surface: "#12283a", ink: "#eaf4fb", muted: "#8fb0c6",
    rule: "rgba(234,244,251,0.13)", accent: "#5ec4d6", onAccent: "#0b1a26",
  },
  {
    id: "oliva", name: "Oliva", dark: false, free: false,
    bg: "#f3f1e7", surface: "#e6e3d3", ink: "#23261b", muted: "#5f6450",
    rule: "rgba(35,38,27,0.14)", accent: "#5a6b2f", onAccent: "#f3f1e7",
  },
  {
    id: "rose", name: "Rosé", dark: false, free: false,
    bg: "#fbf3f1", surface: "#f3e3df", ink: "#3b2326", muted: "#8a6a6d",
    rule: "rgba(59,35,38,0.12)", accent: "#c25b6e", onAccent: "#ffffff",
  },
  {
    id: "menta", name: "Menta", dark: false, free: false,
    bg: "#f1f8f5", surface: "#ddeee7", ink: "#0f2a22", muted: "#4f6e64",
    rule: "rgba(15,42,34,0.12)", accent: "#0f8a6a", onAccent: "#f1f8f5",
  },
  {
    id: "ameixa", name: "Ameixa", dark: true, free: false,
    bg: "#1c1220", surface: "#2a1c30", ink: "#f6eef8", muted: "#b9a3c0",
    rule: "rgba(246,238,248,0.13)", accent: "#e2a3c7", onAccent: "#1c1220",
  },
  {
    id: "noite", name: "Noite", dark: true, free: false,
    bg: "#0a0a14", surface: "#15152a", ink: "#f0f0ff", muted: "#9696b8",
    rule: "rgba(240,240,255,0.12)", accent: "#8b7bff", onAccent: "#0a0a14",
  },
];

export const DEFAULT_PALETTE_ID = "papel";

export function getPalette(id: string | null | undefined): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

/** Variáveis CSS que o wrapper da página recebe em style */
export function paletteVars(p: Palette): CSSProperties {
  return {
    "--p-bg": p.bg,
    "--p-surface": p.surface,
    "--p-ink": p.ink,
    "--p-muted": p.muted,
    "--p-rule": p.rule,
    "--p-accent": p.accent,
    "--p-on-accent": p.onAccent,
    colorScheme: p.dark ? "dark" : "light",
  } as CSSProperties;
}
