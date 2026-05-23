/*
  # Create public downloads bucket

  1. Storage
    - Create `downloads` bucket for publicly accessible file downloads
    - Enable public access so files can be downloaded without authentication
  2. Security
    - Add policy allowing anyone to read/download files from the bucket
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('downloads', 'downloads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for downloads"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'downloads');
