ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_function TEXT;

UPDATE public.profiles SET role = 'master' WHERE email = 'admin@vitalilab.com';
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"master"') WHERE email = 'admin@vitalilab.com';

INSERT INTO public.app_settings (key, value) VALUES
('role_permissions', '{"admin": ["inbox", "new-request", "kanban", "history", "dashboard", "comparative-dashboard", "finances", "accounts-payable", "inventory", "dentists", "patients", "prices", "settings", "dre-categories", "audit"], "receptionist": ["inbox", "kanban", "new-request", "history", "patients"], "dentist": ["new-request", "kanban", "history"]}')
ON CONFLICT (key) DO NOTHING;

DO $ 
BEGIN
    -- app_settings
    DROP POLICY IF EXISTS "Admin app_settings all" ON app_settings;
    CREATE POLICY "Admin app_settings all" ON app_settings USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );

    -- audit_logs
    DROP POLICY IF EXISTS "Admin select audit logs" ON audit_logs;
    CREATE POLICY "Admin select audit logs" ON audit_logs FOR SELECT TO authenticated USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );

    -- billing_controls
    DROP POLICY IF EXISTS "Admin access billing_controls" ON billing_controls;
    CREATE POLICY "Admin access billing_controls" ON billing_controls USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );

    -- dre_categories
    DROP POLICY IF EXISTS "Admin write dre_categories" ON dre_categories;
    CREATE POLICY "Admin write dre_categories" ON dre_categories USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );

    -- expenses
    DROP POLICY IF EXISTS "Admin/Reception delete expenses" ON expenses;
    CREATE POLICY "Admin/Reception delete expenses" ON expenses FOR DELETE USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Admin/Reception insert expenses" ON expenses;
    CREATE POLICY "Admin/Reception insert expenses" ON expenses FOR INSERT WITH CHECK (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Admin/Reception update expenses" ON expenses;
    CREATE POLICY "Admin/Reception update expenses" ON expenses FOR UPDATE USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Admin/Reception view expenses" ON expenses;
    CREATE POLICY "Admin/Reception view expenses" ON expenses FOR SELECT USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );

    -- inventory_items
    DROP POLICY IF EXISTS "Admin delete inventory_items" ON inventory_items;
    CREATE POLICY "Admin delete inventory_items" ON inventory_items FOR DELETE USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );
    DROP POLICY IF EXISTS "Admin/Reception insert inventory_items" ON inventory_items;
    CREATE POLICY "Admin/Reception insert inventory_items" ON inventory_items FOR INSERT WITH CHECK (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Admin/Reception update inventory_items" ON inventory_items;
    CREATE POLICY "Admin/Reception update inventory_items" ON inventory_items FOR UPDATE USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Admin/Reception view inventory_items" ON inventory_items;
    CREATE POLICY "Admin/Reception view inventory_items" ON inventory_items FOR SELECT USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );

    -- inventory_transactions
    DROP POLICY IF EXISTS "Admin/Reception insert inventory_transactions" ON inventory_transactions;
    CREATE POLICY "Admin/Reception insert inventory_transactions" ON inventory_transactions FOR INSERT WITH CHECK (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Admin/Reception view inventory_transactions" ON inventory_transactions;
    CREATE POLICY "Admin/Reception view inventory_transactions" ON inventory_transactions FOR SELECT USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );

    -- kanban_stages
    DROP POLICY IF EXISTS "Admin kanban_stages all" ON kanban_stages;
    CREATE POLICY "Admin kanban_stages all" ON kanban_stages USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );

    -- order_history
    DROP POLICY IF EXISTS "Dentists can view own order history, lab can view all" ON order_history;
    CREATE POLICY "Dentists can view own order history, lab can view all" ON order_history FOR SELECT USING (
        EXISTS ( SELECT 1 FROM orders WHERE orders.id = order_history.order_id AND (orders.dentist_id = auth.uid() OR EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('receptionist', 'admin', 'master') ) ) )
    );
    DROP POLICY IF EXISTS "Lab can insert order history, dentists can insert for own" ON order_history;
    CREATE POLICY "Lab can insert order history, dentists can insert for own" ON order_history FOR INSERT WITH CHECK (
        EXISTS ( SELECT 1 FROM orders WHERE orders.id = order_history.order_id AND (orders.dentist_id = auth.uid() OR EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('receptionist', 'admin', 'master') ) ) )
    );

    -- orders
    DROP POLICY IF EXISTS "Admin can delete orders" ON orders;
    CREATE POLICY "Admin can delete orders" ON orders FOR DELETE TO authenticated USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );
    DROP POLICY IF EXISTS "Dentists can insert own orders" ON orders;
    CREATE POLICY "Dentists can insert own orders" ON orders FOR INSERT TO authenticated WITH CHECK (
        (dentist_id = auth.uid()) OR EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Dentists can view own orders, lab can view all" ON orders;
    CREATE POLICY "Dentists can view own orders, lab can view all" ON orders FOR SELECT USING (
        (dentist_id = auth.uid()) OR EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Lab can update all orders, dentists can update own" ON orders;
    CREATE POLICY "Lab can update all orders, dentists can update own" ON orders FOR UPDATE USING (
        (dentist_id = auth.uid()) OR EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );

    -- price_list
    DROP POLICY IF EXISTS "Admin price_list delete" ON price_list;
    CREATE POLICY "Admin price_list delete" ON price_list FOR DELETE USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );
    DROP POLICY IF EXISTS "Admin price_list insert" ON price_list;
    CREATE POLICY "Admin price_list insert" ON price_list FOR INSERT WITH CHECK (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );
    DROP POLICY IF EXISTS "Admin price_list update" ON price_list;
    CREATE POLICY "Admin price_list update" ON price_list FOR UPDATE USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );

    -- price_stages
    DROP POLICY IF EXISTS "Admin price_stages delete" ON price_stages;
    CREATE POLICY "Admin price_stages delete" ON price_stages FOR DELETE USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );
    DROP POLICY IF EXISTS "Admin price_stages insert" ON price_stages;
    CREATE POLICY "Admin price_stages insert" ON price_stages FOR INSERT WITH CHECK (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );
    DROP POLICY IF EXISTS "Admin price_stages update" ON price_stages;
    CREATE POLICY "Admin price_stages update" ON price_stages FOR UPDATE USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master') )
    );

    -- profiles
    DROP POLICY IF EXISTS "Lab users can update profiles." ON profiles;
    CREATE POLICY "Lab users can update profiles." ON profiles FOR UPDATE USING (
        ( SELECT profiles_1.role FROM profiles profiles_1 WHERE (profiles_1.id = auth.uid()) ) IN ('admin', 'master', 'receptionist')
    );

    -- settlements
    DROP POLICY IF EXISTS "Admin insert settlements" ON settlements;
    CREATE POLICY "Admin insert settlements" ON settlements FOR INSERT TO authenticated WITH CHECK (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );
    DROP POLICY IF EXISTS "Admin view all settlements, dentists view own" ON settlements;
    CREATE POLICY "Admin view all settlements, dentists view own" ON settlements FOR SELECT TO authenticated USING (
        (dentist_id = auth.uid()) OR EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist') )
    );

END $;


CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'master')
  ) THEN
    DELETE FROM auth.users WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.protect_is_approved()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved THEN
    IF auth.uid() IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'master', 'receptionist')
      ) THEN
        NEW.is_approved = OLD.is_approved;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

