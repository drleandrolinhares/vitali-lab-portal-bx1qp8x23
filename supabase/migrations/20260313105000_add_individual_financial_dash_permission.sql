-- Adiciona a chave 'individual_financial_dash' com access = false para o role_permissions_v2 do dentista (default fallback)
UPDATE public.app_settings
SET value = (
  CASE 
    WHEN COALESCE(value, '') = '' THEN 
      '{"dentist": {"individual_financial_dash": {"access": false}}}'::jsonb
    WHEN jsonb_typeof(value::jsonb) = 'object' THEN 
      value::jsonb || jsonb_build_object(
        'dentist', 
        (
          CASE 
            WHEN jsonb_typeof(value::jsonb -> 'dentist') = 'object' THEN value::jsonb -> 'dentist' 
            ELSE '{}'::jsonb 
          END
        ) || '{"individual_financial_dash": {"access": false}}'::jsonb
      )
    ELSE 
      '{"dentist": {"individual_financial_dash": {"access": false}}}'::jsonb
  END
)::text
WHERE key = 'role_permissions_v2';

-- Garante que todos os perfis de dentistas também recebam a propriedade por padrão com access = false
UPDATE public.profiles
SET permissions = (
  CASE 
    WHEN jsonb_typeof(permissions) = 'object' THEN permissions 
    ELSE '{}'::jsonb 
  END
) || '{"individual_financial_dash": {"access": false}}'::jsonb
WHERE role = 'dentist';
