-- Adiciona a coluna allowed_sectors na tabela profiles para gerenciar o acesso aos laboratórios
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allowed_sectors TEXT[] DEFAULT ARRAY['SOLUÇÕES CERÂMICAS', 'STÚDIO ACRÍLICO']::TEXT[];

-- Adiciona um comentário para documentar o propósito da coluna
COMMENT ON COLUMN public.profiles.allowed_sectors IS 'Laboratórios/Setores que o usuário tem permissão para visualizar e gerenciar';

-- Força a recarga do cache de schema do PostgREST para reconhecer a nova coluna imediatamente
NOTIFY pgrst, 'reload schema';
