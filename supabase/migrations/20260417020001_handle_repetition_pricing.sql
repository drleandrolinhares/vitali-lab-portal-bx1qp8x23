-- Make sure the cost tracking logic is securely locked via database trigger
-- If a repetition is inserted from the client, we zero its base_price so the dentist
-- is never mistakenly charged, and we capture the repetition context properly.

CREATE OR REPLACE FUNCTION public.handle_order_repetition()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Trigger specifically runs BEFORE INSERT OR UPDATE ON orders
  IF NEW.is_repetition = true THEN
    -- Ensure the base_price is permanently zeroed out for the dentist's invoice
    NEW.base_price := 0;
    
    -- Ensure it's captured in dre_category as "Prejuízo" or similar so it doesn't inflate revenue
    -- Since the base price is 0, it doesn't inflate revenue anyway, but setting category helps tracking
    NEW.dre_category := 'Custo Operacional';
    
    -- If description isn't set yet, label it
    IF NEW.custo_adicional_descricao IS NULL OR NEW.custo_adicional_descricao = '' THEN
      NEW.custo_adicional_descricao := 'REPETIÇÃO';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_handle_order_repetition ON public.orders;
CREATE TRIGGER trg_handle_order_repetition
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_repetition();
