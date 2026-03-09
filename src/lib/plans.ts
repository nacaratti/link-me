/** Regras de negócio de planos — funções puras, testáveis sem React/Supabase */

export const FREE_LINK_LIMIT = 5;
export const FREE_THEME_ID   = 'default';

export type Plan = 'free' | 'pro';

/** Retorna true quando o usuário free atingiu o limite de links */
export function linkLimitReached(linkCount: number, plan: Plan): boolean {
  if (plan === 'pro') return false;
  return linkCount >= FREE_LINK_LIMIT;
}

/** Retorna true quando o usuário pode usar o tema */
export function canUseTheme(themeIsPro: boolean, plan: Plan): boolean {
  if (plan === 'pro') return true;
  return !themeIsPro;
}

/** Retorna a mensagem de bloqueio de links */
export function linkBlockMessage(plan: Plan): string {
  if (plan === 'pro') return '';
  return `Plano gratuito permite até ${FREE_LINK_LIMIT} links. Faça upgrade para PRO e adicione ilimitados.`;
}

/** Retorna a mensagem de bloqueio de tema */
export function themeBlockMessage(): string {
  return 'Este tema é exclusivo do plano PRO. Faça upgrade para desbloqueá-lo.';
}
