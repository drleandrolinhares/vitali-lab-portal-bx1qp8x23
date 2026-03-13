DO $
DECLARE
    target_user_id uuid;
BEGIN
    -- Find the specific duplicate profile by exact name
    SELECT id INTO target_user_id 
    FROM public.profiles 
    WHERE name = 'DENTISTA LEANDRO DE SOUZA' 
    LIMIT 1;

    -- If found, delete the auth.user record. 
    -- This cascades to public.profiles and subsequently to related records
    -- (like orders, billing_controls, etc.) according to foreign key constraints.
    IF target_user_id IS NOT NULL THEN
        DELETE FROM auth.users WHERE id = target_user_id;
    END IF;
END $;

