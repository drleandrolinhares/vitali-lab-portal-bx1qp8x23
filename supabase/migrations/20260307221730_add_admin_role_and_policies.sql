-- Table: orders policies
DROP POLICY IF EXISTS "Dentists can view own orders, lab can view all" ON public.orders;
CREATE POLICY "Dentists can view own orders, lab can view all" ON public.orders
FOR SELECT USING (
  dentist_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('receptionist', 'admin'))
);

DROP POLICY IF EXISTS "Lab can update all orders, dentists can update own" ON public.orders;
CREATE POLICY "Lab can update all orders, dentists can update own" ON public.orders
FOR UPDATE USING (
  dentist_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('receptionist', 'admin'))
);

-- Table: order_history policies
DROP POLICY IF EXISTS "Dentists can view own order history, lab can view all" ON public.order_history;
CREATE POLICY "Dentists can view own order history, lab can view all" ON public.order_history
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_history.order_id 
    AND (
      orders.dentist_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('receptionist', 'admin'))
    )
  )
);

DROP POLICY IF EXISTS "Lab can insert order history, dentists can insert for own" ON public.order_history;
CREATE POLICY "Lab can insert order history, dentists can insert for own" ON public.order_history
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_history.order_id 
    AND (
      orders.dentist_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role IN ('receptionist', 'admin'))
    )
  )
);

-- Handle trigger logic to accept 'admin' role correctly if provided
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, clinic)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'dentist'),
    NEW.raw_user_meta_data->>'clinic'
  );
  RETURN NEW;
END;
$function$;

-- Seed Admin user
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000',
    'admin@vitalilab.com', crypt('Admin123!', gen_salt('bf')), NOW(),
    NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Admin Vitali", "role": "admin"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  );
END $$;
