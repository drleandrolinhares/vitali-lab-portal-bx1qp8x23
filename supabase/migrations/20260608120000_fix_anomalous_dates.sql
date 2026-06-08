DO $BODY$
BEGIN
  -- Fix ORD-0071 specifically
  UPDATE public.orders
  SET completed_at = '2026-05-25 12:00:00+00'::timestamptz
  WHERE friendly_id = 'ORD-0071' AND patient_name ILIKE '%Anilda%';

  -- Global date sweep for created_at
  UPDATE public.orders
  SET created_at = created_at + make_interval(years := 2026 - extract(year from created_at)::int)
  WHERE extract(year from created_at) < 2026;
  
  UPDATE public.orders
  SET created_at = '2026-03-01 12:00:00+00'::timestamptz
  WHERE created_at < '2026-03-01 00:00:00+00'::timestamptz;

  -- Global date sweep for completed_at
  UPDATE public.orders
  SET completed_at = completed_at + make_interval(years := 2026 - extract(year from completed_at)::int)
  WHERE completed_at IS NOT NULL AND extract(year from completed_at) < 2026;

  UPDATE public.orders
  SET completed_at = '2026-03-01 12:00:00+00'::timestamptz
  WHERE completed_at IS NOT NULL AND completed_at < '2026-03-01 00:00:00+00'::timestamptz;

END $BODY$;
