-- Fix #13: Policy "Public profiles are viewable by authenticated users." usava USING (true),
-- expondo CPF, email, telefone, RG, endereço de todos os usuários para qualquer autenticado.
--
-- Nova política de SELECT em profiles:
--   - Próprio perfil: acesso total (necessário para fetchProfile e settings).
--   - Admin/master: vê todos os perfis.
--   - Staff (receptionist, technical_assistant, financial, relationship_manager):
--     vê apenas perfis com role IN ('dentist', 'laboratory') — necessário para
--     JOINs em orders e listas de seleção de dentistas.
--   - Dentistas/laboratórios: apenas o próprio perfil.
--
-- Limitação conhecida: PostgreSQL RLS não restringe colunas. Para ocultar CPF/RG/endereço
-- de dentistas do staff, seria necessário mover esses campos para uma tabela separada
-- com policy própria (fora do escopo desta migration).
--
-- Nota: a subquery (SELECT role FROM profiles WHERE id = auth.uid()) em policies de
-- profiles é idiomática no Supabase e não causa recursão — PostgreSQL resolve via
-- lookup indexado por PK sem re-avaliar a policy no registro raiz.

DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users." ON public.profiles;

CREATE POLICY "Profiles are viewable by authorized users." ON public.profiles
  FOR SELECT TO authenticated
  USING (
    -- Próprio perfil
    auth.uid() = id
    OR
    -- Admin/master vê todos
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'master')
    OR
    -- Staff vê apenas dentistas/laboratórios (para JOINs em orders e seleção de parceiros)
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid())
        IN ('receptionist', 'technical_assistant', 'financial', 'relationship_manager')
      AND role IN ('dentist', 'laboratory')
    )
  );
