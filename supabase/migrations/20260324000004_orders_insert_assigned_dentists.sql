-- Fix #10: Policy de INSERT em orders não validava se o staff tinha acesso ao dentista.
-- Qualquer receptionist/financial podia criar pedidos para qualquer dentista.
--
-- Correção:
--   - Admin/master: sem restrição de dentista alvo.
--   - Dentista/laboratório: apenas para si mesmo (dentist_id = auth.uid()).
--   - Staff: se assigned_dentists estiver preenchido, apenas para dentistas da lista.
--            se assigned_dentists for NULL ou vazio, comportamento anterior é mantido
--            (compatibilidade retroativa para labs sem atribuição configurada).
--
-- Depende de: public.is_current_user_active() criada em 20260324000003.

DROP POLICY IF EXISTS "Dentists can insert own orders" ON public.orders;
CREATE POLICY "Dentists can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (
    public.is_current_user_active()
    AND (
      -- Admin/master: cria pedido para qualquer dentista
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('admin', 'master')
      )
      OR
      -- Dentista/laboratório: apenas para si mesmo
      (
        dentist_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
            AND role IN ('dentist', 'laboratory')
        )
      )
      OR
      -- Staff: se assigned_dentists não estiver configurado, acesso amplo (retrocompat).
      --        se estiver configurado, apenas para dentistas atribuídos.
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('receptionist', 'technical_assistant', 'financial', 'relationship_manager')
          AND (
            assigned_dentists IS NULL
            OR jsonb_typeof(assigned_dentists) != 'array'
            OR jsonb_array_length(assigned_dentists) = 0
            OR assigned_dentists @> jsonb_build_array(dentist_id)
          )
      )
    )
  );
