CREATE SEQUENCE IF NOT EXISTS order_seq START 1;

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'dentist',
  clinic TEXT
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  friendly_id TEXT NOT NULL DEFAULT 'ORD-' || to_char(nextval('order_seq'), 'FM0000'),
  patient_name TEXT NOT NULL,
  dentist_id UUID NOT NULL REFERENCES profiles(id),
  work_type TEXT NOT NULL,
  material TEXT NOT NULL,
  tooth_or_arch JSONB DEFAULT '[]'::jsonb,
  color_and_considerations TEXT,
  scale_used TEXT,
  shipping_method TEXT NOT NULL,
  shipping_details TEXT,
  observations TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users." ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Dentists can view own orders, lab can view all" ON orders FOR SELECT TO authenticated USING (
  dentist_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'receptionist')
);

CREATE POLICY "Dentists can insert own orders" ON orders FOR INSERT TO authenticated WITH CHECK (
  dentist_id = auth.uid()
);

CREATE POLICY "Lab can update all orders, dentists can update own" ON orders FOR UPDATE TO authenticated USING (
  dentist_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'receptionist')
);

CREATE POLICY "Dentists can view own order history, lab can view all" ON order_history FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_history.order_id AND (
      orders.dentist_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'receptionist')
    )
  )
);

CREATE POLICY "Lab can insert order history, dentists can insert for own" ON order_history FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_history.order_id AND (
      orders.dentist_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'receptionist')
    )
  )
);

-- Triggers for User and Order History

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $
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
$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_order()
RETURNS trigger AS $
BEGIN
  INSERT INTO public.order_history (order_id, status)
  VALUES (NEW.id, NEW.status);
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_order();

-- Insert Seed Data
DO $
DECLARE
  lab_id uuid := gen_random_uuid();
  dentist_id uuid := gen_random_uuid();
BEGIN
  -- Insert receptionist user
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    lab_id, '00000000-0000-0000-0000-000000000000', 'recepcao@vitali.com',
    crypt('vitali123', gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{"name": "Recepção Vitali", "role": "receptionist"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  );

  -- Insert dentist user
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    dentist_id, '00000000-0000-0000-0000-000000000000', 'dentista@vitali.com',
    crypt('dentista123', gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{"name": "Dra. Ana Souza", "role": "dentist", "clinic": "Sorriso Clínica"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  );
END $;

