/*
  # Create event_barcamp_rooms table for room names

  1. New Tables
    - `event_barcamp_rooms`
      - `id` (uuid, primary key)
      - `city_id` (uuid, foreign key to event_cities)
      - `room` (integer, room number 1-3)
      - `name` (text, editable room name)
      - `created_at` (timestamptz)
    - Unique constraint on (city_id, room) to ensure one name per room per city

  2. Security
    - Enable RLS on event_barcamp_rooms
    - SELECT: anon + authenticated can read (publicly viewable schedule)
    - INSERT/UPDATE/DELETE: only admin users

  3. Seed Data
    - Insert default room names for all existing cities
*/

CREATE TABLE IF NOT EXISTS event_barcamp_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES event_cities(id) ON DELETE CASCADE,
  room integer NOT NULL CHECK (room >= 1 AND room <= 10),
  name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(city_id, room)
);

ALTER TABLE event_barcamp_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read event_barcamp_rooms"
  ON event_barcamp_rooms FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert event_barcamp_rooms"
  ON event_barcamp_rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update event_barcamp_rooms"
  ON event_barcamp_rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete event_barcamp_rooms"
  ON event_barcamp_rooms FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- Seed default room names for all existing cities
INSERT INTO event_barcamp_rooms (city_id, room, name)
SELECT c.id, r.room, ''
FROM event_cities c
CROSS JOIN (VALUES (1), (2), (3)) AS r(room)
ON CONFLICT (city_id, room) DO NOTHING;
