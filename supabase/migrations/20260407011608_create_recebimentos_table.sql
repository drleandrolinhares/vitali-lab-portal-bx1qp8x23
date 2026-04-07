CREATE TABLE IF NOT EXISTS public.recebimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_recebimento DATE NOT NULL,
  valor_recebido NUMERIC NOT NULL DEFAULT 0,
  numero_caso TEXT,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP POLICY IF EXISTS "Admin recebimentos all" ON public.recebimentos;
CREATE POLICY "Admin recebimentos all" ON public.recebimentos
  FOR ALL TO public
  USING (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'master'::text, 'financial'::text])))));

DROP POLICY IF EXISTS "Public read recebimentos" ON public.recebimentos;
CREATE POLICY "Public read recebimentos" ON public.recebimentos
  FOR SELECT TO public USING (true);

ALTER TABLE public.recebimentos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  INSERT INTO public.recebimentos (id, data_recebimento, valor_recebido, numero_caso, descricao)
  VALUES 
    ('11111111-1111-1111-1111-111111111111'::uuid, CURRENT_DATE - INTERVAL '10 days', 1500.00, 'CASO-001', 'Recebimento referente ao mês atual - Clínica A'),
    ('22222222-2222-2222-2222-222222222222'::uuid, CURRENT_DATE - INTERVAL '5 days', 2500.00, 'CASO-002', 'Recebimento referente ao mês atual - Clínica B'),
    ('33333333-3333-3333-3333-333333333333'::uuid, CURRENT_DATE - INTERVAL '1 month', 3000.00, 'CASO-003', 'Recebimento referente ao mês anterior - Clínica C'),
    ('44444444-4444-4444-4444-444444444444'::uuid, CURRENT_DATE, 1800.00, 'CASO-004', 'Recebimento hoje - Clínica D')
  ON CONFLICT (id) DO NOTHING;
END $$;
