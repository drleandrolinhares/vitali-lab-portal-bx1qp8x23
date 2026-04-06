ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS custo_adicional_descricao text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS custo_adicional_valor numeric DEFAULT 0;
