DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Identifica o id do usuário associado ao email
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE email = 'drleandrolinhares@gmail.com'
  LIMIT 1;

  -- Se o usuário existir, procede com a atualização
  IF target_user_id IS NOT NULL THEN
    -- Restaura o status ativo e de aprovação no profile, e garante a role master
    UPDATE public.profiles
    SET 
      is_active = true,
      is_approved = true,
      role = 'master'
    WHERE id = target_user_id;

    -- Registra na tabela de log de auditoria
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      NULL,
      'UPDATE',
      'profile',
      target_user_id::text,
      '{"reason": "System automatic reactivation of Dr. Leandro (drleandrolinhares@gmail.com)", "is_active": true, "is_approved": true, "role": "master"}'::jsonb
    );

    -- Tenta atualizar também os metadados de autenticação para sincronia
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "master"}'::jsonb
    WHERE id = target_user_id;
  END IF;
END $$;
