-- First check and delete if exists (to reset cleanly)
DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@ecofy.dk');
DELETE FROM public.profiles WHERE email = 'admin@ecofy.dk';
DELETE FROM auth.users WHERE email = 'admin@ecofy.dk';

-- Now create fresh
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    confirmation_token, recovery_token,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@ecofy.dk',
    crypt('11223344++', gen_salt('bf')),
    now(),
    now(), now(),
    '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin"}',
    false
  )
  RETURNING id INTO new_user_id;

  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (new_user_id, 'admin@ecofy.dk', 'Admin', now(), now());

  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (new_user_id, 'admin', now());

  RAISE NOTICE 'SUCCESS: Admin user created with ID: %', new_user_id;
END $$;

SELECT 'VERIFIED' AS status, email FROM auth.users WHERE email = 'admin@ecofy.dk';
