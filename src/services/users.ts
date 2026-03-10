import { supabase } from '@/lib/supabase/client'

export const createUser = async (payload: any) => {
  const { data, error } = await supabase.functions.invoke('create-user', {
    body: payload,
  })
  if (error) return { data: null, error }
  if (data && data.error) return { data: null, error: new Error(data.error) }
  return { data, error: null }
}

export const updateUser = async (payload: any) => {
  const { data, error } = await supabase.functions.invoke('update-user', {
    body: payload,
  })
  if (error) return { data: null, error }
  if (data && data.error) return { data: null, error: new Error(data.error) }
  return { data, error: null }
}
