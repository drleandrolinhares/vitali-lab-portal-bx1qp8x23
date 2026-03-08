ALTER TABLE public.inventory_items
ADD COLUMN minimum_stock_level NUMERIC NOT NULL DEFAULT 0;
