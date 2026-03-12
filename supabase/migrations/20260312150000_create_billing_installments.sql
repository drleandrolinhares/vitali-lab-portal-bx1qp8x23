CREATE TABLE IF NOT EXISTS public.billing_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dentist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    total_amount NUMERIC NOT NULL,
    installment_value NUMERIC NOT NULL,
    total_installments INTEGER NOT NULL,
    remaining_installments INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin access billing_installments" 
ON public.billing_installments 
FOR ALL 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'master', 'receptionist', 'financial')
  )
);

CREATE POLICY "Dentist read own billing_installments" 
ON public.billing_installments 
FOR SELECT 
TO public 
USING (dentist_id = auth.uid());
