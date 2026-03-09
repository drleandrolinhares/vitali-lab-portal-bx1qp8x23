-- Add material to price_list
ALTER TABLE public.price_list ADD COLUMN IF NOT EXISTS material TEXT NOT NULL DEFAULT '';

-- Add file_urls to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS file_urls JSONB DEFAULT '[]'::jsonb;

-- Create storage bucket for order files if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('order_files', 'order_files', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for order_files
CREATE POLICY "Public Access order_files" ON storage.objects FOR SELECT USING (bucket_id = 'order_files');
CREATE POLICY "Auth Insert order_files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'order_files' AND auth.role() = 'authenticated');
