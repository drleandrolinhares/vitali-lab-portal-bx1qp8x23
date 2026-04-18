ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS authorized_kanban_stages jsonb DEFAULT NULL;
