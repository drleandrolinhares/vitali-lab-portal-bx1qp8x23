CREATE TABLE price_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  work_type TEXT NOT NULL,
  price TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE price_list ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public price_list view" ON price_list FOR SELECT TO public USING (true);

CREATE POLICY "Admin price_list insert" ON price_list FOR INSERT TO public WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin price_list update" ON price_list FOR UPDATE TO public USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin price_list delete" ON price_list FOR DELETE TO public USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Seed Data
DO $$
BEGIN
  INSERT INTO price_list (category, work_type, price, notes) VALUES
  ('Soluções Cerâmicas', 'Coroa Emax', 'R$ 350,00', 'Inclui maquiagem e textura'),
  ('Soluções Cerâmicas', 'Lente de Contato', 'R$ 400,00', 'Mínimo de 4 elementos'),
  ('Soluções Cerâmicas', 'Inlay/Onlay', 'R$ 300,00', 'Cerâmica vítrea'),
  ('Studio Acrílico', 'Prótese Total', 'R$ 450,00', 'Dentes Premium Importados'),
  ('Studio Acrílico', 'Placa de Bruxismo', 'R$ 150,00', 'Acrílico incolor rígido'),
  ('Studio Acrílico', 'Prótese Parcial Removível (PPR)', 'R$ 550,00', 'Armação metálica inclusa');
END $$;
