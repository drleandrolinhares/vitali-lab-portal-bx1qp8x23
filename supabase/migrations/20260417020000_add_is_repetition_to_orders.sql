-- Add is_repetition flag to orders table for the Repetitions feature
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_repetition BOOLEAN DEFAULT false;

-- Create an index to make finding repetitions faster
CREATE INDEX IF NOT EXISTS idx_orders_is_repetition ON public.orders(is_repetition) WHERE is_repetition = true;
