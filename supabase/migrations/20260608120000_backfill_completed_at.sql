DO $$
BEGIN
  -- Update orders that are completed but have no completed_at
  -- by fetching the exact date they were completed from order_history
  UPDATE public.orders o
  SET completed_at = COALESCE(
    (
      SELECT MIN(h.created_at)
      FROM public.order_history h
      WHERE h.order_id = o.id
        AND h.status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE')
    ),
    o.created_at
  )
  WHERE o.status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE')
    AND o.completed_at IS NULL;
END $$;
