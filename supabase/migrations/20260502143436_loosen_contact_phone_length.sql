/*
  # Loosen phone length check on contact_submissions RLS

  1. Changes
    - Drop the existing "Anon can insert valid contact submissions" policy.
    - Recreate it with a more permissive phone length (<= 60 chars) to
      accommodate international formats with spaces, dashes and parentheses.

  2. Security
    - Name, email format and message checks remain unchanged.
*/

DROP POLICY IF EXISTS "Anon can insert valid contact submissions" ON public.contact_submissions;

CREATE POLICY "Anon can insert valid contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    char_length(name) > 0
    AND char_length(name) <= 200
    AND char_length(email) > 0
    AND char_length(email) <= 254
    AND email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'
    AND char_length(message) > 0
    AND char_length(message) <= 5000
    AND (phone IS NULL OR char_length(phone) <= 60)
  );
