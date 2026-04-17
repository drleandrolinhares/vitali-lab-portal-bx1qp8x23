-- Atualiza a trigger de repetição de pedidos para permitir cobrança de 50% em caso de erro do dentista

CREATE OR REPLACE FUNCTION public.handle_order_repetition()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
  -- A trigger roda BEFORE INSERT ou UPDATE em orders
  IF NEW.is_repetition = true THEN
    
    -- Verifica a causa da repetição com base na descrição para aplicar a regra financeira
    IF NEW.custo_adicional_descricao LIKE '%Erro do Dentista%' THEN
      -- Erro do dentista: permite que o valor base_price enviado pelo client (50%) seja mantido
      -- O registro financeiro é contabilizado como Receita
      NEW.dre_category := 'Receita';
    ELSE
      -- Erro do laboratório: garante que o base_price seja zerado e não gere custo ao dentista
      NEW.base_price := 0;
      NEW.dre_category := 'Custo Operacional';
    END IF;

    -- Caso a descrição esteja vazia, define um fallback padrão
    IF NEW.custo_adicional_descricao IS NULL OR NEW.custo_adicional_descricao = '' THEN
      NEW.custo_adicional_descricao := 'REPETIÇÃO';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
