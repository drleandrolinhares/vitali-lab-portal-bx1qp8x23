-- Fix the protect_is_approved_trigger to ensure it doesn't interfere with is_active updates
CREATE OR REPLACE FUNCTION public.protect_is_approved()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only execute logic if is_approved is actually changing
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved THEN
    IF auth.uid() IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'master', 'receptionist')
      ) THEN
        NEW.is_approved = OLD.is_approved;
      END IF;
    END IF;
  END IF;
  
  -- Ensure other fields like is_active remain untouched by this trigger
  RETURN NEW;
END;
$function$
