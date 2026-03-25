DO $BODY$ 
BEGIN
  -- Add sector column to kanban_stages to make them independent between labs
  ALTER TABLE public.kanban_stages ADD COLUMN IF NOT EXISTS sector TEXT NOT NULL DEFAULT 'SOLUÇÕES CERÂMICAS';
  
  -- Drop the unique constraint on name if it exists (since names like 'EM TRIAGEM' can be repeated across sectors)
  IF EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'kanban_stages_name_key'
  ) THEN
      ALTER TABLE public.kanban_stages DROP CONSTRAINT kanban_stages_name_key;
  END IF;

  -- Add composite unique constraint for name + sector
  IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'kanban_stages_name_sector_key'
  ) THEN
      ALTER TABLE public.kanban_stages ADD CONSTRAINT kanban_stages_name_sector_key UNIQUE (name, sector);
  END IF;
END $BODY$;

-- Seed the initial default data for Stúdio Acrílico if not present
INSERT INTO public.kanban_stages (name, order_index, sector)
VALUES
  ('TRIAGEM', 1, 'STÚDIO ACRÍLICO'),
  ('PENDÊNCIAS', 2, 'STÚDIO ACRÍLICO'),
  ('PRODUÇÃO', 3, 'STÚDIO ACRÍLICO'),
  ('ACABAMENTO', 4, 'STÚDIO ACRÍLICO'),
  ('PRONTO PARA ENVIO', 5, 'STÚDIO ACRÍLICO')
ON CONFLICT (name, sector) DO NOTHING;
