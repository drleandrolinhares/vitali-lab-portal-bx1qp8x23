import { supabase } from '@/lib/supabase/client'

export const createUser = async (payload: any) => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      if (
        sessionError?.message?.includes('Refresh Token') ||
        sessionError?.message?.includes('refresh token') ||
        !session
      ) {
        await supabase.auth.signOut()
        window.location.href = '/'
        return { data: null, error: new Error('Sessão expirada. Redirecionando...') }
      }
      return {
        data: null,
        error: new Error('Sessão expirada ou inválida. Por favor, faça login novamente.'),
      }
    }

    const { data, error } = await supabase.functions.invoke('create-user', {
      body: payload,
    })

    if (error) {
      if (error.message?.includes('Refresh Token') || error.message?.includes('refresh token')) {
        await supabase.auth.signOut()
        window.location.href = '/'
        return { data: null, error: new Error('Sessão expirada. Redirecionando...') }
      }
      return { data: null, error }
    }

    if (data && data.error) return { data: null, error: new Error(data.error) }
    return { data, error: null }
  } catch (err: any) {
    if (err?.message?.includes('Refresh Token') || err?.message?.includes('refresh token')) {
      await supabase.auth.signOut()
      window.location.href = '/'
      return { data: null, error: new Error('Sessão expirada. Redirecionando...') }
    }
    return { data: null, error: err }
  }
}

export const updateUser = async (payload: any) => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      if (
        sessionError?.message?.includes('Refresh Token') ||
        sessionError?.message?.includes('refresh token') ||
        !session
      ) {
        await supabase.auth.signOut()
        window.location.href = '/'
        return { data: null, error: new Error('Sessão expirada. Redirecionando...') }
      }
      return {
        data: null,
        error: new Error('Sessão expirada ou inválida. Por favor, faça login novamente.'),
      }
    }

    const { data, error } = await supabase.functions.invoke('update-user', {
      body: payload,
    })

    if (error) {
      if (error.message?.includes('Refresh Token') || error.message?.includes('refresh token')) {
        await supabase.auth.signOut()
        window.location.href = '/'
        return { data: null, error: new Error('Sessão expirada. Redirecionando...') }
      }
      return { data: null, error }
    }

    if (data && data.error) return { data: null, error: new Error(data.error) }
    return { data, error: null }
  } catch (err: any) {
    if (err?.message?.includes('Refresh Token') || err?.message?.includes('refresh token')) {
      await supabase.auth.signOut()
      window.location.href = '/'
      return { data: null, error: new Error('Sessão expirada. Redirecionando...') }
    }
    return { data: null, error: err }
  }
}
