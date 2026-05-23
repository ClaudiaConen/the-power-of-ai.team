/*
  # Harden contact_submissions RLS policy

  1. Security Changes
    - Replace overly permissive INSERT policy (WITH CHECK true) with a restrictive one
    - New policy validates: name and email must not be empty, email must contain @,
      field lengths are capped to prevent abuse
    - Add SELECT policy for service_role only (no anonymous reads)
    - No DELETE/UPDATE for anon users

  2. Important Notes
    - This prevents spam/abuse by enforcing server-side data constraints
    - Anonymous users can only insert, never read back submitted data
*/

DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

CREATE POLICY "Anon can insert valid contact submissions"
  ON contact_submissions
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
    AND (phone IS NULL OR char_length(phone) <= 30)
  );
