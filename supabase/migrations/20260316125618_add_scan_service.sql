CREATE TABLE scan_service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id UUID REFERENCES profiles(id) NOT NULL,
  patient_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scan_service_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_available BOOLEAN DEFAULT true,
  start_time TIME DEFAULT '08:00',
  end_time TIME DEFAULT '18:00',
  slot_duration_minutes INTEGER DEFAULT 60
);

-- Insert default settings
INSERT INTO scan_service_settings (day_of_week, is_available, start_time, end_time, slot_duration_minutes) VALUES
(0, false, '08:00', '18:00', 60), -- Sunday
(1, true, '08:00', '18:00', 60), -- Monday
(2, true, '08:00', '18:00', 60),
(3, true, '08:00', '18:00', 60),
(4, true, '08:00', '18:00', 60),
(5, true, '08:00', '18:00', 60),
(6, false, '08:00', '12:00', 60); -- Saturday

ALTER TABLE scan_service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_service_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scan_service_bookings
CREATE POLICY "Admin and staff can do all on scan bookings" ON scan_service_bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
    )
  );

CREATE POLICY "Authenticated users can select all scan bookings" ON scan_service_bookings
  FOR SELECT USING (true);

CREATE POLICY "Dentists can insert their own bookings" ON scan_service_bookings
  FOR INSERT WITH CHECK (
    dentist_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
    )
  );

CREATE POLICY "Dentists can update their own bookings" ON scan_service_bookings
  FOR UPDATE USING (
    dentist_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
    )
  );

CREATE POLICY "Dentists can delete their own bookings" ON scan_service_bookings
  FOR DELETE USING (
    dentist_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
    )
  );

-- RLS Policies for scan_service_settings
CREATE POLICY "Admin and master can update scan settings" ON scan_service_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master')
    )
  );

CREATE POLICY "Authenticated users can select scan settings" ON scan_service_settings
  FOR SELECT USING (true);
