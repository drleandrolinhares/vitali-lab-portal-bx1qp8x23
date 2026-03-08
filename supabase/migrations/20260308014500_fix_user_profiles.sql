-- Recreate the function to be more robust with ON CONFLICT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, clinic)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'dentist'),
    NEW.raw_user_meta_data->>'clinic'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    clinic = EXCLUDED.clinic;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill any missing profiles from auth.users to ensure table visibility
INSERT INTO public.profiles (id, email, name, role, clinic)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'Usuário'),
  COALESCE(raw_user_meta_data->>'role', 'dentist'),
  raw_user_meta_data->>'clinic'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Add INSERT policy for soft reconciliation from client side
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = 'profiles' 
          AND policyname = 'Users can insert own profile.'
    ) THEN
        CREATE POLICY "Users can insert own profile." ON profiles 
        FOR INSERT TO authenticated 
        WITH CHECK (auth.uid() = id);
    END IF;
END
$$;
