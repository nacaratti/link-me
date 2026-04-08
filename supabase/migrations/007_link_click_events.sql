-- Migration 007 — Tabela de eventos de cliques para estatísticas PRO

CREATE TABLE IF NOT EXISTS link_click_events (
  id          BIGSERIAL PRIMARY KEY,
  link_id     BIGINT      NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  profile_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clicked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_type TEXT        CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  referrer    TEXT
);

-- Índices para queries de dashboard
CREATE INDEX idx_lce_profile_id  ON link_click_events(profile_id);
CREATE INDEX idx_lce_link_id     ON link_click_events(link_id);
CREATE INDEX idx_lce_clicked_at  ON link_click_events(clicked_at);
CREATE INDEX idx_lce_profile_day ON link_click_events(profile_id, clicked_at);

-- RLS
ALTER TABLE link_click_events ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode registrar um clique (analytics público)
CREATE POLICY "anyone_insert_click_event"
  ON link_click_events FOR INSERT
  WITH CHECK (true);

-- Dono do perfil lê seus próprios eventos
CREATE POLICY "owner_read_click_events"
  ON link_click_events FOR SELECT
  USING (profile_id = auth.uid());
