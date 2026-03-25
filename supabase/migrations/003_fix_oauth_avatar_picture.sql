-- Corrige OAuth Google: metadata usa "picture", não "avatar_url".
-- Inserir NULL em avatar_url quebra (NOT NULL; DEFAULT não aplica quando a coluna está no INSERT).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_username     text := (new.raw_user_meta_data->>'username');
  v_display_name text := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data->>'display_name'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'name'), ''),
    NULLIF(TRIM(split_part(COALESCE(new.email, ''), '@', 1)), ''),
    ''
  );
  v_avatar       text := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'picture'), ''),
    ''
  );
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (new.id, v_username, v_display_name, v_avatar)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
