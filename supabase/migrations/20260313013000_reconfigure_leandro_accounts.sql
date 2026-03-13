DO $$
DECLARE
  v_dentist_id uuid;
  v_master_id uuid;
  v_conflict_id uuid;
BEGIN
  -- ==========================================
  -- 1. Reconfigure DENTIST Account
  -- ==========================================
  -- Locate profile for "Leandro de Souza" with role 'dentist'
  SELECT id INTO v_dentist_id FROM public.profiles WHERE name ILIKE 'Leandro de Souza' AND role = 'dentist' LIMIT 1;
  
  -- Fallback: locate by target email
  IF v_dentist_id IS NULL THEN
    SELECT id INTO v_dentist_id FROM auth.users WHERE email = 'mosby.ls@gmail.com' LIMIT 1;
  END IF;
  
  -- If still not found, create one
  IF v_dentist_id IS NULL THEN
    v_dentist_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_dentist_id, '00000000-0000-0000-0000-000000000000', 'mosby.ls@gmail.com', crypt('123456', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Leandro de Souza", "role": "dentist"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
    
    INSERT INTO public.profiles (id, email, name, role, is_approved, is_active, requires_password_change)
    VALUES (v_dentist_id, 'mosby.ls@gmail.com', 'Leandro de Souza', 'dentist', true, true, true)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Handle potential email conflict if we picked an ID that doesn't have the target email yet
  SELECT id INTO v_conflict_id FROM auth.users WHERE email = 'mosby.ls@gmail.com' AND id != v_dentist_id;
  IF v_conflict_id IS NOT NULL THEN
    UPDATE auth.users SET email = v_conflict_id || '@conflict.local', updated_at = NOW() WHERE id = v_conflict_id;
    UPDATE public.profiles SET email = v_conflict_id || '@conflict.local' WHERE id = v_conflict_id;
  END IF;

  -- Apply final required state for Dentist
  UPDATE auth.users
  SET email = 'mosby.ls@gmail.com',
      encrypted_password = crypt('123456', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW(),
      raw_user_meta_data = '{"name": "Leandro de Souza", "role": "dentist"}'::jsonb,
      confirmation_token = '', recovery_token = '', email_change_token_new = '', 
      email_change = '', email_change_token_current = '', phone_change = '', 
      phone_change_token = '', reauthentication_token = ''
  WHERE id = v_dentist_id;

  INSERT INTO public.profiles (id, email, name, role, is_approved, is_active, requires_password_change)
  VALUES (v_dentist_id, 'mosby.ls@gmail.com', 'Leandro de Souza', 'dentist', true, true, true)
  ON CONFLICT (id) DO UPDATE
  SET email = 'mosby.ls@gmail.com',
      name = 'Leandro de Souza',
      role = 'dentist',
      requires_password_change = true,
      is_approved = true,
      is_active = true;


  -- ==========================================
  -- 2. Reconfigure MASTER Account
  -- ==========================================
  -- Locate profile for "Leandro de Souza" with role 'master'
  SELECT id INTO v_master_id FROM public.profiles WHERE name ILIKE 'Leandro de Souza' AND role = 'master' LIMIT 1;
  
  -- Fallback: locate by target email
  IF v_master_id IS NULL THEN
    SELECT id INTO v_master_id FROM auth.users WHERE email = 'drleandrolinhares@gmail.com' LIMIT 1;
  END IF;
  
  -- If still not found, create one
  IF v_master_id IS NULL THEN
    v_master_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_master_id, '00000000-0000-0000-0000-000000000000', 'drleandrolinhares@gmail.com', crypt('123456', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Leandro de Souza", "role": "master"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
    
    INSERT INTO public.profiles (id, email, name, role, is_approved, is_active, requires_password_change)
    VALUES (v_master_id, 'drleandrolinhares@gmail.com', 'Leandro de Souza', 'master', true, true, true)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Handle potential email conflict
  SELECT id INTO v_conflict_id FROM auth.users WHERE email = 'drleandrolinhares@gmail.com' AND id != v_master_id;
  IF v_conflict_id IS NOT NULL THEN
    UPDATE auth.users SET email = v_conflict_id || '@conflict.local', updated_at = NOW() WHERE id = v_conflict_id;
    UPDATE public.profiles SET email = v_conflict_id || '@conflict.local' WHERE id = v_conflict_id;
  END IF;

  -- Apply final required state for Master
  UPDATE auth.users
  SET email = 'drleandrolinhares@gmail.com',
      encrypted_password = crypt('123456', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW(),
      raw_user_meta_data = '{"name": "Leandro de Souza", "role": "master"}'::jsonb,
      confirmation_token = '', recovery_token = '', email_change_token_new = '', 
      email_change = '', email_change_token_current = '', phone_change = '', 
      phone_change_token = '', reauthentication_token = ''
  WHERE id = v_master_id;

  INSERT INTO public.profiles (id, email, name, role, is_approved, is_active, requires_password_change)
  VALUES (v_master_id, 'drleandrolinhares@gmail.com', 'Leandro de Souza', 'master', true, true, true)
  ON CONFLICT (id) DO UPDATE
  SET email = 'drleandrolinhares@gmail.com',
      name = 'Leandro de Souza',
      role = 'master',
      requires_password_change = true,
      is_approved = true,
      is_active = true;

END $$;
