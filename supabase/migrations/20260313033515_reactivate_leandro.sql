DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Identifica o id do usuário associado ao email
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE email = 'mosby.ls@gmail.com'
  LIMIT 1;

  -- Se o usuário existir, procede com a atualização
  IF target_user_id IS NOT NULL THEN
    -- Restaura o status ativo no profile
    UPDATE public.profiles
    SET is_active = true
    WHERE id = target_user_id;

    -- Registra na tabela de log de auditoria
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      NULL,
      'UPDATE',
      'profile',
      target_user_id::text,
      '{"reason": "System automatic reactivation of Leandro de Souza (mosby.ls@gmail.com)", "is_active": true}'::jsonb
    );
  END IF;
END $$;
