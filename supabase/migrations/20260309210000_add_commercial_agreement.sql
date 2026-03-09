ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS commercial_agreement numeric NOT NULL DEFAULT 0;
