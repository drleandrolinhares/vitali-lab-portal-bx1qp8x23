CREATE TABLE laboratory_custom_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laboratory_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  price_list_id UUID REFERENCES public.price_list(id) ON DELETE CASCADE NOT NULL,
  custom_price NUMERIC NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(laboratory_id, price_list_id)
);

ALTER TABLE laboratory_custom_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public laboratory_custom_prices view" ON laboratory_custom_prices FOR SELECT TO public USING (true);
CREATE POLICY "Admin laboratory_custom_prices all" ON laboratory_custom_prices FOR ALL TO public USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist', 'financial', 'relationship_manager'))
);

