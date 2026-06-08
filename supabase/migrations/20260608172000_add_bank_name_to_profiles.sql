-- Add bank_name column idempotently to profiles table to support accurate invoice printing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_name TEXT;
