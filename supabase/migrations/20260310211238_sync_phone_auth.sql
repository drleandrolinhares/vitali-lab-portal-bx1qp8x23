-- 1. Create RPC to lookup email by phone safely for unauthenticated users
CREATE OR REPLACE FUNCTION public.get_email_by_phone(p_phone TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
  v_digits TEXT;
BEGIN
  v_digits := regexp_replace(p_phone, '\D', '', 'g');
  
  IF v_digits = '' THEN
    RETURN NULL;
  END IF;

  SELECT email INTO v_email 
  FROM public.profiles 
  WHERE regexp_replace(personal_phone, '\D', '', 'g') = v_digits 
     OR personal_phone = p_phone
  LIMIT 1;
  
  RETURN v_email;
END;
$$;

-- 2. Function to sync profile phone to auth.users
CREATE OR REPLACE FUNCTION public.sync_profile_phone_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_clean_phone TEXT;
BEGIN
  IF NEW.personal_phone IS DISTINCT FROM OLD.personal_phone THEN
    v_clean_phone := NULLIF(regexp_replace(NEW.personal_phone, '\D', '', 'g'), '');
    
    IF v_clean_phone IS NOT NULL THEN
      -- Avoid recursion and only update if different
      IF (SELECT phone FROM auth.users WHERE id = NEW.id) IS DISTINCT FROM v_clean_phone THEN
        BEGIN
          UPDATE auth.users
          SET phone = v_clean_phone
          WHERE id = NEW.id;
        EXCEPTION WHEN unique_violation THEN
          -- Ignore unique violation, another user already has this phone
        END;
      END IF;
    ELSE
      -- If cleared out
      IF (SELECT phone FROM auth.users WHERE id = NEW.id) IS NOT NULL THEN
        UPDATE auth.users SET phone = NULL WHERE id = NEW.id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_phone_update ON public.profiles;
CREATE TRIGGER on_profile_phone_update
AFTER UPDATE OF personal_phone ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_phone_to_auth();

-- 3. Initial sync for existing users
DO $$
DECLARE
  r RECORD;
  v_clean_phone TEXT;
BEGIN
  FOR r IN SELECT id, personal_phone FROM public.profiles WHERE personal_phone IS NOT NULL AND personal_phone != '' LOOP
    v_clean_phone := NULLIF(regexp_replace(r.personal_phone, '\D', '', 'g'), '');
    IF v_clean_phone IS NOT NULL THEN
      BEGIN
        UPDATE auth.users SET phone = v_clean_phone WHERE id = r.id AND (phone IS NULL OR phone IS DISTINCT FROM v_clean_phone);
      EXCEPTION WHEN unique_violation THEN
        -- Ignore if phone already taken
      END;
    END IF;
  END LOOP;
END;
$$;
