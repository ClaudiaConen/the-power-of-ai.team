/*
  # Fix "Database error querying schema" by using a SECURITY DEFINER helper

  1. Changes
    - Creates `is_admin()` function (SECURITY DEFINER) that checks if the
      current authenticated user exists in admin_users, bypassing RLS
    - Replaces all inline sub-selects to admin_users in RLS policies on
      speakers and invoices with calls to is_admin()
    - This prevents RLS recursion/evaluation issues between admin_users
      policies and policies on other tables that reference admin_users

  2. Affected Policies
    - speakers: SELECT, UPDATE, DELETE policies for admins
    - invoices: SELECT, INSERT, UPDATE policies for admins

  3. Security Notes
    - is_admin() is SECURITY DEFINER with fixed search_path to prevent
      search_path manipulation
    - The function only returns a boolean; it does not expose any data
*/

-- Create the helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$;

-- Recreate speakers policies using is_admin()
DROP POLICY IF EXISTS "Admins can read all speakers" ON speakers;
CREATE POLICY "Admins can read all speakers"
  ON speakers
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update speakers" ON speakers;
CREATE POLICY "Admins can update speakers"
  ON speakers
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete speakers" ON speakers;
CREATE POLICY "Admins can delete speakers"
  ON speakers
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Recreate invoices policies using is_admin()
DROP POLICY IF EXISTS "Admins can read invoices" ON invoices;
CREATE POLICY "Admins can read invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert invoices" ON invoices;
CREATE POLICY "Admins can insert invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update invoices" ON invoices;
CREATE POLICY "Admins can update invoices"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
