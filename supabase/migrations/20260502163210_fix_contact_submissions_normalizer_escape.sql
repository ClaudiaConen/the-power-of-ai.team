/*
  # Fix contact_submissions normalizer: proper Unicode escapes

  Problem:
  The BEFORE INSERT trigger normalize_contact_submission() declared its
  "invisibles" character class as a plain string literal
      '[\u00A0\u200B...\u00AD]'
  Postgres does NOT interpret \uXXXX inside a regular string literal, so the
  character class actually contained the literal characters \, u, 0, A, B,
  C, D, E, F, 1, 2, 6, 9. Every insert had those characters stripped from
  name / email / message, mutilating valid input (e.g. "googlemail.com"
  became "googlemil.om"). The mutilated email then failed the RLS regex and
  the client received a misleading 42501 "Sicherheitspruefung" error.

  Fix:
  Rebuild the character class using chr(NNNN) concatenation so that the
  actual Unicode code points end up in the regex, independent of client
  encoding or escape-string settings.

  Security:
  - Function remains SECURITY INVOKER with a locked search_path
  - No RLS, grants or policies are changed
*/

CREATE OR REPLACE FUNCTION public.normalize_contact_submission()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  invisibles text := '['
    || chr(160)    -- NBSP
    || chr(173)    -- SOFT HYPHEN
    || chr(8203)   -- ZERO WIDTH SPACE
    || chr(8204)   -- ZERO WIDTH NON-JOINER
    || chr(8205)   -- ZERO WIDTH JOINER
    || chr(8288)   -- WORD JOINER
    || chr(65279)  -- BOM / ZERO WIDTH NO-BREAK SPACE
    || chr(8239)   -- NARROW NO-BREAK SPACE
    || chr(8201)   -- THIN SPACE
    || ']';
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
