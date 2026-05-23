/*
  # Create book_project_status table

  1. New Tables
    - `book_project_status`
      - `id` (uuid, primary key)
      - `reserved_count` (int) — Number of reserved premiere slots
      - `total_slots` (int) — Total number of slots
      - `updated_at` (timestamptz) — Last update timestamp
  2. Security
    - Enable RLS on `book_project_status`
    - Public SELECT policy for anonymous and authenticated users (read-only public counter)
  3. Seed Data
    - Insert initial row with 26 / 77
*/

CREATE TABLE IF NOT EXISTS book_project_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reserved_count int NOT NULL DEFAULT 26,
  total_slots int NOT NULL DEFAULT 77,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE book_project_status ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'book_project_status' AND policyname = 'Anyone can view book project status'
  ) THEN
    CREATE POLICY "Anyone can view book project status"
      ON book_project_status FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

INSERT INTO book_project_status (reserved_count, total_slots)
SELECT 26, 77
WHERE NOT EXISTS (SELECT 1 FROM book_project_status);
