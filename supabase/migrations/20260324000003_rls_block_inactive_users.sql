-- Fix #1: Usuários com is_active = false bloqueiam apenas no frontend.
-- Com JWT válido, o acesso direto à API ainda funcionava.
--
-- Correção: função SECURITY DEFINER que verifica is_active e é referenciada
-- nas principais policies de dados (orders, order_history).

-- Função helper: verifica se o usuário autenticado atual está ativo.
-- SECURITY DEFINER ignora RLS ao consultar profiles, evitando recursão.
CREATE OR REPLACE FUNCTION public.is_current_user_active()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_active FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_current_user_active() TO authenticated;

-- ── orders ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Dentists can view own orders, lab can view all" ON public.orders;
CREATE POLICY "Dentists can view own orders, lab can view all" ON public.orders
  FOR SELECT USING (
    public.is_current_user_active()
    AND (
      dentist_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = ANY(ARRAY['admin','master','receptionist','technical_assistant','financial','relationship_manager'])
      )
    )
  );

DROP POLICY IF EXISTS "Lab can update all orders, dentists can update own" ON public.orders;
CREATE POLICY "Lab can update all orders, dentists can update own" ON public.orders
  FOR UPDATE USING (
    public.is_current_user_active()
    AND (
      dentist_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = ANY(ARRAY['admin','master','receptionist','technical_assistant','financial','relationship_manager'])
      )
    )
  );

-- ── order_history ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Dentists can view own order history, lab can view all" ON public.order_history;
CREATE POLICY "Dentists can view own order history, lab can view all" ON public.order_history
  FOR SELECT USING (
    public.is_current_user_active()
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_history.order_id
        AND (
          orders.dentist_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND role = ANY(ARRAY['admin','master','receptionist','technical_assistant','financial','relationship_manager'])
          )
        )
    )
  );

DROP POLICY IF EXISTS "Lab can insert order history, dentists can insert for own" ON public.order_history;
CREATE POLICY "Lab can insert order history, dentists can insert for own" ON public.order_history
  FOR INSERT WITH CHECK (
    public.is_current_user_active()
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_history.order_id
        AND (
          orders.dentist_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND role = ANY(ARRAY['admin','master','receptionist','technical_assistant','financial','relationship_manager'])
          )
        )
    )
  );
