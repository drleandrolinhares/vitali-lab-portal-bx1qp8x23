-- Garante que colunas opcionais na tabela profiles não tenham restrição NOT NULL
-- Isso permite salvar strings vazias como NULL, evitando erros ao limpar campos.
ALTER TABLE public.profiles
  ALTER COLUMN personal_phone DROP NOT NULL,
  ALTER COLUMN rg DROP NOT NULL,
  ALTER COLUMN cpf DROP NOT NULL,
  ALTER COLUMN birth_date DROP NOT NULL,
  ALTER COLUMN cep DROP NOT NULL,
  ALTER COLUMN address DROP NOT NULL,
  ALTER COLUMN address_number DROP NOT NULL,
  ALTER COLUMN address_complement DROP NOT NULL,
  ALTER COLUMN city DROP NOT NULL,
  ALTER COLUMN state DROP NOT NULL,
  ALTER COLUMN clinic DROP NOT NULL,
  ALTER COLUMN clinic_contact_name DROP NOT NULL,
  ALTER COLUMN clinic_contact_phone DROP NOT NULL,
  ALTER COLUMN clinic_contact_role DROP NOT NULL,
  ALTER COLUMN whatsapp_group_link DROP NOT NULL;
