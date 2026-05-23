/*
  # Expand speaker upgrade columns

  1. New Columns on `speakers`
    - `quelle_sonstiges` (text, default '') - free text when quelle='sonstiges'
    - `upgrade_keynote15` (boolean, default false) - +15 min keynote upgrade (+500)
    - `upgrade_keynote25` (boolean, default false) - +25 min keynote upgrade (+750)
    - `upgrade_barcamp_room` (boolean, default false) - barcamp room 30min (+170)
    - `upgrade_workshop` (boolean, default false) - performance workshop 3h (+177)
    - `upgrade_coaching` (boolean, default false) - 1:1 coaching 3h (+377)

  2. Notes
    - Existing upgrade_buehne, upgrade_shooting, upgrade_7stage columns are kept
    - New columns use individual booleans for cleaner tracking
    - gesamtpreis_netto is recalculated on frontend based on selections
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'quelle_sonstiges'
  ) THEN
    ALTER TABLE speakers ADD COLUMN quelle_sonstiges text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'upgrade_keynote15'
  ) THEN
    ALTER TABLE speakers ADD COLUMN upgrade_keynote15 boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'upgrade_keynote25'
  ) THEN
    ALTER TABLE speakers ADD COLUMN upgrade_keynote25 boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'upgrade_barcamp_room'
  ) THEN
    ALTER TABLE speakers ADD COLUMN upgrade_barcamp_room boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'upgrade_workshop'
  ) THEN
    ALTER TABLE speakers ADD COLUMN upgrade_workshop boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'upgrade_coaching'
  ) THEN
    ALTER TABLE speakers ADD COLUMN upgrade_coaching boolean DEFAULT false;
  END IF;
END $$;
