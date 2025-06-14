
-- Insert a test moderator user into the user_roles table
-- Note: This assumes you have a user with this ID in auth.users table
-- If you don't have this user yet, you'll need to sign up first with the credentials below

-- First, let's create a test user entry in user_roles table
-- Using a UUID that we'll associate with the test credentials
INSERT INTO public.user_roles (user_id, role) 
VALUES ('8d84fc84-57dc-4489-9e99-891cfb5ffa79', 'moderator')
ON CONFLICT (user_id, role) DO NOTHING;

-- Note: The user_id '8d84fc84-57dc-4489-9e99-891cfb5ffa79' should correspond 
-- to a user that exists in auth.users table with email: test@example.com
