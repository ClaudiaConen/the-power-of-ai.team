/*
  # Add product column to contact_submissions

  1. Modified Tables
    - `contact_submissions`
      - Added `product` (text, nullable, default '') - stores which product the customer is interested in

  2. Notes
    - Non-destructive change, only adds a new column
    - Existing rows will get the default empty string value
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'product'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN product text DEFAULT '' ;
  END IF;
END $$;