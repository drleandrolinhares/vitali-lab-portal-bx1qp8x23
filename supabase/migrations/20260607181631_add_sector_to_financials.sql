-- Add sector to financial tables
ALTER TABLE public.settlements ADD COLUMN IF NOT EXISTS sector text NOT NULL DEFAULT 'SOLUÇÕES CERÂMICAS';
ALTER TABLE public.billing_installments ADD COLUMN IF NOT EXISTS sector text NOT NULL DEFAULT 'SOLUÇÕES CERÂMICAS';
ALTER TABLE public.recebimentos ADD COLUMN IF NOT EXISTS sector text NOT NULL DEFAULT 'SOLUÇÕES CERÂMICAS';

-- Backfill settlements sector based on orders
DO $$
DECLARE
  rec RECORD;
  o_sector text;
BEGIN
  FOR rec IN SELECT id FROM public.settlements LOOP
    SELECT sector INTO o_sector FROM public.orders WHERE settlement_id = rec.id LIMIT 1;
    IF o_sector IS NOT NULL THEN
      UPDATE public.settlements SET sector = o_sector WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;

-- Backfill billing_installments sector based on settlements
DO $$
DECLARE
  rec RECORD;
  s_sector text;
BEGIN
  FOR rec IN SELECT id, settlement_id FROM public.billing_installments WHERE settlement_id IS NOT NULL LOOP
    SELECT sector INTO s_sector FROM public.settlements WHERE id = rec.settlement_id;
    IF s_sector IS NOT NULL THEN
      UPDATE public.billing_installments SET sector = s_sector WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;
