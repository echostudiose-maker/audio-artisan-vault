-- Create two users with email/password and assign admin role
DO $$
DECLARE
  v_user_id_1 uuid;
  v_user_id_2 uuid;
  v_encrypted_password text;
BEGIN
  v_encrypted_password := crypt('Ph12345678', gen_salt('bf'));

  -- User 1: echostudiose@gmail.com
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'echostudiose@gmail.com') THEN
    v_user_id_1 := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token,
      email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id_1, 'authenticated', 'authenticated',
      'echostudiose@gmail.com', v_encrypted_password,
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Echo Studio"}'::jsonb,
      false, '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id_1,
      jsonb_build_object('sub', v_user_id_1::text, 'email', 'echostudiose@gmail.com', 'email_verified', true),
      'email', v_user_id_1::text, now(), now(), now());
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id_1, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    SELECT id INTO v_user_id_1 FROM auth.users WHERE email = 'echostudiose@gmail.com';
    UPDATE auth.users SET encrypted_password = v_encrypted_password, updated_at = now()
    WHERE id = v_user_id_1;
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id_1, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  -- User 2: glrtpedro@gmail.com
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'glrtpedro@gmail.com') THEN
    v_user_id_2 := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token,
      email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id_2, 'authenticated', 'authenticated',
      'glrtpedro@gmail.com', v_encrypted_password,
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Pedro"}'::jsonb,
      false, '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id_2,
      jsonb_build_object('sub', v_user_id_2::text, 'email', 'glrtpedro@gmail.com', 'email_verified', true),
      'email', v_user_id_2::text, now(), now(), now());
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id_2, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    SELECT id INTO v_user_id_2 FROM auth.users WHERE email = 'glrtpedro@gmail.com';
    UPDATE auth.users SET encrypted_password = v_encrypted_password, updated_at = now()
    WHERE id = v_user_id_2;
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id_2, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;