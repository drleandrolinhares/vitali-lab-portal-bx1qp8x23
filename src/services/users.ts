import { supabase } from '@/lib/supabase/client'

export const createUser = async (payload: any) => {
  const { data, error } = await supabase.functions.invoke('create-user', {
    body: payload,
  })
  return { data, error }
}
