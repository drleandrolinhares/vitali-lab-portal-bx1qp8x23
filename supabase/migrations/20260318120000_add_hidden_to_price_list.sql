ALTER TABLE public.price_list ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Public price_list view" ON public.price_list;

CREATE POLICY "Public price_list view" ON public.price_list
  FOR SELECT TO public
  USING (
    is_hidden = false OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'master'
    )
  );
