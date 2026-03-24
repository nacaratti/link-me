-- ============================================================
-- Migration 002 — Suporte a OAuth (Google)
-- Executar no SQL Editor do Supabase
-- ============================================================

-- 1. Tornar username nullable temporariamente para usuários OAuth
--    (username null = usuário ainda não escolheu o username após login social)
ALTER TABLE profiles
  ALTER COLUMN username DROP NOT NULL;

-- 2. Recriar o trigger para suportar OAuth:
--    - Email/senha: usa raw_user_meta_data.username (obrigatório no formulário)
--    - OAuth (Google etc.): username fica NULL até o usuário escolher na tela de setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_username     text := (new.raw_user_meta_data->>'username');
  v_display_name text := COALESCE(
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );
  v_avatar       text := new.raw_user_meta_data->>'avatar_url';
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (new.id, v_username, v_display_name, v_avatar)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- 3. Garantir que o trigger existe (recria se necessário)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Índice único parcial: username único APENAS quando não é nulo
--    (evita conflito de múltiplos usuários com username null)
DROP INDEX IF EXISTS profiles_username_unique;
CREATE UNIQUE INDEX profiles_username_unique
  ON profiles (username)
  WHERE username IS NOT NULL;

-- ============================================================
-- ATENÇÃO: se já havia UNIQUE CONSTRAINT direto na coluna,
-- remova-a antes de criar o índice parcial:
--   ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_key;
-- ============================================================
