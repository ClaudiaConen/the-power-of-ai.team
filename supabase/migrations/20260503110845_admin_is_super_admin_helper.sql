/*
  # is_super_admin helper + refactor policies

  1. Changes
    - Creates SECURITY DEFINER function is_super_admin() that bypasses RLS
    - Replaces self-referencing EXISTS policies on admin_users with function call

  2. Security
    - Function has search_path pinned, returns boolean, not executable by anon/public
    - Prevents infinite recursion in RLS evaluation
*/

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND rolle = 'super_admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

DROP POLICY IF EXISTS "Super admins can read all admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can insert admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can update admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can delete admins" ON admin_users;

CREATE POLICY "Super admins can read all admins"
  ON admin_users FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "Super admins can insert admins"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can update admins"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can delete admins"
  ON admin_users FOR DELETE
  TO authenticated
  USING (public.is_super_admin());
