DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@nuvia.com') THEN
    new_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@nuvia.com',
      crypt('admin123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin", "role": "master"}',
      false, 'authenticated', 'authenticated',
      '',    -- confirmation_token
      '',    -- recovery_token
      '',    -- email_change_token_new
      '',    -- email_change
      '',    -- email_change_token_current
      NULL,  -- phone
      '',    -- phone_change
      '',    -- phone_change_token
      ''     -- reauthentication_token
    );

    INSERT INTO public.profiles (
      id,
      email,
      name,
      role,
      is_approved,
      is_active,
      permissions
    ) VALUES (
      new_user_id,
      'admin@nuvia.com',
      'Admin',
      'master',
      true,
      true,
      '{"inbox":{"access":true,"actions":{"view_all":true,"view_mine":true,"create_order":true}},"kanban":{"access":true,"actions":{"move_cards":true,"view_all":true,"filter_dentist":true}},"history":{"access":true,"actions":{"select_dentist":true,"show_completed":true,"search":true}},"finances":{"access":true,"actions":{}},"inventory":{"access":true,"actions":{}},"settings":{"access":true,"actions":{}}}'::jsonb
    );
  END IF;
END $$;
