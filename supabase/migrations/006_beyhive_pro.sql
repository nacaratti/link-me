-- Migration 006 — Marcar tema Beyhive como PRO
INSERT INTO theme_config (id, is_pro)
VALUES ('beyhive', true)
ON CONFLICT (id) DO UPDATE SET is_pro = true;
