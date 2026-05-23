/*
  # Remove broad SELECT policy from downloads bucket

  1. Security Changes
    - Drop "Public read access for downloads" SELECT policy on storage.objects
    - This policy allowed anyone to list all files in the downloads bucket
    - Since the bucket is public, files are already accessible via their direct public URL
    - Removing the policy prevents clients from enumerating/listing all files in the bucket

  2. Notes
    - File downloads via public URLs continue to work without this policy
    - Only the ability to list/browse all files is removed
*/

DROP POLICY IF EXISTS "Public read access for downloads" ON storage.objects;
