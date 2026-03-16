-- Substituir política antiga para permitir a exclusão de pedidos por administradores e master
DROP POLICY IF EXISTS "Admin can delete orders" ON public.orders;

CREATE POLICY "Admin can delete orders" ON public.orders
FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'master'))
);
