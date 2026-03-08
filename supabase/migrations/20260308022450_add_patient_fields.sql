ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS patient_cpf TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS patient_birth_date DATE;
