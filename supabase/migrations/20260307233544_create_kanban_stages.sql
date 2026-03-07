CREATE TABLE IF NOT EXISTS kanban_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert defaults only if empty
INSERT INTO kanban_stages (name, order_index)
SELECT * FROM (VALUES
  ('TRIAGEM', 1),
  ('PENDÊNCIAS', 2),
  ('CAD DESIGN', 3),
  ('VALIDAÇÃO DENTISTA CAD', 4),
  ('CAD FRESAGEM', 5),
  ('SINTERIZAÇÃO ZIRCÔNIA', 6),
  ('ACABAMENTO MAQUIAGEM', 7),
  ('PRONTO PARA ENVIO', 8)
) AS defaults(name, order_index)
WHERE NOT EXISTS (SELECT 1 FROM kanban_stages);

ALTER TABLE kanban_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public kanban_stages view" ON kanban_stages FOR SELECT USING (true);
CREATE POLICY "Admin kanban_stages all" ON kanban_stages AS PERMISSIVE FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
