CREATE OR REPLACE VIEW public.vw_dentist_financial_summary AS
SELECT 
  p.id as dentist_id,
  (SELECT COUNT(id) FROM public.orders o WHERE o.dentist_id = p.id AND o.status IN ('completed', 'delivered') AND o.settlement_id IS NULL) as ready_to_bill_count,
  (SELECT COALESCE(SUM(base_price), 0) FROM public.orders o WHERE o.dentist_id = p.id AND o.status IN ('completed', 'delivered') AND o.settlement_id IS NULL) as ready_to_bill_amount,
  (SELECT COUNT(id) FROM public.orders o WHERE o.dentist_id = p.id AND o.status NOT IN ('completed', 'delivered', 'cancelled') AND o.settlement_id IS NULL) as in_production_count,
  (SELECT COALESCE(SUM(base_price), 0) FROM public.orders o WHERE o.dentist_id = p.id AND o.status NOT IN ('completed', 'delivered', 'cancelled') AND o.settlement_id IS NULL) as in_production_amount,
  (SELECT COUNT(id) FROM public.settlements s WHERE s.dentist_id = p.id AND s.status = 'pending') as pending_settlements_count,
  (SELECT COALESCE(SUM(amount), 0) FROM public.settlements s WHERE s.dentist_id = p.id AND s.status = 'pending') as pending_settlements_amount
FROM public.profiles p
WHERE p.role IN ('dentist', 'laboratory');

GRANT SELECT ON public.vw_dentist_financial_summary TO authenticated;
