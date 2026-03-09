-- Drop the existing restricted INSERT policy
DROP POLICY IF EXISTS "Dentists can insert own orders" ON public.orders;

-- Create a more robust policy that allows dentists to insert their own orders
-- and allows lab staff (admin, receptionist) to insert orders for dentists.
CREATE POLICY "Dentists can insert own orders" 
  ON public.orders 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    dentist_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'receptionist')
    )
  );
