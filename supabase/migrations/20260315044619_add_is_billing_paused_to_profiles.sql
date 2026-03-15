ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_billing_paused BOOLEAN NOT NULL DEFAULT false;
