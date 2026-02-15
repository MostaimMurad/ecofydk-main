-- Only insert admin role if the user exists in auth.users
INSERT INTO user_roles (user_id, role)
SELECT 'cb66c4b1-63e8-4663-a97b-2a4cdac7ddbf', 'admin'
WHERE EXISTS (
  SELECT 1 FROM auth.users WHERE id = 'cb66c4b1-63e8-4663-a97b-2a4cdac7ddbf'
);