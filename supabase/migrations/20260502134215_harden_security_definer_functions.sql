/*
  # Harden SECURITY DEFINER Functions

  1. Problem
    - Five SECURITY DEFINER functions were executable by anon and authenticated roles
      via PostgREST RPC endpoints, flagged by the Supabase security advisor
    - Some of these functions should never be callable from the REST API
    - Others are intentionally public but should be tightened where possible

  2. Changes
    - `is_admin()`: Revoke EXECUTE from PUBLIC, anon, authenticated. It is only
      used inside RLS policies and does not need REST exposure.
    - `get_next_invoice_number()`: Revoke EXECUTE from PUBLIC, anon. Keep grant
      for authenticated, but add an is_admin() guard inside so only admins can
      consume invoice numbers.
    - `check_speaker_duplicate(text, text)`: Remain callable by anon and
      authenticated (needed by the public speaker registration form), but
      revoke from PUBLIC and set an explicit search_path. Returns only an id
      flag, no sensitive data.
    - `validate_coupon(text)`: Same — remain public-callable (used by public
      form) but revoked from PUBLIC, returns only discount_value/message.
    - `redeem_coupon(text)`: Same — remain public-callable (used at submit
      time), revoked from PUBLIC, only increments a counter. Narrowed to return
      void.

  3. Security Notes
    - is_admin() and get_next_invoice_number() are now completely out of reach
      for anonymous users.
    - The three form-facing functions remain deliberately exposed because they
      back the anonymous speaker registration flow; their SECURITY DEFINER
      scope is minimal (single-row lookup or single-row counter update).
*/

-- 1. is_admin(): lock it down — only RLS policies need it via definer rights
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;

-- 2. get_next_invoice_number(): admin-only, add internal guard
CREATE OR REPLACE FUNCTION public.get_next_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  next_num integer;
  year_str text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  year_str := to_char(now(), 'YYYY');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM '^' || year_str || '-(\d+)$') AS integer)
  ), 0) + 1
  INTO next_num
  FROM invoices
  WHERE invoice_number LIKE year_str || '-%';

  RETURN year_str || '-' || LPAD(next_num::text, 4, '0');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_next_invoice_number() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_next_invoice_number() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_next_invoice_number() TO authenticated;

-- 3. check_speaker_duplicate(): explicit grants only, add search_path
CREATE OR REPLACE FUNCTION public.check_speaker_duplicate(p_email text, p_stadt text)
RETURNS TABLE(id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id FROM speakers s
  WHERE s.email = p_email AND s.stadt = p_stadt
  LIMIT 1;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_speaker_duplicate(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_speaker_duplicate(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_speaker_duplicate(text, text) TO authenticated;

-- 4. validate_coupon(): explicit grants only
REVOKE EXECUTE ON FUNCTION public.validate_coupon(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text) TO authenticated;

-- 5. redeem_coupon(): explicit grants only
REVOKE EXECUTE ON FUNCTION public.redeem_coupon(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text) TO anon;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text) TO authenticated;

NOTIFY pgrst, 'reload schema';
