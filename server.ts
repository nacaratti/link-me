import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log("Starting server...");
  try {
    console.log("DB check:", db.prepare('SELECT 1').get());
  } catch (e) {
    console.error("DB check failed:", e);
  }

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const RESERVED_USERNAMES = ['admin', 'help', 'settings', 'api', 'auth', 'dashboard', 'login', 'register'];

  // API Routes
  app.get("/api/profiles/:username", (req, res) => {
    const { username } = req.params;
    
    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
      return res.status(404).json({ error: "Reserved username" });
    }

    const profile = db.prepare('SELECT * FROM profiles WHERE username = ?').get(username) as any;
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const links = db.prepare('SELECT * FROM links WHERE profile_id = ? ORDER BY sort_order ASC').all(profile.id);
    
    res.json({ ...profile, links, theme_config: JSON.parse(profile.theme_config) });
  });

  // Simple "Auth" simulation - just get the first profile as "current user"
  app.get("/api/me", (req, res) => {
    const profile = db.prepare('SELECT * FROM profiles LIMIT 1').get() as any;
    if (!profile) return res.status(404).json({ error: "No profile" });
    
    const links = db.prepare('SELECT * FROM links WHERE profile_id = ? ORDER BY sort_order ASC').all(profile.id);
    res.json({ ...profile, links, theme_config: JSON.parse(profile.theme_config) });
  });

  app.post("/api/links", (req, res) => {
    const { profile_id, title, url, icon_type } = req.body;
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max_order FROM links WHERE profile_id = ?').get(profile_id) as any;
    const nextOrder = (maxOrder?.max_order || 0) + 1;
    
    const result = db.prepare('INSERT INTO links (profile_id, title, url, icon_type, sort_order) VALUES (?, ?, ?, ?, ?)')
      .run(profile_id, title, url, icon_type || 'link', nextOrder);
    
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/links/:id", (req, res) => {
    db.prepare('DELETE FROM links WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.patch("/api/links/reorder", (req, res) => {
    const { links } = req.body; // Array of {id, sort_order}
    const update = db.prepare('UPDATE links SET sort_order = ? WHERE id = ?');
    const transaction = db.transaction((items) => {
      for (const item of items) update.run(item.sort_order, item.id);
    });
    transaction(links);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Manual SPA fallback for development
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
    console.log("Vite middleware integrated with manual fallback.");
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
