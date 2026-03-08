-- Add DRE Category to expenses
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS dre_category TEXT NOT NULL DEFAULT 'Outros';

-- Backfill based on existing classification
UPDATE public.expenses 
SET dre_category = 
  CASE 
    WHEN classification = 'Custo Variável' THEN 'Material de Laboratório'
    WHEN classification = 'Custo Fixo' THEN 'Despesa Administrativa'
    ELSE 'Outros'
  END;

-- Add DRE Category to orders (for revenue classification)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS dre_category TEXT NOT NULL DEFAULT 'Receita';
