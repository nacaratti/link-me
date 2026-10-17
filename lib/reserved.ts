/** Endereços que não podem virar username porque são rotas do app. */
export const RESERVED_USERNAMES = new Set([
  "admin", "api", "auth", "criar", "dashboard", "entrar", "help", "login",
  "painel", "preview", "privacidade", "register", "settings", "setup",
  "termos", "upgrade", "_next", "favicon.ico", "robots.txt", "sitemap.xml",
]);

const USERNAME_RE = /^[a-z0-9](?:[a-z0-9._-]{1,28}[a-z0-9])?$/;

/** Normaliza o que a pessoa digitou: minúsculas, sem acento, sem espaço */
export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^@/, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "");
}

/** Retorna a mensagem de erro, ou null se o username é válido */
export function usernameError(username: string): string | null {
  if (username.length < 3) return "Use pelo menos 3 caracteres.";
  if (username.length > 30) return "Use no máximo 30 caracteres.";
  if (!USERNAME_RE.test(username)) return "Use letras, números, ponto, hífen ou _ (sem começar ou terminar com eles).";
  if (RESERVED_USERNAMES.has(username)) return "Esse endereço é reservado.";
  return null;
}
