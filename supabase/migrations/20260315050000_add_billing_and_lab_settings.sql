ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_billing_paused BOOLEAN NOT NULL DEFAULT false;

INSERT INTO public.app_settings (key, value) VALUES
('lab_razao_social', ''),
('lab_cnpj', ''),
('lab_address', ''),
('lab_phone', ''),
('lab_email', ''),
('lab_instagram', ''),
('lab_logo_url', '')
ON CONFLICT (key) DO NOTHING;
