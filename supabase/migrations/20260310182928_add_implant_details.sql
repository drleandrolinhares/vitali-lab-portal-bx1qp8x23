ALTER TABLE public.price_list ADD COLUMN estrutura_fixacao TEXT NOT NULL DEFAULT 'SOBRE DENTE';

ALTER TABLE public.orders ADD COLUMN implant_brand TEXT;
ALTER TABLE public.orders ADD COLUMN implant_type TEXT;

