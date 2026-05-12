-- Grant admin role to gokulakrishnanoffl@gmail.com
-- This inserts a row into public.user_roles for the auth user with that email.
-- If the user doesn't exist yet, run this later (after user signs up) or run manually in the SQL editor.

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'gokulakrishnanoffl@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- For manual execution in the Supabase SQL editor, use the above INSERT statement.