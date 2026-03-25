-- Fix infinite recursion in profiles policies
-- 
-- The previous policies used subqueries like `(SELECT role FROM public.profiles WHERE id = auth.uid())`
-- which can cause infinite recursion when queried from other tables (like expenses).
-- Using a SECURITY DEFINER function bypasses RLS and prevents recursion.

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;

-- Drop existing recursive policies
DROP POLICY IF EXISTS "Profiles are viewable by authorized users." ON public.profiles;
DROP POLICY IF EXISTS "Admin can update any profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Recreate SELECT policy
CREATE POLICY "Profiles are viewable by authorized users." ON public.profiles
  FOR SELECT TO authenticated
  USING (
    auth.uid() = id
    OR public.get_current_user_role() IN ('admin', 'master')
    OR (
      public.get_current_user_role() IN ('receptionist', 'technical_assistant', 'financial', 'relationship_manager')
      AND role IN ('dentist', 'laboratory')
    )
  );

-- Recreate UPDATE policies
CREATE POLICY "Admin can update any profile." ON public.profiles
  FOR UPDATE
  USING (
    public.get_current_user_role() IN ('admin', 'master')
  );

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = public.get_current_user_role()
  );
