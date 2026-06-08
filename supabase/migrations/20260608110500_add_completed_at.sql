-- Add completed_at column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Backfill existing orders with their completion date from history, or fallback to created_at
DO $$
BEGIN
  UPDATE public.orders o
  SET completed_at = COALESCE(
    (SELECT MIN(created_at) FROM public.order_history h WHERE h.order_id = o.id AND h.status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE')),
    o.created_at
  )
  WHERE o.completed_at IS NULL AND o.status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE');
END $$;

-- Create or replace trigger to maintain completed_at
CREATE OR REPLACE FUNCTION public.handle_order_status_update()
RETURNS trigger AS $$
BEGIN
  -- If status changes to completed/delivered, set completed_at
  IF NEW.status IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE') AND (OLD.status NOT IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE') OR OLD.status IS NULL) THEN
    NEW.completed_at := NOW();
  -- If status reverts from completed/delivered to something else, unset completed_at
  ELSIF NEW.status NOT IN ('completed', 'delivered', 'CONCLUÍDO', 'ENTREGUE') THEN
    NEW.completed_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_order_status_update ON public.orders;
CREATE TRIGGER on_order_status_update
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_status_update();
