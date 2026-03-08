DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Lab users can update profiles.'
  ) THEN
    CREATE POLICY "Lab users can update profiles." ON public.profiles
      FOR UPDATE
      USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'receptionist')
      );
  END IF;
END $$;
