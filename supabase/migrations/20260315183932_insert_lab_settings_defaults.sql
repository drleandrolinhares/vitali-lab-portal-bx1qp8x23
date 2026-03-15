INSERT INTO public.app_settings (key, value) VALUES
('lab_razao_social', ''),
('lab_cnpj', ''),
('lab_address', ''),
('lab_phone', ''),
('lab_email', ''),
('lab_website', ''),
('lab_instagram', ''),
('lab_pix_key', '')
ON CONFLICT (key) DO NOTHING;
