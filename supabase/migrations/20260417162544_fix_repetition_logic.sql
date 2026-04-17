-- Update the trigger function to auto-detect repetitions based on text
CREATE OR REPLACE FUNCTION public.handle_order_repetition()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Detect repetition based on text fields if flag is not set
  IF (NEW.is_repetition IS NULL OR NEW.is_repetition = false) THEN
    IF NEW.observations ILIKE '%erro do dentista%'
       OR NEW.observations ILIKE '%erro do laborat_rio%'
       OR NEW.observations ILIKE '%erro do laboratorio%'
       OR NEW.observations ILIKE '%repeti__o%'
       OR NEW.observations ILIKE '%repeticao%'
       OR NEW.custo_adicional_descricao ILIKE '%erro do dentista%'
       OR NEW.custo_adicional_descricao ILIKE '%erro do laborat_rio%'
       OR NEW.custo_adicional_descricao ILIKE '%erro do laboratorio%'
       OR NEW.custo_adicional_descricao ILIKE '%repeti__o%'
       OR NEW.custo_adicional_descricao ILIKE '%repeticao%' THEN
       
       NEW.is_repetition := true;
    END IF;
  END IF;

  -- Run logic for repetitions
  IF NEW.is_repetition = true THEN
    IF NEW.custo_adicional_descricao ILIKE '%Erro do Dentista%' OR NEW.observations ILIKE '%Erro do Dentista%' THEN
      NEW.dre_category := 'Receita';
    ELSE
      NEW.base_price := 0;
      NEW.dre_category := 'Custo Operacional';
    END IF;

    IF NEW.custo_adicional_descricao IS NULL OR NEW.custo_adicional_descricao = '' THEN
      NEW.custo_adicional_descricao := 'REPETIÇÃO';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- Update existing orders that were missed
DO $$
BEGIN
  UPDATE public.orders
  SET is_repetition = true
  WHERE (is_repetition IS NULL OR is_repetition = false)
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
