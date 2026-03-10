-- Drop the trigger that syncs phone to auth.users to avoid uniqueness errors 
-- since we are dropping phone based authentication completely.
DROP TRIGGER IF EXISTS on_profile_phone_update ON public.profiles;

-- Drop the functions related to phone auth logic
DROP FUNCTION IF EXISTS public.sync_profile_phone_to_auth();
DROP FUNCTION IF EXISTS public.get_email_by_phone(text);
