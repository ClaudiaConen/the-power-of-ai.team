/*
  # Harden Event Planner RLS Policies

  1. Changes
    - Remove all anon INSERT/UPDATE/DELETE policies from event_cities, event_team, event_schedule, event_barcamp
    - Remove overly permissive authenticated INSERT/UPDATE/DELETE policies (USING true / WITH CHECK true)
    - Replace with admin-only write policies that check membership in admin_users table
    - Keep public SELECT policies for anon + authenticated (read-only is needed for the page)

  2. Security Model
    - SELECT: anon + authenticated can read (page is publicly viewable)
    - INSERT/UPDATE/DELETE: only authenticated users who exist in admin_users table
    - Uses the existing is_admin() security-definer function for ownership checks

  3. Tables affected
    - event_cities
    - event_team
    - event_schedule
    - event_barcamp
*/

-- ══════════════════════════════════════════════
-- event_cities: drop insecure policies
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "Anon can insert event_cities" ON event_cities;
DROP POLICY IF EXISTS "Anon can update event_cities" ON event_cities;
DROP POLICY IF EXISTS "Anon can delete event_cities" ON event_cities;
DROP POLICY IF EXISTS "Authenticated users can insert event_cities" ON event_cities;
DROP POLICY IF EXISTS "Authenticated users can update event_cities" ON event_cities;
DROP POLICY IF EXISTS "Authenticated users can delete event_cities" ON event_cities;

CREATE POLICY "Admins can insert event_cities"
  ON event_cities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update event_cities"
  ON event_cities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete event_cities"
  ON event_cities FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- ══════════════════════════════════════════════
-- event_team: drop insecure policies
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "Anon can insert event_team" ON event_team;
DROP POLICY IF EXISTS "Anon can update event_team" ON event_team;
DROP POLICY IF EXISTS "Anon can delete event_team" ON event_team;
DROP POLICY IF EXISTS "Authenticated users can insert event_team" ON event_team;
DROP POLICY IF EXISTS "Authenticated users can update event_team" ON event_team;
DROP POLICY IF EXISTS "Authenticated users can delete event_team" ON event_team;

CREATE POLICY "Admins can insert event_team"
  ON event_team FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update event_team"
  ON event_team FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete event_team"
  ON event_team FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- ══════════════════════════════════════════════
-- event_schedule: drop insecure policies
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "Anon can insert event_schedule" ON event_schedule;
DROP POLICY IF EXISTS "Anon can update event_schedule" ON event_schedule;
DROP POLICY IF EXISTS "Anon can delete event_schedule" ON event_schedule;
DROP POLICY IF EXISTS "Authenticated users can insert event_schedule" ON event_schedule;
DROP POLICY IF EXISTS "Authenticated users can update event_schedule" ON event_schedule;
DROP POLICY IF EXISTS "Authenticated users can delete event_schedule" ON event_schedule;

CREATE POLICY "Admins can insert event_schedule"
  ON event_schedule FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update event_schedule"
  ON event_schedule FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete event_schedule"
  ON event_schedule FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- ══════════════════════════════════════════════
-- event_barcamp: drop insecure policies
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "Anon can insert event_barcamp" ON event_barcamp;
DROP POLICY IF EXISTS "Anon can update event_barcamp" ON event_barcamp;
DROP POLICY IF EXISTS "Anon can delete event_barcamp" ON event_barcamp;
DROP POLICY IF EXISTS "Authenticated users can insert event_barcamp" ON event_barcamp;
DROP POLICY IF EXISTS "Authenticated users can update event_barcamp" ON event_barcamp;
DROP POLICY IF EXISTS "Authenticated users can delete event_barcamp" ON event_barcamp;

CREATE POLICY "Admins can insert event_barcamp"
  ON event_barcamp FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update event_barcamp"
  ON event_barcamp FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete event_barcamp"
  ON event_barcamp FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );
