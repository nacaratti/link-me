import { config } from "dotenv";
config({ path: ".env.local" });

import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";

// ─── OG Tag Injection ────────────────────────────────────────────────────────

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

function injectOgTags(html: string, profile: ProfileRow): string {
  const name = profile.display_name || profile.username;
  const title = escapeAttr(`${name} — linqu.es`);
  const description = escapeAttr(
    profile.bio || `Confira os links de ${name} no linqu.es`
  );
  const image = profile.avatar_url ||
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

// ─── Server-side Supabase client (reads public profile data for OG tags) ────

interface ProfileRow {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const serverSupabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function fetchProfileForOg(username: string): Promise<ProfileRow | null> {
  if (!serverSupabase) return null;
  const { data } = await serverSupabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url")
    .eq("username", username)
    .maybeSingle();
  return data ?? null;
}

// ─── Express app ─────────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      try {
        let template = fs.readFileSync(
          path.resolve(process.cwd(), "index.html"),
          "utf-8"
        );
        template = await vite.transformIndexHtml(req.originalUrl, template);

        const username = extractUsername(req.originalUrl);
        if (username) {
          const profile = await fetchProfileForOg(username);
          if (profile) template = injectOgTags(template, profile);
        }

        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");
    app.use(express.static(distPath));

    app.get("*", async (req, res, next) => {
      try {
        let template = fs.readFileSync(indexPath, "utf-8");

        const username = extractUsername(req.originalUrl);
        if (username) {
          const profile = await fetchProfileForOg(username);
          if (profile) template = injectOgTags(template, profile);
        }

        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
