-- ============================================================
-- Migration 004 — Tabela custom_themes + bucket theme-media + ajustes em theme_config
-- Executar no SQL Editor do Supabase
-- ============================================================

-- 1. Criar tabela de temas personalizados (criados pelo admin via upload)
CREATE TABLE IF NOT EXISTS custom_themes (
  id                text        PRIMARY KEY,
  name              text        NOT NULL,
  description       text        NOT NULL DEFAULT '',
  media_url         text        NOT NULL,
  media_type        text        NOT NULL CHECK (media_type IN ('image', 'video')),
  preview_color     text        NOT NULL DEFAULT '#0a0a0a',
  text_color        text        NOT NULL DEFAULT '#ffffff',
  button_color      text        NOT NULL DEFAULT 'rgba(255,255,255,0.15)',
  button_text_color text        NOT NULL DEFAULT '#ffffff',
  button_style      text        NOT NULL DEFAULT 'rounded',
  font_family       text        NOT NULL DEFAULT 'Inter',
  is_pro            boolean     NOT NULL DEFAULT false,
  thumbnail_url     text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE custom_themes ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode ler os temas
CREATE POLICY "anyone_read_custom_themes"
  ON custom_themes FOR SELECT
  USING (true);

-- Apenas admin pode criar, editar e excluir
CREATE POLICY "only_admin_write_custom_themes"
  ON custom_themes FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- 2. Adicionar coluna preview_url na theme_config
ALTER TABLE theme_config
  ADD COLUMN IF NOT EXISTS preview_url text;

-- 3. Adicionar coluna thumbnail_url caso a tabela já existia sem ela
ALTER TABLE custom_themes
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- 4. Bucket theme-media (leitura pública, upload restrito a admin)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('theme-media', 'theme-media', true, 52428800)   -- 50 MB
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 52428800;

-- Leitura pública
DROP POLICY IF EXISTS "public_read_theme_media"   ON storage.objects;
CREATE POLICY "public_read_theme_media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'theme-media');

-- Upload apenas para admin
DROP POLICY IF EXISTS "admin_upload_theme_media"  ON storage.objects;
CREATE POLICY "admin_upload_theme_media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'theme-media' AND is_admin());

-- Update apenas para admin (upsert)
DROP POLICY IF EXISTS "admin_update_theme_media"  ON storage.objects;
CREATE POLICY "admin_update_theme_media"
  ON storage.objects FOR UPDATE
  USING  (bucket_id = 'theme-media' AND is_admin());

-- Delete apenas para admin
DROP POLICY IF EXISTS "admin_delete_theme_media"  ON storage.objects;
CREATE POLICY "admin_delete_theme_media"
  ON storage.objects FOR DELETE
  USING  (bucket_id = 'theme-media' AND is_admin());
