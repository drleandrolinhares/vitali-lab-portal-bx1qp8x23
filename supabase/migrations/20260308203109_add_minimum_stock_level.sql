ALTER TABLE public.inventory_items 
ADD COLUMN IF NOT EXISTS minimum_stock_level numeric DEFAULT 0;
