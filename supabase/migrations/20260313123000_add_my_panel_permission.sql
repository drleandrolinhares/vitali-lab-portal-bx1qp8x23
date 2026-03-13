-- Adiciona a chave 'my_panel' com access = true para o role_permissions_v2 do dentista e laboratory (default fallback)
UPDATE public.app_settings
SET value = (
  CASE 
    WHEN COALESCE(value, '') = '' THEN 
      '{"dentist": {"my_panel": {"access": true}}, "laboratory": {"my_panel": {"access": true}}}'::jsonb
    WHEN jsonb_typeof(value::jsonb) = 'object' THEN 
      value::jsonb || jsonb_build_object(
        'dentist', 
        (
          CASE 
            WHEN jsonb_typeof(value::jsonb -> 'dentist') = 'object' THEN value::jsonb -> 'dentist' 
            ELSE '{}'::jsonb 
          END
        ) || '{"my_panel": {"access": true}}'::jsonb,
        'laboratory',
        (
          CASE 
            WHEN jsonb_typeof(value::jsonb -> 'laboratory') = 'object' THEN value::jsonb -> 'laboratory' 
            ELSE '{}'::jsonb 
          END
        ) || '{"my_panel": {"access": true}}'::jsonb
      )
    ELSE 
      '{"dentist": {"my_panel": {"access": true}}, "laboratory": {"my_panel": {"access": true}}}'::jsonb
  END
)::text
WHERE key = 'role_permissions_v2';

-- Garante que todos os perfis de dentistas e laboratórios também recebam a propriedade por padrão com access = true
UPDATE public.profiles
SET permissions = (
  CASE 
    WHEN jsonb_typeof(permissions) = 'object' THEN permissions 
    ELSE '{}'::jsonb 
  END
) || '{"my_panel": {"access": true}}'::jsonb
WHERE role IN ('dentist', 'laboratory');
