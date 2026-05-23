/*
  # Add anmoderation column to speakers

  1. Modified Tables
    - `speakers`
      - Added `anmoderation` (text, nullable, max 350 chars) - short introduction text for the speaker's appearance

  2. Notes
    - Column is nullable with empty string default for backwards compatibility
    - 350 character limit enforced via CHECK constraint
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'anmoderation'
  ) THEN
    ALTER TABLE speakers ADD COLUMN anmoderation text DEFAULT '' CHECK (length(anmoderation) <= 350);
  END IF;
END $$;