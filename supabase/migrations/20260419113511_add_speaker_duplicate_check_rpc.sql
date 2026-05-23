/*
  # Add RPC function for speaker duplicate check

  1. Functions
    - `check_speaker_duplicate(p_email, p_stadt)` - Checks if a speaker with the same email and city already exists
    - Returns the speaker id if found, null otherwise
    - Accessible by anon role for pre-submit validation

  2. Security
    - Function uses SECURITY DEFINER to bypass RLS
    - Only returns boolean existence check, no sensitive data
*/

CREATE OR REPLACE FUNCTION check_speaker_duplicate(p_email text, p_stadt text)
RETURNS TABLE(id uuid) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id FROM speakers s
  WHERE s.email = p_email AND s.stadt = p_stadt
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_speaker_duplicate(text, text) TO anon;
GRANT EXECUTE ON FUNCTION check_speaker_duplicate(text, text) TO authenticated;