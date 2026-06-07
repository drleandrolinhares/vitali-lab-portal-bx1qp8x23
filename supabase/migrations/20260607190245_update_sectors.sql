DO $$
BEGIN
  -- Data Migration for Unit Correction
  -- Update all historical records where sector is 'SOLUÇÕES CERÂMICAS' to 'STÚDIO ACRÍLICO'
  UPDATE public.billing_installments
  SET sector = 'STÚDIO ACRÍLICO'
  WHERE sector = 'SOLUÇÕES CERÂMICAS';

  UPDATE public.settlements
  SET sector = 'STÚDIO ACRÍLICO'
  WHERE sector = 'SOLUÇÕES CERÂMICAS';
END $$;
