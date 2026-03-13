DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'leocardoso4556@outlook.com' LIMIT 1;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    
    -- Insert new auth user
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id, '00000000-0000-0000-0000-000000000000', 'leocardoso4556@outlook.com', crypt('123456', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Leandro", "role": "master"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    -- Ensure existing user has correct password and constraints
    UPDATE auth.users
    SET encrypted_password = crypt('123456', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
        updated_at = NOW(),
        raw_user_meta_data = '{"name": "Leandro", "role": "master"}'::jsonb,
        confirmation_token = COALESCE(NULLIF(confirmation_token, NULL), ''), 
        recovery_token = COALESCE(NULLIF(recovery_token, NULL), ''), 
        email_change_token_new = COALESCE(NULLIF(email_change_token_new, NULL), ''), 
        email_change = COALESCE(NULLIF(email_change, NULL), ''), 
        email_change_token_current = COALESCE(NULLIF(email_change_token_current, NULL), ''), 
        phone_change = COALESCE(NULLIF(phone_change, NULL), ''), 
        phone_change_token = COALESCE(NULLIF(phone_change_token, NULL), ''), 
        reauthentication_token = COALESCE(NULLIF(reauthentication_token, NULL), '')
    WHERE id = v_user_id;
  END IF;

  -- Create or update profile
  INSERT INTO public.profiles (id, email, name, role, is_approved, is_active, requires_password_change)
  VALUES (v_user_id, 'leocardoso4556@outlook.com', 'Leandro', 'master', true, true, false)
  ON CONFLICT (id) DO UPDATE
  SET email = 'leocardoso4556@outlook.com',
      name = 'Leandro',
      role = 'master',
      is_approved = true,
      is_active = true,
      requires_password_change = false;

END $$;
