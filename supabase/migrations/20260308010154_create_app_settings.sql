CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public app_settings view" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admin app_settings all" ON public.app_settings USING (
    EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' )
);

INSERT INTO public.app_settings (key, value) VALUES
('whatsapp_group_link', ''),
('whatsapp_lab_link', '')
ON CONFLICT (key) DO NOTHING;
