/*
  # Contact submissions: server-side normalization & tolerant RLS

  Problem:
  Anonymous inserts sometimes fail with error 42501 (RLS violation) when the
  submitted email or phone contains invisible/Unicode whitespace
  (NBSP, zero-width, BOM). The JavaScript regex on the client passes the value,
  but the Postgres regex in the RLS WITH CHECK fails — leading to the
  misleading "E-Mail/Telefon prüfen" error in the UI.

  Fix:
  1. Add a BEFORE INSERT trigger that normalizes name/email/phone/message/product:
     - strip all Unicode whitespace, zero-width chars and BOM from edges
     - lowercase the email
     - turn empty phone/product strings into NULL
  2. Replace the RLS policy with a simpler, normalization-aware policy that
     checks length bounds and an email pattern on the already-normalized value.
  3. Explicitly GRANT INSERT on contact_submissions to anon (idempotent).

  Security:
  - RLS stays ENABLED on public.contact_submissions
  - Anonymous clients may only INSERT valid rows; no SELECT/UPDATE/DELETE exposed
  - The trigger uses a fixed search_path and is SECURITY INVOKER (default)

  Notes:
  - Existing data is untouched
  - Phone length raised to 60 to match existing policy upper bound
*/

CREATE OR REPLACE FUNCTION public.normalize_contact_submission()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  invisibles text := '[\u00A0\u200B\u200C\u200D\u2060\uFEFF\u202F\u2009\u00AD]';
BEGIN
  NEW.name := btrim(regexp_replace(COALESCE(NEW.name, ''), invisibles, '', 'g'));
  NEW.email := lower(btrim(regexp_replace(COALESCE(NEW.email, ''), invisibles, '', 'g')));
  NEW.message := btrim(regexp_replace(COALESCE(NEW.message, ''), invisibles, '', 'g'));

  IF NEW.phone IS NOT NULL THEN
    NEW.phone := btrim(regexp_replace(NEW.phone, invisibles, '', 'g'));
    IF NEW.phone = '' THEN
      NEW.phone := NULL;
    END IF;
  END IF;

  IF NEW.product IS NOT NULL THEN
    NEW.product := btrim(regexp_replace(NEW.product, invisibles, '', 'g'));
    IF NEW.product = '' THEN
      NEW.product := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_contact_submission ON public.contact_submissions;
CREATE TRIGGER trg_normalize_contact_submission
BEFORE INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.normalize_contact_submission();

DROP POLICY IF EXISTS "Anon can insert valid contact submissions" ON public.contact_submissions;

CREATE POLICY "Anon can insert valid contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 254
    AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    AND char_length(message) BETWEEN 1 AND 5000
    AND (phone IS NULL OR char_length(phone) BETWEEN 1 AND 60)
    AND (product IS NULL OR char_length(product) <= 200)
  );

GRANT INSERT ON public.contact_submissions TO anon;
