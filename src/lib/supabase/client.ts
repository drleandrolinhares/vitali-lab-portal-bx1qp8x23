// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ||
  'https://ojadcgjvsjhblinruzga.supabase.co') as string
const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qYWRjZ2p2c2poYmxpbnJ1emdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTM1MTgsImV4cCI6MjA4ODQ4OTUxOH0.jvZHcyQqN5CuEh4hrxQp-yfJGaXzzveT60cWj3MNIoA') as string

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
