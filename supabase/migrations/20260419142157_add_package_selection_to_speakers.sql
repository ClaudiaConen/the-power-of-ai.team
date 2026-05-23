/*
  # Add package selection fields to speakers table

  1. New Columns on `speakers`
    - `upgrade_buehne` (text, default '') - empty, 'buehne15' (+500), or 'buehne25' (+750)
    - `upgrade_shooting` (boolean, default false) - professional photo/video shooting (+500)
    - `upgrade_7stage` (boolean, default false) - 7er Stage package (price TBD)
    - `gesamtpreis_netto` (numeric(10,2), default 500) - calculated total net price

  2. Notes
    - The base package "A1 Starter Pitch & Präsenz" at 500€ is always included
    - Upgrades are additive on top of the base price
    - The existing `format` column is kept for backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'upgrade_buehne'
  ) THEN
    ALTER TABLE speakers ADD COLUMN upgrade_buehne text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'upgrade_shooting'
  ) THEN
    ALTER TABLE speakers ADD COLUMN upgrade_shooting boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'upgrade_7stage'
  ) THEN
    ALTER TABLE speakers ADD COLUMN upgrade_7stage boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'gesamtpreis_netto'
  ) THEN
    ALTER TABLE speakers ADD COLUMN gesamtpreis_netto numeric(10,2) DEFAULT 500;
  END IF;
END $$;
