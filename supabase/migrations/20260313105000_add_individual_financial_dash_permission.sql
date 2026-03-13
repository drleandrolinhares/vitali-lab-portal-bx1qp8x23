-- Adiciona a chave 'individual_financial_dash' com access = false para o role_permissions_v2 do dentista (default fallback)
UPDATE public.app_settings
SET value = jsonb_set(
  value::jsonb,
  '{dentist, individual_financial_dash}',
  '{"access": false}'::jsonb,
  true
)
WHERE key = 'role_permissions_v2';

-- Garante que todos os perfis de dentistas também recebam a propriedade por padrão com access = false
UPDATE public.profiles
SET permissions = jsonb_set(
  COALESCE(permissions, '{}'::jsonb),
  '{individual_financial_dash}',
  '{"access": false}'::jsonb,
  true
)
WHERE role = 'dentist';
