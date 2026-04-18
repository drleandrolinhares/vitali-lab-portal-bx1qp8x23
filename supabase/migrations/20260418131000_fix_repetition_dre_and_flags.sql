DO $$
BEGIN
  -- Insert missing DRE categories if needed to avoid foreign key constraints errors
  INSERT INTO public.dre_categories (name, category_type) VALUES ('Receita', 'variable') ON CONFLICT (name) DO NOTHING;
  INSERT INTO public.dre_categories (name, category_type) VALUES ('Custo Operacional', 'fixed') ON CONFLICT (name) DO NOTHING;

  -- Retroactively fix is_repetition for past orders
  UPDATE public.orders
  SET is_repetition = true
  WHERE is_repetition IS NOT TRUE 
    AND (
      observations ILIKE '%erro do dentista%'
      OR observations ILIKE '%erro do laborat_rio%'
      OR observations ILIKE '%erro do laboratorio%'
      OR observations ILIKE '%repeti__o%'
      OR observations ILIKE '%repeticao%'
      OR custo_adicional_descricao ILIKE '%erro do dentista%'
      OR custo_adicional_descricao ILIKE '%erro do laborat_rio%'
      OR custo_adicional_descricao ILIKE '%erro do laboratorio%'
      OR custo_adicional_descricao ILIKE '%repeti__o%'
      OR custo_adicional_descricao ILIKE '%repeticao%'
    );
END $$;
