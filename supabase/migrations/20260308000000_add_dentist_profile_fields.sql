ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS personal_phone TEXT,
ADD COLUMN IF NOT EXISTS clinic_contact_name TEXT,
ADD COLUMN IF NOT EXISTS clinic_contact_role TEXT,
ADD COLUMN IF NOT EXISTS clinic_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_group_link TEXT;
