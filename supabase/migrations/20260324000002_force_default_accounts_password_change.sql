-- Fix: Contas com credenciais padrão conhecidas (admin123, vitali123, dentista123)
--
-- Problema: migrations anteriores criaram contas com senhas triviais e públicas
-- no histórico do git. Qualquer pessoa com acesso ao repositório conhece essas senhas.
--
-- Correção: forçar troca de senha obrigatória no próximo login para essas contas.

UPDATE public.profiles
SET requires_password_change = true
WHERE email IN (
  'admin@nuvia.com',
  'recepcao@vitali.com',
  'dentista@vitali.com'
)
AND requires_password_change IS DISTINCT FROM true;
