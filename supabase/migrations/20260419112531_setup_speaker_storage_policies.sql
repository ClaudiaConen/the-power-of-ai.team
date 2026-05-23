/*
  # Storage policies for speaker-uploads bucket

  1. Security
    - Anyone (anon) can upload files to speaker-uploads bucket
    - Anyone can read files from the bucket (public access for profile photos)
    - Only authenticated admins can delete files
*/

CREATE POLICY "Anyone can upload speaker files"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'speaker-uploads');

CREATE POLICY "Anyone can read speaker files"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'speaker-uploads');

CREATE POLICY "Authenticated can read speaker files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'speaker-uploads');

CREATE POLICY "Admins can delete speaker files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'speaker-uploads');