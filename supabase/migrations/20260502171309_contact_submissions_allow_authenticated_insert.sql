/*
  # Allow authenticated role to insert into contact_submissions

  Problem:
  The existing INSERT policy was scoped to role `anon` only. Visitors who
  happened to have any Supabase session (e.g. a stale admin session in
  another tab, or an upgraded authenticated session) were blocked with
  Postgres error 42501 ("permission denied"), which the ContactForm surfaced
  as "Sicherheitspruefung hat deine Eingabe abgelehnt" — even though their
  input was valid.

  Change:
  1. Drop the existing "Anon can insert valid contact submissions" policy.
  2. Recreate it scoped to both `anon` and `authenticated` with identical
     WITH CHECK validation (name/email/message length, email regex, phone
     length, product length).

  Security:
  - Validation rules remain unchanged; spam protection is preserved.
  - No SELECT/UPDATE/DELETE policies are added for public roles.
*/

DROP POLICY IF EXISTS "Anon can insert valid contact submissions" ON public.contact_submissions;

CREATE POLICY "Public can insert valid contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) >= 1
    AND char_length(name) <= 200
    AND char_length(email) >= 3
    AND char_length(email) <= 254
    AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    AND char_length(message) >= 1
    AND char_length(message) <= 5000
    AND (phone IS NULL OR (char_length(phone) >= 1 AND char_length(phone) <= 60))
    AND (product IS NULL OR char_length(product) <= 200)
  );
