ALTER TABLE profiles ADD COLUMN closing_date INTEGER;
ALTER TABLE profiles ADD COLUMN payment_due_date INTEGER;

ALTER TABLE orders ADD COLUMN cleared_balance NUMERIC NOT NULL DEFAULT 0;

CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  orders_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin view all settlements, dentists view own" ON settlements
  FOR SELECT TO authenticated USING (
    dentist_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'receptionist'))
  );

CREATE POLICY "Admin insert settlements" ON settlements
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'receptionist'))
  );
