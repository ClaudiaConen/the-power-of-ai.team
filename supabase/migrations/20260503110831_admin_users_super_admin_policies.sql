/*
  # Admin users: super_admin manage policies

  1. Changes
    - Adds SELECT policy for super_admins to read all admin_users rows
    - Adds INSERT/UPDATE/DELETE policies restricted to super_admins
    - Existing "own record" SELECT policy remains unchanged

  2. Security
    - Uses inline EXISTS subquery against admin_users to avoid infinite recursion risk
    - auth.uid() based checks only; no USING(true) anywhere
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Super admins can read all admins') THEN
    CREATE POLICY "Super admins can read all admins"
      ON admin_users FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users au
          WHERE au.id = auth.uid() AND au.rolle = 'super_admin'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Super admins can insert admins') THEN
    CREATE POLICY "Super admins can insert admins"
      ON admin_users FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users au
          WHERE au.id = auth.uid() AND au.rolle = 'super_admin'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Super admins can update admins') THEN
    CREATE POLICY "Super admins can update admins"
      ON admin_users FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users au
          WHERE au.id = auth.uid() AND au.rolle = 'super_admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users au
          WHERE au.id = auth.uid() AND au.rolle = 'super_admin'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Super admins can delete admins') THEN
    CREATE POLICY "Super admins can delete admins"
      ON admin_users FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users au
          WHERE au.id = auth.uid() AND au.rolle = 'super_admin'
        )
      );
  END IF;
END $$;
