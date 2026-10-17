/**
 * Tudo que o produto deduz de uma URL: ícone de marca, título padrão e uma
 * legenda curta (o @ do perfil). Assim a pessoa só cola o link.
 */

import type { BrandName } from "@/components/BrandIcon";

interface BrandRule {
  brand: BrandName;
  label: string;
  hosts: string[];
}

const RULES: BrandRule[] = [
  { brand: "instagram", label: "Instagram", hosts: ["instagram.com", "instagr.am"] },
  { brand: "youtube", label: "YouTube", hosts: ["youtube.com", "youtu.be", "music.youtube.com"] },
  { brand: "facebook", label: "Facebook", hosts: ["facebook.com", "fb.com", "fb.me"] },
  { brand: "spotify", label: "Spotify", hosts: ["spotify.com", "spotify.link"] },
  { brand: "whatsapp", label: "WhatsApp", hosts: ["wa.me", "whatsapp.com", "api.whatsapp.com"] },
  { brand: "tiktok", label: "TikTok", hosts: ["tiktok.com"] },
  { brand: "x", label: "X", hosts: ["x.com", "twitter.com"] },
  { brand: "linkedin", label: "LinkedIn", hosts: ["linkedin.com", "lnkd.in"] },
  { brand: "github", label: "GitHub", hosts: ["github.com"] },
  { brand: "threads", label: "Threads", hosts: ["threads.net", "threads.com"] },
  { brand: "soundcloud", label: "SoundCloud", hosts: ["soundcloud.com"] },
  { brand: "applemusic", label: "Apple Music", hosts: ["music.apple.com"] },
  { brand: "deezer", label: "Deezer", hosts: ["deezer.com", "deezer.page.link"] },
  { brand: "behance", label: "Behance", hosts: ["behance.net"] },
  { brand: "dribbble", label: "Dribbble", hosts: ["dribbble.com"] },
  { brand: "pinterest", label: "Pinterest", hosts: ["pinterest.com", "pin.it"] },
  { brand: "twitch", label: "Twitch", hosts: ["twitch.tv"] },
  { brand: "telegram", label: "Telegram", hosts: ["t.me", "telegram.me"] },
  { brand: "discord", label: "Discord", hosts: ["discord.gg", "discord.com"] },
  { brand: "substack", label: "Substack", hosts: ["substack.com"] },
  { brand: "medium", label: "Medium", hosts: ["medium.com"] },
  { brand: "ifood", label: "iFood", hosts: ["ifood.com.br"] },
  { brand: "calendly", label: "Agendar horário", hosts: ["calendly.com"] },
  { brand: "bluesky", label: "Bluesky", hosts: ["bsky.app"] },
];

/** Completa o que a pessoa colou: e-mail vira mailto:, domínio solto ganha https:// */
export function normalizeUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  if (/^\+?[\d\s()-]{8,}$/.test(v)) return `tel:${v.replace(/[^\d+]/g, "")}`;
  return `https://${v.replace(/^\/+/, "")}`;
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^(www\.|m\.)/, "");
  } catch {
    return null;
  }
}

function matchRule(url: string): BrandRule | null {
  const host = hostOf(url);
  if (!host) return null;
  return RULES.find((r) => r.hosts.some((h) => host === h || host.endsWith(`.${h}`))) ?? null;
}

export function detectBrand(url: string): BrandName {
  if (/^mailto:/i.test(url)) return "email";
  if (/^tel:/i.test(url)) return "phone";
  return matchRule(url)?.brand ?? "website";
}

/** Título que aparece no botão quando a pessoa não escreve um */
export function defaultTitle(url: string): string {
  if (/^mailto:/i.test(url)) return "E-mail";
  if (/^tel:/i.test(url)) return "Telefone";
  const rule = matchRule(url);
  if (rule) return rule.label;
  const host = hostOf(url);
  return host ? host.replace(/\.(com|com\.br|net|org|br|io|app|me)$/, "").replace(/^./, (c) => c.toUpperCase()) : "Link";
}

/** Legenda curta: o @ nas redes, o domínio nos sites, o endereço no e-mail */
export function defaultNote(url: string): string {
  if (/^mailto:/i.test(url)) return url.replace(/^mailto:/i, "");
  if (/^tel:/i.test(url)) return url.replace(/^tel:/i, "");
  const host = hostOf(url);
  if (!host) return "";
  const rule = matchRule(url);
  if (!rule) return host;
  try {
    const first = new URL(url).pathname.split("/").filter(Boolean)[0] ?? "";
    if (first && /^@?[\w.]{2,}$/.test(first) && !["channel", "c", "user", "in", "artist", "album", "playlist", "watch", "p", "reel"].includes(first)) {
      return first.startsWith("@") ? first : `@${first}`;
    }
  } catch {
    /* sem legenda */
  }
  return "";
}

/** Link do WhatsApp a partir do número salvo no perfil */
export function whatsappUrl(number: string): string {
  const digits = number.replace(/\D/g, "");
  const withCountry = digits.length <= 11 ? `55${digits}` : digits;
  return `https://wa.me/${withCountry}`;
}
