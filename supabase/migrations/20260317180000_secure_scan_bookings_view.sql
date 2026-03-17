CREATE OR REPLACE VIEW public.vw_secure_scan_bookings AS
SELECT 
  b.id,
  b.dentist_id,
  b.booking_date,
  b.start_time,
  b.end_time,
  b.status,
  b.created_at,
  CASE 
    WHEN b.dentist_id = auth.uid() THEN b.patient_name
    WHEN EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
    ) THEN b.patient_name
    ELSE 'CONFIDENCIAL'
  END as patient_name,
  CASE 
    WHEN b.dentist_id = auth.uid() THEN b.notes
    WHEN EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
    ) THEN b.notes
    ELSE NULL
  END as notes,
  p.name as dentist_name
FROM public.scan_service_bookings b
LEFT JOIN public.profiles p ON b.dentist_id = p.id;

GRANT SELECT ON public.vw_secure_scan_bookings TO authenticated;
