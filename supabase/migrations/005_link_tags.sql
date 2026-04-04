-- Tag de status do perfil
-- Executar no SQL Editor do Supabase
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS status_tag         text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_tag_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS status_tag_color   text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_tag_bg      text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_tag_size    text    DEFAULT 'md',
  ADD COLUMN IF NOT EXISTS status_tag_position text   DEFAULT 'above-left',
  ADD COLUMN IF NOT EXISTS status_tag_font    text    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_tag_icon         text    DEFAULT 'dot',
  ADD COLUMN IF NOT EXISTS status_tag_custom_label text    DEFAULT NULL;
