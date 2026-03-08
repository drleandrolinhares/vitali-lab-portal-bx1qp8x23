-- Adicionar política para permitir a exclusão de pedidos por administradores
CREATE POLICY "Admin can delete orders" ON public.orders
FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
