DO $$
BEGIN
  -- Garantir que os perfis de Leandro de Souza e Amanda estejam sincronizados 
  -- com o role correto a partir do user_metadata (master e admin) e estejam ativos
  UPDATE public.profiles p
  SET role = COALESCE(u.raw_user_meta_data->>'role', p.role), is_active = true
  FROM auth.users u
  WHERE p.id = u.id AND (u.raw_user_meta_data->>'role' IN ('master', 'admin'));

  UPDATE public.profiles p
  SET role = 'master', is_active = true
  FROM auth.users u
  WHERE p.id = u.id AND u.raw_user_meta_data->>'name' ILIKE '%Leandro de Souza%';

  UPDATE public.profiles p
  SET role = 'admin', is_active = true
  FROM auth.users u
  WHERE p.id = u.id AND u.raw_user_meta_data->>'name' ILIKE '%Amanda%';
END $$;

-- Remover a política antiga
DROP POLICY IF EXISTS "Dentists can view own orders, lab can view all" ON public.orders;

-- Recriar a política com permissão explícita irrestrita para master e admin
CREATE POLICY "Dentists can view own orders, lab can view all" ON public.orders
FOR SELECT TO public
USING (
  -- 1. Master e admin podem ver TODOS os registros 
  -- (verifica tanto a tabela profiles quanto o user_metadata no JWT)
  (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'master')
    )
  )
  OR
  (
    COALESCE(current_setting('request.jwt.claims', true), '{}')::jsonb -> 'user_metadata' ->> 'role' IN ('admin', 'master')
  )
  OR
  -- 2. Mantém permissões exatas para dentist, receptionist e demais membros do laboratório
  -- (estes precisam passar pela validação de is_current_user_active() e ownership/role)
  (
    public.is_current_user_active() AND (
      (dentist_id = auth.uid()) OR 
      (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('receptionist', 'technical_assistant', 'financial', 'relationship_manager')
      ))
    )
  )
);
