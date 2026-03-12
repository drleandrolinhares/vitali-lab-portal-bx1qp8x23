CREATE OR REPLACE FUNCTION public.get_public_order_guide(target_order_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'friendly_id', o.friendly_id,
    'patient_name', o.patient_name,
    'dentist_name', p.name
  )
  INTO result
  FROM public.orders o
  LEFT JOIN public.profiles p ON o.dentist_id = p.id
  WHERE o.id = target_order_id;
  
  RETURN result;
END;
$$;
