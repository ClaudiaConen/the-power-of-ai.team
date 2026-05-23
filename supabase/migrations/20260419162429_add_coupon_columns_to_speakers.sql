/*
  # Gutscheincode-Spalten in speakers-Tabelle

  1. Geaenderte Tabellen
    - `speakers`
      - `gutscheincode` (text, nullable) - Der eingeloeste Gutscheincode
      - `rabatt_netto` (numeric, default 0) - Der berechnete Rabattbetrag in Euro netto

  2. Zweck
    - Speichert den eingeloesten Code und den Rabattbetrag direkt beim Speaker
    - Ermoeglicht Nachvollziehbarkeit in der Buchhaltung
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'gutscheincode'
  ) THEN
    ALTER TABLE speakers ADD COLUMN gutscheincode text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'speakers' AND column_name = 'rabatt_netto'
  ) THEN
    ALTER TABLE speakers ADD COLUMN rabatt_netto numeric DEFAULT 0;
  END IF;
END $$;
