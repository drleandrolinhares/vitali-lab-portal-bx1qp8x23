CREATE TABLE price_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_id UUID NOT NULL REFERENCES price_list(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  kanban_stage TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE price_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public price_stages view" ON price_stages FOR SELECT TO public USING (true);

CREATE POLICY "Admin price_stages insert" ON price_stages FOR INSERT TO public WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin price_stages update" ON price_stages FOR UPDATE TO public USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin price_stages delete" ON price_stages FOR DELETE TO public USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
