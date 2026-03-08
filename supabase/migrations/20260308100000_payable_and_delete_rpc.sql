-- Expenses enhancements
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Geral';
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS classification TEXT;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS purchase_date DATE;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS recurring_day INTEGER;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS installment_current INTEGER;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS installment_total INTEGER;

-- Backfill classification from cost_center if needed
UPDATE public.expenses SET classification = cost_center WHERE classification IS NULL;

-- Function to hard delete a user from auth.users (cascades to profiles)
CREATE OR REPLACE FUNCTION public.delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    DELETE FROM auth.users WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;
END;
$$;

-- Allow cascading deletion of dentists on orders to avoid constraint errors
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_dentist_id_fkey;
ALTER TABLE public.orders ADD CONSTRAINT orders_dentist_id_fkey 
  FOREIGN KEY (dentist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
