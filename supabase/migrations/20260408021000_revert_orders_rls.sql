-- Reverter para a política RLS segura anterior, removendo a leitura direta do JWT
-- que estava causando erros de conversão JSONB e retornando 0 registros.
DROP POLICY IF EXISTS "Dentists can view own orders, lab can view all" ON public.orders;

CREATE POLICY "Dentists can view own orders, lab can view all" ON public.orders
FOR SELECT TO public
USING (
  public.is_current_user_active() AND (
    (dentist_id = auth.uid()) OR 
    (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
    ))
  )
);
