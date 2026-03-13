DO $$
DECLARE
  v_user_id uuid;
  v_email text := 'drleandrolinhares@gmail.com';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      v_email,
      crypt('Vitali123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Dr. Leandro Linhares", "role": "dentist"}',
      false, 'authenticated', 'authenticated',
      '',    -- confirmation_token: MUST be '' not NULL
      '',    -- recovery_token: MUST be '' not NULL
      '',    -- email_change_token_new: MUST be '' not NULL
      '',    -- email_change: MUST be '' not NULL
      '',    -- email_change_token_current: MUST be '' not NULL
      NULL,  -- phone: MUST be NULL (not '') due to UNIQUE constraint
      '',    -- phone_change: MUST be '' not NULL
      '',    -- phone_change_token: MUST be '' not NULL
      ''     -- reauthentication_token: MUST be '' not NULL
    );
  ELSE
    -- Ensure the password is set and valid
    UPDATE auth.users 
    SET encrypted_password = crypt('Vitali123!', gen_salt('bf'))
    WHERE id = v_user_id;
  END IF;

  -- Ensure public profile is synchronized
  INSERT INTO public.profiles (id, email, name, role, is_approved, is_active)
  VALUES (v_user_id, v_email, 'Dr. Leandro Linhares', 'dentist', true, true)
  ON CONFLICT (id) DO UPDATE SET
    is_approved = true,
    is_active = true,
    role = 'dentist';
    
END $$;
