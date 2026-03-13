DO $$
BEGIN
  -- Clear assigned_dentists for specific profiles and any master/admin
  -- Setting to '[]'::jsonb instead of NULL effectively unlinks them,
  -- removing the "Dentist View Mode" account cross-contamination completely.
  UPDATE public.profiles
  SET assigned_dentists = '[]'::jsonb
  WHERE email IN ('drleandrolinhares@gmail.com', 'mosby.ls@gmail.com')
     OR role IN ('master', 'admin');
END $$;
