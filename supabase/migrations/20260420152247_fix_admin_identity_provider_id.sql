/*
  # Fix admin user identity provider_id

  1. Changes
    - Updates the provider_id in auth.identities for the admin user
    - Changes provider_id from UUID to the email address (admin@thepowerofai.team)
    - This is required by Supabase GoTrue for email/password sign-in to work correctly

  2. Important Notes
    - The original migration inserted the UUID as provider_id instead of the email
    - GoTrue looks up identities by provider + provider_id (email) during signInWithPassword
    - Without this fix, login fails with "Database error querying schema"
*/

UPDATE auth.identities
SET provider_id = 'admin@thepowerofai.team',
    identity_data = jsonb_set(
      identity_data,
      '{email_verified}',
      'true'::jsonb
    )
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@thepowerofai.team'
)
AND provider = 'email';
