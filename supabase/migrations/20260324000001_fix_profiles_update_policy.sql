-- Fix: RLS de UPDATE em profiles
--
-- Problema anterior: "Lab users can update profiles." permitia que qualquer
-- staff (receptionist, financial, etc.) atualizasse QUALQUER perfil, inclusive
-- alterando o próprio role para 'master'.
--
-- Correção:
--   1. Remove a policy permissiva
--   2. Cria policy separada apenas para admin/master (pode atualizar qualquer perfil)
--   3. Reescreve a policy de auto-edição com WITH CHECK que impede escalada de role

-- 1. Remove a policy que permitia qualquer staff atualizar qualquer perfil
DROP POLICY IF EXISTS "Lab users can update profiles." ON public.profiles;

-- 2. Admin/master podem atualizar qualquer perfil (sem restrição)
DROP POLICY IF EXISTS "Admin can update any profile." ON public.profiles;
CREATE POLICY "Admin can update any profile." ON public.profiles
  FOR UPDATE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'master')
  );

-- 3. Usuário comum pode atualizar apenas o próprio perfil,
--    mas NÃO pode alterar o campo role (previne auto-promoção)
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
