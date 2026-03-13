DO $$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT id INTO target_user_id 
    FROM public.profiles 
    WHERE email = 'mosby.ls@gmail.com' 
    LIMIT 1;

    IF target_user_id IS NOT NULL THEN
        -- Reativa o perfil no schema public
        UPDATE public.profiles
        SET is_active = true
        WHERE id = target_user_id;
    END IF;
END $$;
