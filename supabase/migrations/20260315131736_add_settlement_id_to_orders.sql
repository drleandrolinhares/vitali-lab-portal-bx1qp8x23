ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS settlement_id UUID REFERENCES public.settlements(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_settlement_id ON public.orders(settlement_id);
