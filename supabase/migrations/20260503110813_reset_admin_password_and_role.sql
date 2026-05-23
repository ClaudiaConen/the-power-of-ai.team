/*
  # Reset admin password and ensure super_admin role

  1. Changes
    - Sets a new bcrypt-hashed password for admin@thepowerofai.team
    - Ensures admin has role 'super_admin' in admin_users

  2. Notes
    - New password: PoAI-Team-2026#9xK3Vn (communicated out-of-band)
    - User should change password after first login
*/

DO $$
DECLARE
  target_id uuid;
BEGIN
  SELECT id INTO target_id FROM auth.users WHERE email = 'admin@thepowerofai.team';
  IF target_id IS NOT NULL THEN
    UPDATE auth.users
    SET encrypted_password = crypt('PoAI-Team-2026#9xK3Vn', gen_salt('bf')),
        updated_at = now()
    WHERE id = target_id;

    UPDATE admin_users SET rolle = 'super_admin' WHERE id = target_id;
  END IF;
END $$;
