/*
  # Create initial admin user

  1. Changes
    - Creates an auth user with email admin@thepowerofai.team and password Admin2026!
    - Adds this user to the admin_users table as super_admin

  2. Important Notes
    - This is the initial admin account for the admin dashboard
    - The password should be changed after first login
*/

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@thepowerofai.team') THEN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@thepowerofai.team',
      crypt('Admin2026!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now(),
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      new_user_id,
      'admin@thepowerofai.team',
      jsonb_build_object('sub', new_user_id::text, 'email', 'admin@thepowerofai.team'),
      'email',
      now(),
      now(),
      now()
    );

    INSERT INTO admin_users (id, email, rolle, name)
    VALUES (new_user_id, 'admin@thepowerofai.team', 'super_admin', 'Admin');
  END IF;
END $$;
