ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_adjustment_return BOOLEAN DEFAULT false;

CREATE TABLE scan_service_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  block_date DATE,
  recurrence TEXT NOT NULL CHECK (recurrence IN ('unique', 'daily', 'weekly', 'monthly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scan_service_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage blocks" ON scan_service_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master')
    )
  );

CREATE POLICY "Auth read blocks" ON scan_service_blocks
  FOR SELECT USING (auth.role() = 'authenticated');
