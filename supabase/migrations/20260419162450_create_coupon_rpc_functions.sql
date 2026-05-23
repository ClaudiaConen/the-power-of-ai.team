/*
  # Gutschein-Validierung und -Einloesung per RPC

  1. Neue Funktionen
    - `validate_coupon(p_code text)` - Prueft ob ein Code gueltig ist und gibt discount_value zurueck
    - `redeem_coupon(p_code text)` - Erhoeht current_uses um 1 (wird beim Formular-Submit aufgerufen)

  2. Sicherheit
    - validate_coupon: Fuer alle aufrufbar (anon + authenticated), gibt nur discount_value zurueck
    - redeem_coupon: Fuer alle aufrufbar (wird beim anonymen Submit benoetigt)
    - Beide Funktionen setzen search_path explizit
*/

CREATE OR REPLACE FUNCTION validate_coupon(p_code text)
RETURNS TABLE(valid boolean, discount_value numeric, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon RECORD;
BEGIN
  SELECT c.* INTO v_coupon
  FROM coupons c
  WHERE UPPER(c.code) = UPPER(TRIM(p_code))
    AND c.active = true;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::numeric, 'Ungültiger Gutscheincode.'::text;
    RETURN;
  END IF;

  IF v_coupon.valid_from IS NOT NULL AND now() < v_coupon.valid_from THEN
    RETURN QUERY SELECT false, 0::numeric, 'Dieser Gutscheincode ist noch nicht gültig.'::text;
    RETURN;
  END IF;

  IF v_coupon.valid_until IS NOT NULL AND now() > v_coupon.valid_until THEN
    RETURN QUERY SELECT false, 0::numeric, 'Dieser Gutscheincode ist abgelaufen.'::text;
    RETURN;
  END IF;

  IF v_coupon.current_uses >= v_coupon.max_uses THEN
    RETURN QUERY SELECT false, 0::numeric, 'Dieser Gutscheincode wurde bereits eingelöst.'::text;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, v_coupon.discount_value, 'Gutschein gültig.'::text;
END;
$$;

CREATE OR REPLACE FUNCTION redeem_coupon(p_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE coupons
  SET current_uses = current_uses + 1
  WHERE UPPER(code) = UPPER(TRIM(p_code))
    AND active = true
    AND current_uses < max_uses;
END;
$$;
