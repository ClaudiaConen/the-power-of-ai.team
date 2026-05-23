/*
  # Seed: Initiale Event-Planner-Daten fuer Koeln, Muenchen, Hamburg

  1. Cities
    - Koeln (Motorworld Koeln, 03.05.2026, 11:00-18:00)
    - Muenchen (leer, Standard-Zeiten)
    - Hamburg (leer, Standard-Zeiten)

  2. Team (nur Koeln)
    - 4 Kern-Leitung: Ronny Barthel, Claudia Conen, Klaus Offermann, Gabi Lindemann

  3. Hauptbuehne (nur Koeln)
    - 10 Slots von 11:00 bis 18:00
    - Calvin Hollywood als Star-Speaker Eroeffnung

  4. Barcamp (alle 3 Staedte)
    - Je 3 Raeume mit 4 Zeitslots

  5. Notes
    - Muenchen und Hamburg erhalten leere Default-Slots
    - Keine personenbezogenen Daten fuer Muenchen/Hamburg
*/

-- ══════════════════════════════════════════════
-- KOELN
-- ══════════════════════════════════════════════
INSERT INTO event_cities (slug, name, event_von, event_bis, event_datum)
VALUES ('koeln', 'Motorworld Köln', '11:00', '18:00', '2026-05-03')
ON CONFLICT (slug) DO NOTHING;

-- Team Koeln
INSERT INTO event_team (city_id, name, rolle, kategorie, telefon, email, status, whatsapp, sort_order)
SELECT c.id, 'Ronny Barthel', 'Event Gestalter', 'leadership', '', '', 'green', false, 1
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_team (city_id, name, rolle, kategorie, telefon, email, status, whatsapp, sort_order)
SELECT c.id, 'Claudia Conen', 'Köln Host', 'leadership', '0160 99142207', '', 'green', true, 2
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_team (city_id, name, rolle, kategorie, telefon, email, status, whatsapp, sort_order)
SELECT c.id, 'Klaus Offermann', 'Host', 'leadership', '0170 2474040', '', 'green', false, 3
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_team (city_id, name, rolle, kategorie, telefon, email, status, whatsapp, sort_order)
SELECT c.id, 'Gabi Lindemann', 'Webseite · Plan · Background', 'leadership', '0172 3413097', '', 'green', true, 4
FROM event_cities c WHERE c.slug = 'koeln';

-- Hauptbuehne Koeln
INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '11:00', '11:30', 'Speaker', 'main', 'Calvin Hollywood', 'Star-Speaker Eröffnung', 1
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '11:30', '12:15', 'Speaker', 'main', '', '', 2
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '12:15', '13:00', 'Netzwerk-Pause', 'main', '', 'Mittagspause & Networking', 3
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '13:00', '13:45', 'Speaker', 'main', '', '', 4
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '13:45', '14:30', 'Speaker', 'main', '', '', 5
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '14:30', '15:15', 'Speaker', 'main', '', '', 6
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '15:15', '16:00', 'Netzwerk-Pause', 'main', '', '', 7
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '16:00', '16:45', 'Speaker', 'main', '', '', 8
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '16:45', '17:30', 'Speaker', 'main', '', '', 9
FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_schedule (city_id, von, bis, typ, track, speaker, thema, sort_order)
SELECT c.id, '17:30', '18:00', 'Abschluss', 'main', '', '', 10
FROM event_cities c WHERE c.slug = 'koeln';

-- Barcamp Koeln (3 Raeume x 4 Slots)
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'koeln';

INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'koeln';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'koeln';

-- ══════════════════════════════════════════════
-- MUENCHEN
-- ══════════════════════════════════════════════
INSERT INTO event_cities (slug, name, event_von, event_bis)
VALUES ('muenchen', 'München', '11:00', '18:00')
ON CONFLICT (slug) DO NOTHING;

-- Default Hauptbuehne Muenchen
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '11:00', '11:30', 'Begrüßung', 'main', 1 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '11:30', '12:15', 'Speaker', 'main', 2 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '12:15', '13:00', 'Netzwerk-Pause', 'main', 3 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '13:00', '13:45', 'Speaker', 'main', 4 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '13:45', '14:30', 'Speaker', 'main', 5 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '14:30', '15:15', 'Speaker', 'main', 6 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '15:15', '16:00', 'Netzwerk-Pause', 'main', 7 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '16:00', '16:45', 'Speaker', 'main', 8 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '16:45', '17:30', 'Speaker', 'main', 9 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '17:30', '18:00', 'Abschluss', 'main', 10 FROM event_cities c WHERE c.slug = 'muenchen';

-- Barcamp Muenchen
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'muenchen';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'muenchen';

-- ══════════════════════════════════════════════
-- HAMBURG
-- ══════════════════════════════════════════════
INSERT INTO event_cities (slug, name, event_von, event_bis)
VALUES ('hamburg', 'Hamburg', '11:00', '18:00')
ON CONFLICT (slug) DO NOTHING;

-- Default Hauptbuehne Hamburg
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '11:00', '11:30', 'Begrüßung', 'main', 1 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '11:30', '12:15', 'Speaker', 'main', 2 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '12:15', '13:00', 'Netzwerk-Pause', 'main', 3 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '13:00', '13:45', 'Speaker', 'main', 4 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '13:45', '14:30', 'Speaker', 'main', 5 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '14:30', '15:15', 'Speaker', 'main', 6 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '15:15', '16:00', 'Netzwerk-Pause', 'main', 7 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '16:00', '16:45', 'Speaker', 'main', 8 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '16:45', '17:30', 'Speaker', 'main', 9 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_schedule (city_id, von, bis, typ, track, sort_order)
SELECT c.id, '17:30', '18:00', 'Abschluss', 'main', 10 FROM event_cities c WHERE c.slug = 'hamburg';

-- Barcamp Hamburg
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 1, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 2, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '11:30', '12:00', 1 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '13:00', '13:30', 2 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '14:30', '15:00', 3 FROM event_cities c WHERE c.slug = 'hamburg';
INSERT INTO event_barcamp (city_id, room, von, bis, sort_order)
SELECT c.id, 3, '16:00', '16:30', 4 FROM event_cities c WHERE c.slug = 'hamburg';

-- Add anon insert/update/delete policies so the page works without login
CREATE POLICY "Anon can insert event_cities"
  ON event_cities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update event_cities"
  ON event_cities FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete event_cities"
  ON event_cities FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert event_team"
  ON event_team FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update event_team"
  ON event_team FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete event_team"
  ON event_team FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert event_schedule"
  ON event_schedule FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update event_schedule"
  ON event_schedule FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete event_schedule"
  ON event_schedule FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can insert event_barcamp"
  ON event_barcamp FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update event_barcamp"
  ON event_barcamp FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete event_barcamp"
  ON event_barcamp FOR DELETE TO anon USING (true);
