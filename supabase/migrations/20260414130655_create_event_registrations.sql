/*
  # Create event_registrations table

  1. New Tables
    - `event_registrations`
      - `id` (uuid, primary key) - unique registration ID
      - `offer_number` (text, not null) - the offer number ANG-2026-XXXX
      - `full_name` (text, not null) - full name of registrant
      - `company` (text, nullable) - company name
      - `billing_address` (text, not null) - street, zip, city
      - `email` (text, not null) - contact email
      - `phone` (text, not null) - phone number
      - `vat_id` (text, nullable) - VAT ID / USt-IdNr
      - `confirm_binding` (boolean, not null) - binding agreement confirmed
      - `confirm_cancellation` (boolean, not null) - cancellation terms accepted
      - `confirm_media` (boolean, not null) - photo/video consent
      - `signature_data` (text, nullable) - base64 encoded signature image
      - `signature_location_date` (text, not null) - location and date string
      - `created_at` (timestamptz) - registration timestamp

  2. Security
    - Enable RLS on `event_registrations` table
    - Add INSERT policy for anonymous users (public registration form)
    - No SELECT/UPDATE/DELETE policies for anon (data only accessible via service role)
*/

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_number text NOT NULL,
  full_name text NOT NULL,
  company text DEFAULT '',
  billing_address text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  vat_id text DEFAULT '',
  confirm_binding boolean NOT NULL DEFAULT false,
  confirm_cancellation boolean NOT NULL DEFAULT false,
  confirm_media boolean NOT NULL DEFAULT false,
  signature_data text,
  signature_location_date text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit event registration"
  ON event_registrations
  FOR INSERT
  TO anon
  WITH CHECK (
    full_name <> '' AND
    email <> '' AND
    offer_number <> '' AND
    confirm_binding = true AND
    confirm_cancellation = true AND
    confirm_media = true
  );
