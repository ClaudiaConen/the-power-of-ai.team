/*
  # Grant admins read access to contact_submissions

  1. Security Changes
    - Adds a SELECT policy on `contact_submissions` so authenticated users
      marked as admins (via `public.is_admin()`) can read all submissions.
    - No new UPDATE/DELETE policies are added; submissions remain
      read-only for admins from the app UI.
    - Anonymous INSERT policy stays unchanged.

  2. Important Notes
    - Uses the existing SECURITY DEFINER helper `public.is_admin()`
      to stay consistent with the speakers/invoices policies.
    - Safe to re-run: policy is dropped if present before recreation.
*/

DROP POLICY IF EXISTS "Admins can read contact submissions" ON contact_submissions;

CREATE POLICY "Admins can read contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

NOTIFY pgrst, 'reload schema';
