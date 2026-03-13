import { supabase } from '@/lib/supabase/client'

// Função auxiliar para extrair mensagens de erro de forma robusta da resposta do Edge Function
const extractErrorMessage = async (error: any, defaultMsg: string): Promise<string> => {
  let extractedMsg = error?.message || defaultMsg

  if (error?.context && typeof error.context.clone === 'function') {
    try {
      const errBody = await error.context.clone().json()
      if (errBody && errBody.error) return errBody.error
    } catch (e) {
      try {
        const errText = await error.context.clone().text()
        if (errText) {
          try {
            const parsedText = JSON.parse(errText)
            if (parsedText.error) return parsedText.error
          } catch (pe) {
            return errText
          }
        }
      } catch (e2) {
        // ignore fallback error
      }
    }
  } else if (error?.context && typeof error.context.json === 'function') {
    try {
      const errBody = await error.context.json()
      if (errBody && errBody.error) return errBody.error
    } catch (e) {
      // ignore fallback error
    }
  } else if (error?.context && error.context.error) {
    return error.context.error
  }

  try {
    const parsed = JSON.parse(extractedMsg)
    if (parsed.error) return parsed.error
  } catch (e) {
    // ignore fallback error
  }

  return extractedMsg
}

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

      const extractedMsg = await extractErrorMessage(error, error.message)
      return { data: null, error: new Error(extractedMsg) }
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

      const extractedMsg = await extractErrorMessage(error, error.message)
      return { data: null, error: new Error(extractedMsg) }
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
