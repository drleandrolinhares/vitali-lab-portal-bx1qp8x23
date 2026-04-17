DO $$
DECLARE
  v_sector text;
  v_stage record;
  v_index int;
BEGIN
  FOR v_sector IN SELECT DISTINCT sector FROM public.kanban_stages LOOP
    v_index := 1;
    
    -- Atualiza todas as etapas exceto "PRONTOS PARA ENVIO" e "FINALIZADOS E ENTREGUES"
    FOR v_stage IN 
      SELECT id FROM public.kanban_stages 
      WHERE sector = v_sector 
        AND upper(name) NOT LIKE '%FINALIZADO%' 
        AND upper(name) NOT LIKE '%ENTREGUE%'
        AND NOT (upper(name) LIKE '%PRONTO%' AND upper(name) LIKE '%ENVIO%')
      ORDER BY order_index ASC
    LOOP
      UPDATE public.kanban_stages SET order_index = v_index WHERE id = v_stage.id;
      v_index := v_index + 1;
    END LOOP;
    
    -- Atualiza "PRONTOS PARA ENVIO" para ser o penúltimo
    FOR v_stage IN 
      SELECT id FROM public.kanban_stages 
      WHERE sector = v_sector 
        AND (upper(name) LIKE '%PRONTO%' AND upper(name) LIKE '%ENVIO%')
      ORDER BY order_index ASC
    LOOP
      UPDATE public.kanban_stages SET order_index = v_index WHERE id = v_stage.id;
      v_index := v_index + 1;
    END LOOP;
    
    -- Atualiza "FINALIZADOS E ENTREGUES" para ser o último
    FOR v_stage IN 
      SELECT id FROM public.kanban_stages 
      WHERE sector = v_sector 
        AND (upper(name) LIKE '%FINALIZADO%' OR upper(name) LIKE '%ENTREGUE%')
      ORDER BY order_index ASC
    LOOP
      UPDATE public.kanban_stages SET order_index = v_index WHERE id = v_stage.id;
      v_index := v_index + 1;
    END LOOP;
    
  END LOOP;
END $$;
