/*
  # Revoke EXECUTE on SECURITY DEFINER functions from API roles

  1. Changes
    - Revoke EXECUTE from `anon` and `authenticated` on:
        * validate_coupon(text)
        * redeem_coupon(text)
        * check_speaker_duplicate(text, text)
        * get_next_invoice_number()
    - These functions are now only reachable via Edge Functions that run with
      the service role. The service role already bypasses these grants, so
      access is preserved for legitimate flows while the REST /rpc endpoints
      become inaccessible to anon/authenticated callers.

  2. Security Notes
    - Closes the advisor findings:
      "Public/Signed-In Users Can Execute SECURITY DEFINER Function"
    - Functions keep SECURITY DEFINER because service-role callers still use
      them; we just remove the REST surface.
*/

REVOKE EXECUTE ON FUNCTION public.validate_coupon(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.validate_coupon(text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_coupon(text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.redeem_coupon(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.redeem_coupon(text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.redeem_coupon(text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.check_speaker_duplicate(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_speaker_duplicate(text, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.check_speaker_duplicate(text, text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.get_next_invoice_number() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_next_invoice_number() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_next_invoice_number() FROM PUBLIC;

NOTIFY pgrst, 'reload schema';
