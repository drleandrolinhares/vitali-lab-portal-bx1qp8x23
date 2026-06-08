DO $$
BEGIN
  -- 1. Backfill completed_at based on latest order_history for finished orders
  UPDATE public.orders o
  SET completed_at = h.created_at
  FROM (
    SELECT order_id, MAX(created_at) as created_at
    FROM public.order_history
    WHERE status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE')
    GROUP BY order_id
  ) h
  WHERE o.id = h.order_id
    AND o.status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE')
    AND (o.completed_at IS NULL OR o.completed_at != h.created_at);

  -- 2. Explicitly set ORD-0071 to 2024-05-25 (Patient: Anilda)
  UPDATE public.orders
  SET completed_at = '2024-05-25 12:00:00+00'::timestamptz
  WHERE friendly_id = 'ORD-0071';

END $$;

-- 3. Update the trigger function to be robust against "re-finalization"
CREATE OR REPLACE FUNCTION public.handle_order_status_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
  -- If status changes to completed/delivered, set completed_at
  IF NEW.status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE') AND (OLD.status NOT IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE') OR OLD.status IS NULL) THEN
    NEW.completed_at := NOW();
  -- If status reverts from completed/delivered to something else, unset completed_at
  ELSIF NEW.status NOT IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE') THEN
    NEW.completed_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;
