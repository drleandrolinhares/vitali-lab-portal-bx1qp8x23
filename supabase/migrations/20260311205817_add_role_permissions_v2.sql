-- Seed the new role_permissions_v2 object into app_settings
INSERT INTO public.app_settings (key, value)
VALUES (
  'role_permissions_v2',
  '{"admin":{"inbox":{"access":true,"actions":{"view_all":true,"view_mine":true,"create_order":true}},"kanban":{"access":true,"actions":{"move_cards":true,"view_all":true,"filter_dentist":true}},"history":{"access":true,"actions":{"select_dentist":true,"show_completed":true,"search":true}},"finances":{"access":true,"actions":{}},"inventory":{"access":true,"actions":{}},"settings":{"access":true,"actions":{}}},"receptionist":{"inbox":{"access":true,"actions":{"view_all":true,"view_mine":true,"create_order":true}},"kanban":{"access":true,"actions":{"move_cards":true,"view_all":true,"filter_dentist":true}},"history":{"access":true,"actions":{"select_dentist":true,"show_completed":true,"search":true}},"finances":{"access":false,"actions":{}},"inventory":{"access":false,"actions":{}},"settings":{"access":false,"actions":{}}},"dentist":{"inbox":{"access":true,"actions":{"view_all":false,"view_mine":true,"create_order":true}},"kanban":{"access":true,"actions":{"move_cards":false,"view_all":false,"filter_dentist":false}},"history":{"access":true,"actions":{"select_dentist":false,"show_completed":false,"search":false}},"finances":{"access":true,"actions":{}},"inventory":{"access":false,"actions":{}},"settings":{"access":false,"actions":{}}}}'
)
ON CONFLICT (key) DO NOTHING;

-- Update all receptionists to ensure they have the view_all permissions by default
UPDATE public.profiles
SET permissions = '{"inbox":{"access":true,"actions":{"view_all":true,"view_mine":true,"create_order":true}},"kanban":{"access":true,"actions":{"move_cards":true,"view_all":true,"filter_dentist":true}},"history":{"access":true,"actions":{"select_dentist":true,"show_completed":true,"search":true}},"finances":{"access":false,"actions":{}},"inventory":{"access":false,"actions":{}},"settings":{"access":false,"actions":{}}}'::jsonb
WHERE role = 'receptionist';

-- Update all dentists to use new default structure
UPDATE public.profiles
SET permissions = '{"inbox":{"access":true,"actions":{"view_all":false,"view_mine":true,"create_order":true}},"kanban":{"access":true,"actions":{"move_cards":false,"view_all":false,"filter_dentist":false}},"history":{"access":true,"actions":{"select_dentist":false,"show_completed":false,"search":false}},"finances":{"access":true,"actions":{}},"inventory":{"access":false,"actions":{}},"settings":{"access":false,"actions":{}}}'::jsonb
WHERE role = 'dentist';

-- Update all admins/masters
UPDATE public.profiles
SET permissions = '{"inbox":{"access":true,"actions":{"view_all":true,"view_mine":true,"create_order":true}},"kanban":{"access":true,"actions":{"move_cards":true,"view_all":true,"filter_dentist":true}},"history":{"access":true,"actions":{"select_dentist":true,"show_completed":true,"search":true}},"finances":{"access":true,"actions":{}},"inventory":{"access":true,"actions":{}},"settings":{"access":true,"actions":{}}}'::jsonb
WHERE role IN ('admin', 'master');

