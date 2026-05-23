/*
  # Fix speakers CHECK constraints to match form options

  1. Changes
    - Drops the restrictive `stadt` CHECK constraint so any city name is accepted
      (the form uses a free-text input, not a fixed dropdown)
    - Replaces the `quelle` CHECK constraint to add 'google' and 'podcast' options
      that exist in the frontend dropdown but were missing from the DB

  2. Modified Tables
    - `speakers`
      - `stadt`: CHECK constraint removed (was limited to koeln/muenchen/hamburg)
      - `quelle`: CHECK constraint updated to include google and podcast

  3. Important Notes
    - No data is deleted or modified, only constraints are adjusted
    - Existing data remains valid under the new, less restrictive constraints
*/

-- Remove the restrictive stadt constraint (form allows free text)
ALTER TABLE speakers DROP CONSTRAINT IF EXISTS speakers_stadt_check;

-- Replace quelle constraint with expanded allowed values
ALTER TABLE speakers DROP CONSTRAINT IF EXISTS speakers_quelle_check;
ALTER TABLE speakers ADD CONSTRAINT speakers_quelle_check
  CHECK (quelle = ANY (ARRAY['skool','social','empfehlung','website','event','sonstiges','google','podcast']));
