CREATE TABLE IF NOT EXISTS public.cadistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cadista_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cadista_id UUID NOT NULL REFERENCES public.cadistas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS cadista_id UUID REFERENCES public.cadistas(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cadista_service_id UUID REFERENCES public.cadista_services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cadista_price NUMERIC;

-- RLS for cadistas
ALTER TABLE public.cadistas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin cadistas all" ON public.cadistas;
CREATE POLICY "Admin cadistas all" ON public.cadistas
  FOR ALL TO public
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master')));

DROP POLICY IF EXISTS "Staff cadistas read" ON public.cadistas;
CREATE POLICY "Staff cadistas read" ON public.cadistas
  FOR SELECT TO public
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')));

-- RLS for cadista_services
ALTER TABLE public.cadista_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin cadista_services all" ON public.cadista_services;
CREATE POLICY "Admin cadista_services all" ON public.cadista_services
  FOR ALL TO public
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master')));

DROP POLICY IF EXISTS "Staff cadista_services read" ON public.cadista_services;
CREATE POLICY "Staff cadista_services read" ON public.cadista_services
  FOR SELECT TO public
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')));
