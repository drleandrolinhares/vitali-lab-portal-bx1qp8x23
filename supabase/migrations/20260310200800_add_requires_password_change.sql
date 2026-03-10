ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN NOT NULL DEFAULT false;
