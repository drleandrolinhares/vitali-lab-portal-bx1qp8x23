DO $$
BEGIN
  -- Assegurar que as categorias DRE necessárias para as repetições existam
  INSERT INTO public.dre_categories (name, category_type) 
  VALUES ('Custo Operacional', 'variable')
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO public.dre_categories (name, category_type) 
  VALUES ('Receita', 'revenue')
  ON CONFLICT (name) DO NOTHING;
END $$;
