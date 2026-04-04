-- ============================================================
-- Migration 001 — Planos (free/pro) + Papel admin + theme_config
-- Executar no SQL Editor do Supabase
-- ============================================================

-- 1. Adicionar colunas plan e role em profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS plan  text NOT NULL DEFAULT 'free' CHECK (plan  IN ('free', 'pro')),
  ADD COLUMN IF NOT EXISTS role  text NOT NULL DEFAULT 'user' CHECK (role  IN ('user', 'admin'));

-- 2. Tabela de configuração de temas (admin pode marcar temas como pro)
CREATE TABLE IF NOT EXISTS theme_config (
  id         text PRIMARY KEY,
  is_pro     boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE theme_config ENABLE ROW LEVEL SECURITY;

-- Seed inicial: todos grátis exceto os WebGL e animados
INSERT INTO theme_config (id, is_pro) VALUES
  ('default',       false),
  ('mercury',       true),
  ('quantum',       true),
  ('laser',         true),
  ('void',          true),
  ('aurora',        true),
  ('blob',          true),
  ('constellation', true),
  ('ripple',        true),
  ('flow',          true),
  ('fireflies',     true)
ON CONFLICT (id) DO NOTHING;

-- 3. Funções auxiliares com SECURITY DEFINER
--    (executam como postgres, bypassam RLS, sem recursão)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS text LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION current_user_plan()
RETURNS text LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT plan FROM profiles WHERE id = auth.uid();
$$;

-- 4. Atualizar RLS de profiles
--    Remover qualquer política de UPDATE existente antes de recriar
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Usuários podem atualizar apenas campos de aparência/perfil
-- role e plan só podem ser alterados por admin
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE
  USING  (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      is_admin()
      OR (
        role = current_user_role()
        AND plan = current_user_plan()
      )
    )
  );

-- 5. Políticas para theme_config
CREATE POLICY "anyone_read_theme_config"
  ON theme_config FOR SELECT
  USING (true);

CREATE POLICY "only_admin_write_theme_config"
  ON theme_config FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- 6. Política de UPDATE para admins atualizarem qualquer profile
--    (para mudar plan de usuários no painel admin)
CREATE POLICY "admin_update_any_profile" ON profiles
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- 7. Política SELECT para admin ver todos os profiles
CREATE POLICY "admin_select_all_profiles" ON profiles
  FOR SELECT
  USING (auth.uid() = id OR is_admin());

-- ============================================================
-- Para criar o primeiro admin, rode no SQL Editor:
--   UPDATE profiles SET role = 'admin' WHERE username = 'SEU_USERNAME';
-- Nunca expor isso via API/frontend.
-- ============================================================
