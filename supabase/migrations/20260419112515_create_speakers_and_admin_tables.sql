/*
  # Create speakers, admin_users, and invoices tables

  1. New Tables
    - `speakers` - Stores all speaker registration data
      - `id` (uuid, primary key, auto-generated)
      - `created_at` (timestamptz, auto)
      - `status` (text, default 'eingereicht') - eingereicht | bestaetigt | abgelehnt
      - `status_changed_at` (timestamptz)
      - `status_changed_by` (text)
      - Personal: vorname, nachname, email, telefon, unternehmen
      - Source: quelle, kontaktperson
      - Media: foto_url, video_url
      - Presentation: titel, beschreibung, kernbotschaft, format, stadt
      - Links: link1, link2, link3
      - Billing: r_firma, r_strasse, r_plz, r_stadt, r_ustid
      - Consents: consent_foto, consent_werbung, consent_urheber, consent_content, consent_dsgvo
      - Admin: notizen_intern, qr_code_url

    - `admin_users` - Stores admin user metadata
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `rolle` (text) - super_admin | event_manager | content_manager | support
      - `name` (text)

    - `invoices` - Stores invoices for speakers
      - `id` (uuid, primary key, auto-generated)
      - `speaker_id` (uuid, references speakers)
      - `invoice_number` (text, unique)
      - `invoice_date` (date)
      - Various amount fields, status, pdf_url, sent_at

  2. Security
    - Enable RLS on all tables
    - speakers: anon can INSERT, authenticated admin_users can SELECT/UPDATE/DELETE
    - admin_users: authenticated can SELECT own record
    - invoices: authenticated admin_users can full CRUD

  3. Constraints
    - Unique constraint on speakers(email, stadt) to prevent duplicates
*/

-- Create speakers table
CREATE TABLE IF NOT EXISTS speakers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'eingereicht',
  status_changed_at timestamptz,
  status_changed_by text,
  vorname text NOT NULL,
  nachname text NOT NULL,
  email text NOT NULL,
  telefon text DEFAULT '',
  unternehmen text NOT NULL,
  quelle text NOT NULL,
  kontaktperson text DEFAULT '',
  foto_url text DEFAULT '',
  video_url text DEFAULT '',
  titel text NOT NULL,
  beschreibung text NOT NULL,
  kernbotschaft text NOT NULL,
  format text NOT NULL,
  stadt text NOT NULL,
  link1 text DEFAULT '',
  link2 text DEFAULT '',
  link3 text DEFAULT '',
  r_firma text NOT NULL,
  r_strasse text NOT NULL,
  r_plz text NOT NULL,
  r_stadt text NOT NULL,
  r_ustid text DEFAULT '',
  consent_foto boolean NOT NULL DEFAULT false,
  consent_werbung boolean NOT NULL DEFAULT false,
  consent_urheber boolean NOT NULL DEFAULT false,
  consent_content boolean NOT NULL DEFAULT false,
  consent_dsgvo boolean NOT NULL DEFAULT false,
  notizen_intern text DEFAULT '',
  qr_code_url text DEFAULT '',
  CONSTRAINT speakers_email_stadt_unique UNIQUE (email, stadt),
  CONSTRAINT speakers_status_check CHECK (status IN ('eingereicht', 'bestaetigt', 'abgelehnt')),
  CONSTRAINT speakers_quelle_check CHECK (quelle IN ('skool', 'social', 'empfehlung', 'website', 'event', 'sonstiges')),
  CONSTRAINT speakers_format_check CHECK (format IN ('pitch3', 'keynote15', 'keynote25', 'barcamp', '7stage')),
  CONSTRAINT speakers_stadt_check CHECK (stadt IN ('koeln', 'muenchen', 'hamburg'))
);

ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a speaker registration
CREATE POLICY "Anyone can submit speaker registration"
  ON speakers
  FOR INSERT
  TO anon
  WITH CHECK (
    vorname <> '' AND
    nachname <> '' AND
    email <> '' AND
    unternehmen <> '' AND
    titel <> '' AND
    beschreibung <> '' AND
    kernbotschaft <> '' AND
    consent_foto = true AND
    consent_werbung = true AND
    consent_urheber = true AND
    consent_content = true AND
    consent_dsgvo = true
  );

-- Anon can check for duplicates (limited SELECT)
CREATE POLICY "Anon can check duplicate email and city"
  ON speakers
  FOR SELECT
  TO anon
  USING (false);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  rolle text NOT NULL DEFAULT 'event_manager',
  name text NOT NULL DEFAULT '',
  CONSTRAINT admin_users_rolle_check CHECK (rolle IN ('super_admin', 'event_manager', 'content_manager', 'support'))
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can read their own record
CREATE POLICY "Admin users can read own record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Authenticated admins can read all speakers
CREATE POLICY "Admins can read all speakers"
  ON speakers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Authenticated admins can update speakers
CREATE POLICY "Admins can update speakers"
  ON speakers
  FOR UPDATE
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

-- Authenticated admins can delete speakers
CREATE POLICY "Admins can delete speakers"
  ON speakers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  speaker_id uuid NOT NULL REFERENCES speakers(id),
  invoice_number text NOT NULL UNIQUE,
  invoice_date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL DEFAULT '',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  tax_rate numeric(5,2) NOT NULL DEFAULT 19.00,
  tax_amount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'erstellt',
  pdf_url text DEFAULT '',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT invoices_status_check CHECK (status IN ('erstellt', 'versendet', 'bezahlt', 'storniert'))
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Admins can read invoices
CREATE POLICY "Admins can read invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can insert invoices
CREATE POLICY "Admins can insert invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can update invoices
CREATE POLICY "Admins can update invoices"
  ON invoices
  FOR UPDATE
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

-- Create a function to get the next invoice number
CREATE OR REPLACE FUNCTION get_next_invoice_number()
RETURNS text AS $$
DECLARE
  current_year text;
  next_num integer;
  result text;
BEGIN
  current_year := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM 'RE-\d{4}-(\d+)') AS integer)
  ), 0) + 1
  INTO next_num
  FROM invoices
  WHERE invoice_number LIKE 'RE-' || current_year || '-%';
  
  result := 'RE-' || current_year || '-' || LPAD(next_num::text, 3, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;