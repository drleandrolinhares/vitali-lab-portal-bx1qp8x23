-- Add created_at to profiles if missing to avoid sorting issues
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Add sector for multi-lab financial isolation
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS sector TEXT NOT NULL DEFAULT 'Soluções Cerâmicas';
ALTER TABLE public.price_list ADD COLUMN IF NOT EXISTS sector TEXT NOT NULL DEFAULT 'Soluções Cerâmicas';

-- Add sector and advanced costing logic columns to inventory
ALTER TABLE public.inventory_items ADD COLUMN IF NOT EXISTS sector TEXT NOT NULL DEFAULT 'Soluções Cerâmicas';
ALTER TABLE public.inventory_items ADD COLUMN IF NOT EXISTS purchase_cost NUMERIC DEFAULT 0;
ALTER TABLE public.inventory_items ADD COLUMN IF NOT EXISTS packaging_type TEXT DEFAULT '';
ALTER TABLE public.inventory_items ADD COLUMN IF NOT EXISTS usage_factor NUMERIC DEFAULT 1;
ALTER TABLE public.inventory_items ADD COLUMN IF NOT EXISTS storage_location TEXT DEFAULT '';

