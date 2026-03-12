CREATE OR REPLACE FUNCTION public.get_public_order_full_details(target_order_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id', o.id,
    'friendly_id', o.friendly_id,
    'patient_name', o.patient_name,
    'dentist_name', p.name,
    'work_type', o.work_type,
    'material', o.material,
    'implant_brand', o.implant_brand,
    'implant_type', o.implant_type,
    'color_and_considerations', o.color_and_considerations,
    'shipping_method', o.shipping_method,
    'tooth_or_arch', o.tooth_or_arch,
    'observations', o.observations,
    'status', o.status,
    'kanban_stage', o.kanban_stage,
    'created_at', o.created_at,
    'base_price', o.base_price,
    'quantity', GREATEST(1, COALESCE(jsonb_array_length(o.tooth_or_arch->'teeth'), 0) + COALESCE(jsonb_array_length(o.tooth_or_arch->'arches'), 0)),
    'discount', COALESCE(p.commercial_agreement, 0),
    'creator_name', creator.name,
    'history', (
      SELECT COALESCE(json_agg(json_build_object(
        'id', h.id,
        'status', h.status,
        'date', h.created_at,
        'note', h.note
      ) ORDER BY h.created_at DESC), '[]'::json)
      FROM public.order_history h
      WHERE h.order_id = o.id
    ),
    'kanban_stages', (
      SELECT COALESCE(json_agg(json_build_object(
        'id', ks.id,
        'name', ks.name,
        'orderIndex', ks.order_index
      ) ORDER BY ks.order_index ASC), '[]'::json)
      FROM public.kanban_stages ks
    )
  )
  INTO result
  FROM public.orders o
  LEFT JOIN public.profiles p ON o.dentist_id = p.id
  LEFT JOIN public.profiles creator ON o.created_by = creator.id
  WHERE o.id = target_order_id;
  
  RETURN result;
END;
$$;
