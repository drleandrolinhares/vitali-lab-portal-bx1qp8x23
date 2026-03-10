ALTER TABLE public.price_list
ADD COLUMN IF NOT EXISTS execution_time NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS cadista_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS material_cost NUMERIC DEFAULT 0;

-- Ensure global settings exist
INSERT INTO public.app_settings (key, value) VALUES
('global_card_fee', '0'),
('global_commission', '0'),
('global_inadimplency', '0'),
('global_taxes', '0')
ON CONFLICT (key) DO NOTHING;
