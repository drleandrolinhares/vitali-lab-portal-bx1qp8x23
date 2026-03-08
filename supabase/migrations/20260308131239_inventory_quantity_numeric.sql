ALTER TABLE public.inventory_items 
ADD COLUMN IF NOT EXISTS items_per_box NUMERIC DEFAULT 1,
ADD COLUMN IF NOT EXISTS packaging_types TEXT[] DEFAULT '{}'::TEXT[];

ALTER TABLE public.inventory_items ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;
ALTER TABLE public.inventory_transactions ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;
