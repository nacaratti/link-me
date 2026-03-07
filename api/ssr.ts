import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";

const RESERVED_PATHS = new Set([
  "dashboard", "entrar", "api", "auth", "admin",
  "login", "register", "settings", "help",
]);

function extractUsername(url: string): string | null {
  const pathname = url.split("?")[0];
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 1 && !RESERVED_PATHS.has(parts[0])) return parts[0];
  return null;
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface ProfileRow {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

function injectOgTags(html: string, profile: ProfileRow): string {
  const name = profile.display_name || profile.username;
  const title = escapeAttr(`${name} — linqu.es`);
  const description = escapeAttr(
    profile.bio || `Confira os links de ${name} no linqu.es`
  );
  const image =
    profile.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.username)}`;
  const canonical = `https://linqu.es/${profile.username}`;

  const tags = `
    <title>${title}</title>
    <link rel="canonical" href="${escapeAttr(canonical)}" />
    <meta name="description" content="${description}" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${escapeAttr(canonical)}" />
    <meta property="og:site_name" content="linqu.es" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${escapeAttr(image)}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${escapeAttr(image)}" />`;

  return html
    .replace(/<title>[^<]*<\/title>/, "")
    .replace("</head>", `${tags}\n  </head>`);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function fetchProfileForOg(username: string): Promise<ProfileRow | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url")
    .eq("username", username)
    .maybeSingle();
  return data ?? null;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const indexPath = path.join(process.cwd(), "dist", "index.html");
  let template = fs.readFileSync(indexPath, "utf-8");

  const username = extractUsername(req.url || "/");
  if (username) {
    const profile = await fetchProfileForOg(username);
    if (profile) template = injectOgTags(template, profile);
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(template);
}
