// Gera components/BrandIcon.tsx com os paths das marcas que as páginas reconhecem.
// Os dados vêm do simple-icons (CC0) e ficam embutidos, para o runtime não
// depender do pacote. Rodar de novo (npm run icons) só se entrar uma rede nova.
// Mesmo padrão do site do Silvério Pontes v2.

import { writeFileSync } from "node:fs";
import * as si from "simple-icons";

const WANTED = {
  instagram: si.siInstagram,
  youtube: si.siYoutube,
  facebook: si.siFacebook,
  spotify: si.siSpotify,
  whatsapp: si.siWhatsapp,
  tiktok: si.siTiktok,
  x: si.siX,
  github: si.siGithub,
  threads: si.siThreads,
  soundcloud: si.siSoundcloud,
  applemusic: si.siApplemusic,
  deezer: si.siDeezer,
  behance: si.siBehance,
  dribbble: si.siDribbble,
  pinterest: si.siPinterest,
  twitch: si.siTwitch,
  telegram: si.siTelegram,
  discord: si.siDiscord,
  substack: si.siSubstack,
  medium: si.siMedium,
  ifood: si.siIfood,
  calendly: si.siCalendly,
  bluesky: si.siBluesky,
};

const paths = Object.fromEntries(
  Object.entries(WANTED).map(([name, icon]) => [name, icon.path]),
);

const file = `// Gerado por scripts/brand-icons.mjs — paths do simple-icons (CC0).

export type BrandName = ${Object.keys(paths).map((n) => `"${n}"`).join(" | ")} | "linkedin" | "website" | "email" | "phone" | "disc";

const PATHS: Record<Exclude<BrandName, "linkedin" | "website" | "email" | "phone" | "disc">, string> = ${JSON.stringify(paths, null, 2)};

/** O LinkedIn saiu do simple-icons; um "in" simples no lugar */
const LINKEDIN =
  "M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm2.5 6.5V18h2.7V9.5H6.5zm1.35-4.3a1.55 1.55 0 100 3.1 1.55 1.55 0 000-3.1zM11 9.5V18h2.7v-4.4c0-1.2.4-2.2 1.7-2.2s1.4 1.1 1.4 2.3V18H19.5v-5c0-2.4-.8-3.7-3-3.7-1.3 0-2.2.6-2.7 1.4V9.5H11z";

/** Globo desenhado à mão para sites, que não são marca */
const WEBSITE =
  "M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c1.7 0 3.2 2.6 3.8 6H8.2C8.8 6.6 10.3 4 12 4zM7.8 10h8.4a19 19 0 010 4H7.8a19 19 0 010-4zm-2 0a21 21 0 000 4H4.3a8 8 0 010-4h1.5zm12.4 0h1.5a8 8 0 010 4h-1.5a21 21 0 000-4zM8.2 16h7.6c-.6 3.4-2.1 6-3.8 6s-3.2-2.6-3.8-6zm-2.5 0c.3 1.6.8 3 1.4 4.2A8 8 0 015.2 16h.5zm12.6 0h.5a8 8 0 01-1.9 4.2c.6-1.2 1.1-2.6 1.4-4.2zM7.1 3.8C6.5 5 6 6.4 5.7 8h-.5a8 8 0 011.9-4.2zM16.9 3.8A8 8 0 0118.8 8h-.5c-.3-1.6-.8-3-1.4-4.2z";

/** Envelope para o e-mail */
const EMAIL =
  "M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm1.4 2L12 12.3 19.6 7H4.4zM20 8.9l-7.4 5.2a1 1 0 01-1.2 0L4 8.9V17h16V8.9z";

/** Telefone */
const PHONE =
  "M6.6 2.5l2.6-.4a1 1 0 011.1.7l1.1 3.6a1 1 0 01-.3 1L9.4 9a12 12 0 005.6 5.6l1.6-1.7a1 1 0 011-.3l3.6 1.1a1 1 0 01.7 1.1l-.4 2.6a2 2 0 01-2 1.7A16.5 16.5 0 014.9 4.5a2 2 0 011.7-2z";

/** Disco, para lançamentos que não moram numa plataforma só */
const DISC =
  "M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm0 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z";

const EXTRA = { linkedin: LINKEDIN, website: WEBSITE, email: EMAIL, phone: PHONE, disc: DISC } as const;

export default function BrandIcon({
  name,
  className = "h-5 w-5",
}: {
  name: BrandName;
  className?: string;
}) {
  const d = name in EXTRA ? EXTRA[name as keyof typeof EXTRA] : PATHS[name as keyof typeof PATHS];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}
`;

writeFileSync("components/BrandIcon.tsx", file);
console.log("ok:", Object.keys(paths).join(", "));
