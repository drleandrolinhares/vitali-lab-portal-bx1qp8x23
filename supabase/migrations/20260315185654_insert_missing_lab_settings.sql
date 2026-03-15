INSERT INTO public.app_settings (key, value) VALUES
('lab_email', ''),
('lab_instagram', ''),
('lab_pix_key', '')
ON CONFLICT (key) DO NOTHING;
