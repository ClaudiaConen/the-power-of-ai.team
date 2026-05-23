/*
  # Fix security issues: mutable search_path and broad storage policies

  1. Functions Modified
    - `get_next_invoice_number`: Set immutable search_path to 'public'
    - `check_speaker_duplicate`: Set immutable search_path to 'public'

  2. Storage Policies Removed
    - "Anyone can read speaker files" (anon SELECT on speaker-uploads)
    - "Authenticated can read speaker files" (authenticated SELECT on speaker-uploads)
    - Public buckets serve files via signed/public URLs without needing SELECT policies;
      these broad policies unnecessarily allowed listing all files in the bucket.

  3. Security Notes
    - Both functions are SECURITY DEFINER and require a fixed search_path
      to prevent search_path manipulation attacks
    - The speaker-uploads bucket remains public for direct URL access,
      but clients can no longer enumerate/list all stored files
*/

-- Fix get_next_invoice_number: recreate with SET search_path
CREATE OR REPLACE FUNCTION public.get_next_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_year text;
  next_num integer;
  result text;
BEGIN
  current_year := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM 'RE-\d{4}-(\d+)') AS integer)
  ), 0) + 1
  INTO next_num
  FROM invoices
  WHERE invoice_number LIKE 'RE-' || current_year || '-%';

  result := 'RE-' || current_year || '-' || LPAD(next_num::text, 3, '0');
  RETURN result;
END;
$$;

-- Fix check_speaker_duplicate: recreate with SET search_path
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

-- Remove broad SELECT policies on speaker-uploads storage objects
DROP POLICY IF EXISTS "Anyone can read speaker files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can read speaker files" ON storage.objects;