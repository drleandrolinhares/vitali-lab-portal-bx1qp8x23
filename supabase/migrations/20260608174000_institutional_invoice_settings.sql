DO $$
BEGIN
  INSERT INTO public.app_settings (key, value) VALUES
    ('lab_razao_social', 'VITALI LAB SOLUCOES ODONTOLOGICAS LTDA'),
    ('lab_cnpj', '00.000.000/0000-00'),
    ('lab_address', 'Endereço não informado'),
    ('lab_pix_key', 'CNPJ: 00.000.000/0000-00'),
    ('lab_bank_name', 'Banco não informado')
  ON CONFLICT (key) DO NOTHING;
END $$;
