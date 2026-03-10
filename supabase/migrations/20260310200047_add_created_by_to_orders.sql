ALTER TABLE public.orders ADD COLUMN created_by UUID;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

-- Backfill created_by using audit logs for existing orders
UPDATE public.orders o
SET created_by = a.user_id
FROM public.audit_logs a
WHERE a.entity_type = 'order' 
  AND a.action = 'CREATE' 
  AND a.entity_id = o.id::text;
