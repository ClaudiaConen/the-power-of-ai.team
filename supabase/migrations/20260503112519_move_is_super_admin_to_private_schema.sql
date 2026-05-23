/*
  # Hide is_super_admin from PostgREST

  1. Changes
    - Creates `private` schema (not exposed via PostgREST)
    - Moves is_super_admin() there as SECURITY DEFINER
    - Rewrites admin_users policies to reference private.is_super_admin()
    - Drops the public.is_super_admin() function so it cannot be called via /rest/v1/rpc

  2. Security
    - SECURITY DEFINER is preserved (needed to bypass RLS on admin_users during policy check)
    - Only authenticated role may EXECUTE; function is unreachable from the REST API
    - search_path pinned; PUBLIC + anon revoked
*/

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.is_super_admin()
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

REVOKE ALL ON FUNCTION private.is_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_super_admin() TO authenticated;

DROP POLICY IF EXISTS "Super admins can read all admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can insert admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can update admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can delete admins" ON admin_users;

CREATE POLICY "Super admins can read all admins"
  ON admin_users FOR SELECT
  TO authenticated
  USING (private.is_super_admin());

CREATE POLICY "Super admins can insert admins"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (private.is_super_admin());

CREATE POLICY "Super admins can update admins"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (private.is_super_admin())
  WITH CHECK (private.is_super_admin());

CREATE POLICY "Super admins can delete admins"
  ON admin_users FOR DELETE
  TO authenticated
  USING (private.is_super_admin());

DROP FUNCTION IF EXISTS public.is_super_admin();
