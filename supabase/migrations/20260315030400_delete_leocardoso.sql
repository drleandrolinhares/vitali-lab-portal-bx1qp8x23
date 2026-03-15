DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Strictly identify the target user by their specific email address to ensure
  -- we do not affect any other users with similar names (e.g., Leandro de Souza).
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = 'leocardoso4556@outlook.com' 
  LIMIT 1;

  -- If the user exists, proceed with complete deletion
  IF target_user_id IS NOT NULL THEN
    -- Deleting from auth.users will automatically trigger the ON DELETE CASCADE 
    -- constraint on public.profiles(id), thereby removing their profile record.
    -- It will also cascade to any other dependent records (like orders if they were a dentist, 
    -- or set to NULL in audit logs).
    DELETE FROM auth.users WHERE id = target_user_id;
  END IF;
END $$;
