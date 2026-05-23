/*
  # Gutscheincode-System (Coupons)

  1. Neue Tabellen
    - `coupons`
      - `id` (uuid, primary key)
      - `code` (text, unique) - Der Gutscheincode z.B. "EARLYBIRD50"
      - `discount_value` (numeric) - Rabattbetrag in Euro (netto)
      - `max_uses` (integer, default 1) - Maximale Einloesungen (1 = Einmal-Code)
      - `current_uses` (integer, default 0) - Aktuelle Einloesungen
      - `valid_from` (timestamptz, nullable) - Gueltig ab
      - `valid_until` (timestamptz, nullable) - Gueltig bis
      - `active` (boolean, default true) - Manuell deaktivierbar
      - `created_at` (timestamptz)

  2. Sicherheit
    - RLS aktiviert
    - Anonyme Nutzer koennen nur aktive Codes per SELECT pruefen
    - Nur authentifizierte Admin-User duerfen INSERT/UPDATE/DELETE
*/

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_value numeric NOT NULL DEFAULT 0,
  max_uses integer NOT NULL DEFAULT 1,
  current_uses integer NOT NULL DEFAULT 0,
  valid_from timestamptz,
  valid_until timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active coupons for validation"
  ON coupons FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can insert coupons"
  ON coupons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update coupons"
  ON coupons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete coupons"
  ON coupons FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
