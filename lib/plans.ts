/** Regras de plano — funções puras. A migração 100 espelha os mesmos limites no banco. */

import { getPalette } from "./palettes";
import { getTemplate } from "./templates";
import type { Plan } from "./types";

export const FREE_LINK_LIMIT = 5;
export const PRO_LINK_LIMIT = 50;
export const FEATURED_LIMIT = 6;

export function linkLimit(plan: Plan) {
  return plan === "pro" ? PRO_LINK_LIMIT : FREE_LINK_LIMIT;
}

export function linkLimitReached(linkCount: number, plan: Plan) {
  return linkCount >= linkLimit(plan);
}

export function canUseTemplate(templateId: string, plan: Plan) {
  return plan === "pro" || getTemplate(templateId).free;
}

export function canUsePalette(paletteId: string, plan: Plan) {
  return plan === "pro" || getPalette(paletteId).free;
}

/** Erros que os triggers do banco levantam, em português */
export function planErrorMessage(dbMessage: string): string | null {
  if (dbMessage.includes("LINK_LIMIT"))
    return `O plano grátis permite até ${FREE_LINK_LIMIT} links. Assine o PRO para ter mais.`;
  if (dbMessage.includes("FEATURED_LIMIT")) return `Você pode ter até ${FEATURED_LIMIT} destaques.`;
  if (dbMessage.includes("PRO_TEMPLATE")) return "Esse modelo é do plano PRO.";
  if (dbMessage.includes("PRO_PALETTE")) return "Essa paleta é do plano PRO.";
  return null;
}
