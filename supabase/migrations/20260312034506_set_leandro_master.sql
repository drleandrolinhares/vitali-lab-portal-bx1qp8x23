DO $$
BEGIN
  -- Ensure Leandro de Souza is set to master role
  UPDATE public.profiles
  SET role = 'master'
  WHERE name ILIKE '%Leandro de Souza%';

  -- Also update the auth.users metadata to match
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"master"')
  WHERE id IN (
    SELECT id FROM public.profiles WHERE name ILIKE '%Leandro de Souza%'
  );
END $$;
