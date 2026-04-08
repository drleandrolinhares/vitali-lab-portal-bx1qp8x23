-- Drop the policy that was potentially causing 0 rows to return due to function execution issues
DROP POLICY IF EXISTS "Dentists can view own orders, lab can view all" ON public.orders;

-- Create a simplified, bulletproof policy without relying on external SECURITY DEFINER functions
CREATE POLICY "Dentists can view own orders, lab can view all" ON public.orders
FOR SELECT TO authenticated
USING (
  dentist_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'master', 'receptionist', 'technical_assistant', 'financial', 'relationship_manager')
  )
);
