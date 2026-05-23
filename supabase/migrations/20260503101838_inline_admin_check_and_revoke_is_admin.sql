/*
  # Remove RPC attack surface on public.is_admin()

  1. Problem
    - `public.is_admin()` is SECURITY DEFINER and was granted EXECUTE to
      the `authenticated` role so RLS policies could call it.
    - Because PostgREST exposes every function with EXECUTE to
      authenticated as an RPC endpoint, this meant any signed-in user
      could invoke `/rest/v1/rpc/is_admin` directly.
    - While the function itself only returns a boolean about the caller,
      the Supabase security advisor (correctly) flags the pattern of a
      publicly-callable SECURITY DEFINER RPC.

  2. Fix strategy
    - Stop relying on `is_admin()` inside RLS. Rewrite all seven policies
      that referenced it to an inline EXISTS check against `admin_users`.
      The inline check is safe: RLS on `admin_users` already restricts
      rows to `auth.uid() = id`, so the subquery returns a row only for
      the caller's own admin record.
    - REVOKE EXECUTE on `public.is_admin()` from `authenticated`,
      `anon`, and `PUBLIC`. The function is retained (still callable by
      `postgres`/`service_role` for internal jobs) but is no longer
      reachable through PostgREST.

  3. Tables affected (policies rewritten, not data)
    - `speakers`: "Admins can read all speakers", "Admins can update
      speakers", "Admins can delete speakers".
    - `invoices`: "Admins can read invoices", "Admins can insert
      invoices", "Admins can update invoices".
    - `contact_submissions`: "Admins can read contact submissions".

  4. Security properties after migration
    - No authenticated user can invoke `is_admin()` via RPC.
    - Admin-only reads/writes continue to work for real admins through
      the inline EXISTS check.
    - Non-admin authenticated users still see nothing beyond their own
      rows in each table (existing user-scoped policies are untouched).
*/

-- speakers
DROP POLICY IF EXISTS "Admins can read all speakers" ON public.speakers;
CREATE POLICY "Admins can read all speakers"
  ON public.speakers
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update speakers" ON public.speakers;
CREATE POLICY "Admins can update speakers"
  ON public.speakers
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can delete speakers" ON public.speakers;
CREATE POLICY "Admins can delete speakers"
  ON public.speakers
  FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- invoices
DROP POLICY IF EXISTS "Admins can read invoices" ON public.invoices;
CREATE POLICY "Admins can read invoices"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can insert invoices" ON public.invoices;
CREATE POLICY "Admins can insert invoices"
  ON public.invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update invoices" ON public.invoices;
CREATE POLICY "Admins can update invoices"
  ON public.invoices
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- contact_submissions
DROP POLICY IF EXISTS "Admins can read contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can read contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- close the RPC surface
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;

NOTIFY pgrst, 'reload schema';
