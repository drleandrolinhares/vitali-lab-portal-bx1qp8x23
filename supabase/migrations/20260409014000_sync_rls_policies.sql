-- Synchronize RLS Policy for 'orders' and related financial tables to match the preview environment
-- Ensuring LEANDRO DE SOUZA GEST MASTER and other authorized roles can view "Trabalhos Concluídos" and "Pipeline de Produção" sem alterar dados.

BEGIN;

-- 1. Sync RLS for orders table
DROP POLICY IF EXISTS "Dentists can view own orders, lab can view all" ON public.orders;

CREATE POLICY "Dentists can view own orders, lab can view all" ON public.orders
FOR SELECT TO authenticated
USING (
  dentist_id = auth.uid() 
  OR 
  created_by = auth.uid()
  OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
  )
);

-- 2. Sync RLS for settlements table (used in financial reports)
DROP POLICY IF EXISTS "Admin view all settlements, dentists view own" ON public.settlements;

CREATE POLICY "Admin view all settlements, dentists view own" ON public.settlements
FOR SELECT TO authenticated
USING (
  dentist_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'master', 'receptionist', 'financial', 'relationship_manager')
  )
);

-- 3. Sync RLS for order_history (ensures pipeline tracks correctly)
DROP POLICY IF EXISTS "Dentists can view own order history, lab can view all" ON public.order_history;

CREATE POLICY "Dentists can view own order history, lab can view all" ON public.order_history
FOR SELECT TO authenticated
USING (
  EXISTS ( 
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_history.order_id 
    AND (
      orders.dentist_id = auth.uid() 
      OR orders.created_by = auth.uid()
      OR EXISTS ( 
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
      )
    )
  )
);

COMMIT;
