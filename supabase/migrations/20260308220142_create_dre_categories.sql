CREATE TABLE IF NOT EXISTS public.dre_categories (
    name TEXT PRIMARY KEY,
    category_type TEXT NOT NULL DEFAULT 'fixed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clean up existing data just in case
UPDATE public.expenses SET dre_category = TRIM(dre_category) WHERE dre_category IS NOT NULL;
UPDATE public.orders SET dre_category = TRIM(dre_category) WHERE dre_category IS NOT NULL;

-- Default missing values before applying FK
UPDATE public.expenses SET dre_category = 'Outros' WHERE dre_category IS NULL OR dre_category = '';
UPDATE public.orders SET dre_category = 'Receita' WHERE dre_category IS NULL OR dre_category = '';

-- Insert default mappings
INSERT INTO public.dre_categories (name, category_type) VALUES
('Material de Laboratório', 'variable'),
('Pessoal', 'fixed'),
('Despesa Administrativa', 'fixed'),
('Impostos', 'fixed'),
('Receita', 'revenue'),
('Outros', 'fixed')
ON CONFLICT (name) DO UPDATE SET category_type = EXCLUDED.category_type;

-- Catch any custom categories already in use and map them safely
INSERT INTO public.dre_categories (name, category_type)
SELECT DISTINCT dre_category, 'fixed' FROM public.expenses 
WHERE dre_category IS NOT NULL AND dre_category != ''
ON CONFLICT DO NOTHING;

INSERT INTO public.dre_categories (name, category_type)
SELECT DISTINCT dre_category, 'revenue' FROM public.orders 
WHERE dre_category IS NOT NULL AND dre_category != ''
ON CONFLICT DO NOTHING;

-- Apply Foreign Keys with CASCADE to automatically update expenses and orders on rename
ALTER TABLE public.expenses
DROP CONSTRAINT IF EXISTS expenses_dre_category_fkey;

ALTER TABLE public.expenses
ADD CONSTRAINT expenses_dre_category_fkey
FOREIGN KEY (dre_category) REFERENCES public.dre_categories(name) ON UPDATE CASCADE;

ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_dre_category_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_dre_category_fkey
FOREIGN KEY (dre_category) REFERENCES public.dre_categories(name) ON UPDATE CASCADE;

-- Security Policies
ALTER TABLE public.dre_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read dre_categories" ON public.dre_categories 
FOR SELECT USING (true);

CREATE POLICY "Admin write dre_categories" ON public.dre_categories 
FOR ALL USING (
    EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' )
);
