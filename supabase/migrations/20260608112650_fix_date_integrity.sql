DO $$
BEGIN
  -- 1. Specific Order Correction: ORD-0071
  UPDATE public.orders
  SET completed_at = '2026-05-25 12:00:00+00'::timestamptz
  WHERE friendly_id = 'ORD-0071'
    AND (completed_at IS NULL OR completed_at::date != '2026-05-25'::date);

  -- History Synchronization for ORD-0071
  UPDATE public.order_history
  SET created_at = '2026-05-25 12:00:00+00'::timestamptz
  WHERE order_id = (SELECT id FROM public.orders WHERE friendly_id = 'ORD-0071' LIMIT 1)
    AND status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE')
    AND created_at::date != '2026-05-25'::date;

  -- 2. Data Integrity Sweep: orders.created_at
  UPDATE public.orders
  SET created_at = created_at + make_interval(years := 2026 - extract(year from created_at)::int)
  WHERE created_at < '2026-01-01 00:00:00+00'::timestamptz;

  -- 3. Data Integrity Sweep: orders.completed_at
  UPDATE public.orders
  SET completed_at = completed_at + make_interval(years := 2026 - extract(year from completed_at)::int)
  WHERE completed_at < '2026-01-01 00:00:00+00'::timestamptz;

  -- 4. Data Integrity Sweep: order_history.created_at
  UPDATE public.order_history
  SET created_at = created_at + make_interval(years := 2026 - extract(year from created_at)::int)
  WHERE created_at < '2026-01-01 00:00:00+00'::timestamptz;

END $$;
