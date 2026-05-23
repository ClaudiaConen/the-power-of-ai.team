/*
  # Allow admins to delete contact submissions

  1. Security Changes
    - Adds a DELETE policy on `contact_submissions` so authenticated
      admins can remove entries from the admin UI.
    - Uses the same inline EXISTS check against `admin_users` as the
      existing SELECT policy (no reliance on `is_admin()` RPC).
    - Anonymous INSERT and admin SELECT policies remain unchanged.

  2. Important Notes
    - Safe to re-run: policy is dropped if present before recreation.
    - Non-admin authenticated users cannot delete anything.
*/

DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions
  FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

NOTIFY pgrst, 'reload schema';
