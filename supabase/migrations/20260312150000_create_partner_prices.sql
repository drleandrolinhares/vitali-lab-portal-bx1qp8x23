CREATE TABLE partner_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  price_list_id UUID NOT NULL REFERENCES public.price_list(id) ON DELETE CASCADE,
  custom_price NUMERIC NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, price_list_id)
);

ALTER TABLE partner_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and master can manage partner prices" ON partner_prices
  FOR ALL TO public
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master'))
  );

CREATE POLICY "Laboratories can read own partner prices" ON partner_prices
  FOR SELECT TO public
  USING (
    partner_id = auth.uid()
  );

