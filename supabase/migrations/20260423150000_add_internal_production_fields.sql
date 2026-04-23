DO $$
BEGIN
  ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS maquiagem_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS acabamento_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
END $$;
