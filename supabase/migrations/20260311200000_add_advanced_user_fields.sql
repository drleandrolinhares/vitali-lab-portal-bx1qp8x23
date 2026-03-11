ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rg TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cep TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_complement TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_access_schedule BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_access_at TIMESTAMPTZ;

DROP POLICY IF EXISTS "Dentists can view own orders, lab can view all" ON public.orders;
CREATE POLICY "Dentists can view own orders, lab can view all" ON public.orders FOR SELECT USING (
  (dentist_id = auth.uid()) OR (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
);

DROP POLICY IF EXISTS "Lab can update all orders, dentists can update own" ON public.orders;
CREATE POLICY "Lab can update all orders, dentists can update own" ON public.orders FOR UPDATE USING (
  (dentist_id = auth.uid()) OR (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
);

DROP POLICY IF EXISTS "Dentists can insert own orders" ON public.orders;
CREATE POLICY "Dentists can insert own orders" ON public.orders FOR INSERT WITH CHECK (
  (dentist_id = auth.uid()) OR (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text])))))
);

DROP POLICY IF EXISTS "Dentists can view own order history, lab can view all" ON public.order_history;
CREATE POLICY "Dentists can view own order history, lab can view all" ON public.order_history FOR SELECT USING (
  EXISTS ( SELECT 1 FROM orders WHERE ((orders.id = order_history.order_id) AND ((orders.dentist_id = auth.uid()) OR (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text]))))))))
);

DROP POLICY IF EXISTS "Lab can insert order history, dentists can insert for own" ON public.order_history;
CREATE POLICY "Lab can insert order history, dentists can insert for own" ON public.order_history FOR INSERT WITH CHECK (
  EXISTS ( SELECT 1 FROM orders WHERE ((orders.id = order_history.order_id) AND ((orders.dentist_id = auth.uid()) OR (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text]))))))))
);

DROP POLICY IF EXISTS "Lab users can update profiles." ON public.profiles;
CREATE POLICY "Lab users can update profiles." ON public.profiles FOR UPDATE USING (
  (( SELECT profiles_1.role FROM profiles profiles_1 WHERE (profiles_1.id = auth.uid())) = ANY (ARRAY['admin'::text, 'master'::text, 'receptionist'::text, 'technical_assistant'::text, 'financial'::text, 'relationship_manager'::text]))
);

