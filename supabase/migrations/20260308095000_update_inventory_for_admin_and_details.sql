-- Add new columns for enhanced product registration
ALTER TABLE public.inventory_items
ADD COLUMN last_purchase_brand TEXT,
ADD COLUMN last_purchase_value NUMERIC,
ADD COLUMN observations TEXT;

-- Tighten the deletion policy to strictly 'admin' roles, as requested
DROP POLICY IF EXISTS "Admin/Reception delete inventory_items" ON public.inventory_items;

CREATE POLICY "Admin delete inventory_items" ON public.inventory_items
FOR DELETE TO public USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
