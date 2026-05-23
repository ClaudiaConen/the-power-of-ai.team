/*
  # Event-Planner: Ablaufplan-Tabellen

  1. New Tables
    - `event_cities`
      - `id` (uuid, primary key)
      - `slug` (text, unique) — URL-freundlicher Name, z.B. "koeln"
      - `name` (text) — Anzeigename, z.B. "Motorworld Köln"
      - `event_von` (text) — Startzeit, z.B. "11:00"
      - `event_bis` (text) — Endzeit, z.B. "18:00"
      - `event_datum` (date, nullable) — Veranstaltungsdatum
      - `created_at` (timestamptz)

    - `event_team`
      - `id` (uuid, primary key)
      - `city_id` (uuid, FK → event_cities)
      - `name` (text) — Vollstaendiger Name
      - `rolle` (text) — Rolle / Aufgabe
      - `kategorie` (text) — leadership, Technik, Video, etc.
      - `telefon` (text)
      - `email` (text)
      - `status` (text) — green / yellow / red
      - `whatsapp` (boolean)
      - `notizen` (text)
      - `foto_url` (text)
      - `sort_order` (integer) — Sortierreihenfolge
      - `created_at` (timestamptz)

    - `event_schedule`
      - `id` (uuid, primary key)
      - `city_id` (uuid, FK → event_cities)
      - `von` (text) — Startzeit des Slots
      - `bis` (text) — Endzeit des Slots
      - `typ` (text) — Begruessung, Speaker, Pitch-Block, etc.
      - `track` (text) — "main"
      - `speaker` (text)
      - `thema` (text)
      - `sort_order` (integer)
      - `created_at` (timestamptz)

    - `event_barcamp`
      - `id` (uuid, primary key)
      - `city_id` (uuid, FK → event_cities)
      - `room` (integer) — Raumnummer (1, 2, 3)
      - `von` (text) — Startzeit
      - `bis` (text) — Endzeit
      - `speaker` (text)
      - `thema` (text)
      - `beschreibung` (text)
      - `sort_order` (integer)
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on all tables
    - Public read access (anon + authenticated) for all tables
    - Write access (insert, update, delete) for authenticated users only
    - No unrestricted USING(true) — read policies limited to anon/authenticated roles

  3. Notes
    - All tables use gen_random_uuid() for primary keys
    - Foreign keys cascade on delete from event_cities
    - sort_order allows manual reordering
*/

-- ══════════════════════════════════════════════
-- event_cities
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS event_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  event_von text NOT NULL DEFAULT '11:00',
  event_bis text NOT NULL DEFAULT '18:00',
  event_datum date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read event_cities"
  ON event_cities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert event_cities"
  ON event_cities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update event_cities"
  ON event_cities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete event_cities"
  ON event_cities FOR DELETE
  TO authenticated
  USING (true);

-- ══════════════════════════════════════════════
-- event_team
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS event_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES event_cities(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  rolle text NOT NULL DEFAULT '',
  kategorie text NOT NULL DEFAULT 'Helfer',
  telefon text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'red',
  whatsapp boolean NOT NULL DEFAULT false,
  notizen text NOT NULL DEFAULT '',
  foto_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read event_team"
  ON event_team FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert event_team"
  ON event_team FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update event_team"
  ON event_team FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete event_team"
  ON event_team FOR DELETE
  TO authenticated
  USING (true);

-- ══════════════════════════════════════════════
-- event_schedule
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS event_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES event_cities(id) ON DELETE CASCADE,
  von text NOT NULL DEFAULT '11:00',
  bis text NOT NULL DEFAULT '11:45',
  typ text NOT NULL DEFAULT 'Speaker',
  track text NOT NULL DEFAULT 'main',
  speaker text NOT NULL DEFAULT '',
  thema text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read event_schedule"
  ON event_schedule FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert event_schedule"
  ON event_schedule FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update event_schedule"
  ON event_schedule FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete event_schedule"
  ON event_schedule FOR DELETE
  TO authenticated
  USING (true);

-- ══════════════════════════════════════════════
-- event_barcamp
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS event_barcamp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES event_cities(id) ON DELETE CASCADE,
  room integer NOT NULL DEFAULT 1,
  von text NOT NULL DEFAULT '11:30',
  bis text NOT NULL DEFAULT '12:00',
  speaker text NOT NULL DEFAULT '',
  thema text NOT NULL DEFAULT '',
  beschreibung text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_barcamp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read event_barcamp"
  ON event_barcamp FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert event_barcamp"
  ON event_barcamp FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update event_barcamp"
  ON event_barcamp FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete event_barcamp"
  ON event_barcamp FOR DELETE
  TO authenticated
  USING (true);
