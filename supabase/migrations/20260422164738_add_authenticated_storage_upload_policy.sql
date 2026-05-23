/*
  # Allow authenticated users to upload to speaker-uploads bucket

  1. Security Changes
    - Add INSERT policy for authenticated users on storage.objects for the speaker-uploads bucket
    - This enables the Ablaufplan team photo upload feature (admin users are authenticated)

  2. Notes
    - The existing anon INSERT policy remains for the public speaker form
    - Authenticated users (admins) need this to upload team member photos from the Ablaufplan page
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload speaker files'
  ) THEN
    CREATE POLICY "Authenticated users can upload speaker files"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'speaker-uploads');
  END IF;
END $$;
