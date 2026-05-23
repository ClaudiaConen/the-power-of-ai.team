/*
  # Grant EXECUTE on public.is_admin() to authenticated role

  1. Problem
    - RLS policies on contact_submissions (and any future table) call
      public.is_admin() from the `authenticated` Postgres role.
    - EXECUTE on is_admin() was previously only granted to `postgres`
      and `service_role`, causing: `permission denied for function is_admin`.
    - Result: admins saw an empty / error state in the dashboard.

  2. Change
    - GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated
    - REVOKE EXECUTE from anon and PUBLIC to keep the surface minimal
    - Function remains SECURITY DEFINER with a fixed search_path, so the
      caller only gains the ability to check their own admin status.

  3. Notes
    - Safe & idempotent. Only function privileges are touched; no data
      is modified and no policies are changed.
    - Triggers a PostgREST schema reload so the change is picked up
      immediately by the HTTP API.
*/

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

NOTIFY pgrst, 'reload schema';
