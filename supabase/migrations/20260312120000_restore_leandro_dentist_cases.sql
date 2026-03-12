DO $$
DECLARE
    v_master_id uuid;
    v_dentist_id uuid;
    v_new_user_id uuid := gen_random_uuid();
BEGIN
    -- 1. Find the MASTER profile for Leandro
    SELECT id INTO v_master_id 
    FROM public.profiles 
    WHERE name ILIKE '%Leandro de Souza%' AND role = 'master' 
    ORDER BY created_at ASC
    LIMIT 1;

    -- 2. Find the DENTISTA profile for Leandro
    SELECT id INTO v_dentist_id 
    FROM public.profiles 
    WHERE name ILIKE '%Leandro de Souza%' AND role = 'dentist'
    ORDER BY created_at DESC
    LIMIT 1;

    -- 3. If MASTER exists but DENTISTA does not, create it
    IF v_master_id IS NOT NULL AND v_dentist_id IS NULL THEN
        -- Check if the standard email is already in use to prevent unique constraint error
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.leandro@studiovitalilab.com.br') THEN
            INSERT INTO auth.users (
                id, instance_id, email, encrypted_password, email_confirmed_at,
                created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
                is_super_admin, role, aud,
                confirmation_token, recovery_token, email_change_token_new,
                email_change, email_change_token_current,
                phone, phone_change, phone_change_token, reauthentication_token
            ) VALUES (
                v_new_user_id,
                '00000000-0000-0000-0000-000000000000',
                'dr.leandro@studiovitalilab.com.br',
                crypt('Vitali123!', gen_salt('bf')),
                NOW(), NOW(), NOW(),
                '{"provider": "email", "providers": ["email"]}',
                '{"name": "Leandro de Souza (Dentista)", "role": "dentist", "clinic": "Studio Vitali Lab"}',
                false, 'authenticated', 'authenticated',
                '', '', '', '', '',
                NULL, '', '', ''
            );
            
            v_dentist_id := v_new_user_id;

            -- The handle_new_user trigger creates the profile, but we ensure it's fully active
            UPDATE public.profiles 
            SET is_approved = true, is_active = true 
            WHERE id = v_dentist_id;
        END IF;
    END IF;

    -- 4. Re-link orders from MASTER to DENTISTA
    IF v_master_id IS NOT NULL AND v_dentist_id IS NOT NULL THEN
        UPDATE public.orders
        SET dentist_id = v_dentist_id
        WHERE dentist_id = v_master_id;
    END IF;
END $$;
