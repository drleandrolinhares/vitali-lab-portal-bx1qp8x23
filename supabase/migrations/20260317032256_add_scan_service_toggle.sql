INSERT INTO public.app_settings (key, value) VALUES ('scan_service_enabled', 'false') ON CONFLICT (key) DO NOTHING;
