ALTER TABLE public.inventory_items
ADD COLUMN IF NOT EXISTS items_per_box NUMERIC DEFAULT 1,
ADD COLUMN IF NOT EXISTS packaging_types JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.inventory_items ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;
ALTER TABLE public.inventory_transactions ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;

UPDATE public.inventory_items
SET packaging_types = jsonb_build_array(packaging_type)
WHERE packaging_type IS NOT NULL AND packaging_type <> '' AND (packaging_types IS NULL OR packaging_types = '[]'::jsonb);
