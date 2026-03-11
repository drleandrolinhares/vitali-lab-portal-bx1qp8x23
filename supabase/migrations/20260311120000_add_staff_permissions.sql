ALTER TABLE public.profiles ADD COLUMN assigned_dentists JSONB DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN can_move_kanban_cards BOOLEAN DEFAULT true;
