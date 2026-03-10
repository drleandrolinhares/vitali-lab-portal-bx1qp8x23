CREATE TABLE IF NOT EXISTS public.billing_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dentist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    month TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(dentist_id, month)
);

ALTER TABLE public.billing_controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin access billing_controls" 
ON public.billing_controls 
FOR ALL 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'receptionist')
  )
);

CREATE POLICY "Public read billing_controls" 
ON public.billing_controls 
FOR SELECT 
TO public 
USING (true);
