DO $$
BEGIN
  -- Reset permissions for specified users to fully rely on centralized defaults
  -- until configured manually by admins
  UPDATE public.profiles
  SET permissions = NULL
  WHERE name ILIKE '%Karina%'
     OR name ILIKE '%Pedro%'
     OR name ILIKE '%Leonardo%'
     OR name ILIKE '%Amanda%';
END $$;
