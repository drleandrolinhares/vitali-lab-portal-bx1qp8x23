DO $$
DECLARE
  v_acab_maq_id uuid;
  v_acab_maq_index int;
  v_sector text;
  v_old_name text;
BEGIN
  -- Procure pelo estágio existente (ex: "ACABAMENTO MAQUIAGEM")
  FOR v_acab_maq_id, v_acab_maq_index, v_sector, v_old_name IN 
    SELECT id, order_index, sector, name FROM public.kanban_stages 
    WHERE name ILIKE '%ACABAMENTO%MAQUIAGEM%'
  LOOP
    -- 1. Deslocar as etapas subsequentes para frente (+1) para abrir espaço
    UPDATE public.kanban_stages 
    SET order_index = order_index + 1 
    WHERE sector = v_sector AND order_index > v_acab_maq_index;
    
    -- 2. Inserir a nova etapa 'MAQUIAGEM' imediatamente à direita
    INSERT INTO public.kanban_stages (name, order_index, sector)
    VALUES ('MAQUIAGEM', v_acab_maq_index + 1, v_sector);
    
    -- 3. Renomear a etapa atual para 'ACABAMENTO'
    UPDATE public.kanban_stages 
    SET name = 'ACABAMENTO' 
    WHERE id = v_acab_maq_id;

    -- 4. Atualizar os pedidos que estavam na etapa antiga para usar o novo nome
    UPDATE public.orders
    SET kanban_stage = 'ACABAMENTO'
    WHERE sector = v_sector AND kanban_stage = v_old_name;
  END LOOP;
END $$;
