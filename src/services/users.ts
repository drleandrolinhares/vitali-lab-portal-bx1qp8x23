import { supabase } from '@/lib/supabase/client'

// Função auxiliar para extrair mensagens de erro de forma robusta da resposta do Edge Function
const extractErrorMessage = async (error: any, defaultMsg: string): Promise<string> => {
  let extractedMsg = error?.message || defaultMsg

  if (error?.context && typeof error.context.clone === 'function') {
    try {
      const errBody = await error.context.clone().json()
      if (errBody && errBody.error) {
        return typeof errBody.error === 'string' ? errBody.error : JSON.stringify(errBody.error)
      }
    } catch (e) {
      try {
        const errText = await error.context.clone().text()
        if (errText) {
          try {
            const parsedText = JSON.parse(errText)
            if (parsedText.error) {
              return typeof parsedText.error === 'string'
                ? parsedText.error
                : JSON.stringify(parsedText.error)
            }
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
      if (errBody && errBody.error) {
        return typeof errBody.error === 'string' ? errBody.error : JSON.stringify(errBody.error)
      }
    } catch (e) {
      // ignore fallback error
    }
  } else if (error?.context && error.context.error) {
    return typeof error.context.error === 'string'
      ? error.context.error
      : JSON.stringify(error.context.error)
  }

  if (typeof extractedMsg !== 'string') {
    try {
      extractedMsg = JSON.stringify(extractedMsg)
    } catch {
      extractedMsg = String(extractedMsg)
    }
  }

  try {
    const parsed = JSON.parse(extractedMsg)
    if (parsed.error) {
      return typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error)
    }
  } catch (e) {
    // ignore fallback error
  }

  return extractedMsg
}

const ensureValidSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) {
    throw new Error('Erro ao validar sessão. Por favor, faça login novamente.')
  }
  if (!session) {
    throw new Error('Sessão expirada. Por favor, faça login novamente.')
  }

  // Refresh if expiring in less than 2 minutes (120 seconds)
  const expiresAt = session.expires_at ? session.expires_at * 1000 : 0
  if (expiresAt > 0 && expiresAt - Date.now() < 120000) {
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError || !refreshData.session) {
      throw new Error('Não foi possível renovar a sessão. Por favor, faça login novamente.')
    }
    return refreshData.session.access_token
  }

  return session.access_token
}

export const createUser = async (payload: any) => {
  try {
    const token = await ensureValidSession()
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: payload,
      headers: { Authorization: `Bearer ${token}` },
    })

    if (error) {
      const extractedMsg = await extractErrorMessage(error, error.message)
      return { data: null, error: new Error(extractedMsg) }
    }

    if (data && data.error) return { data: null, error: new Error(data.error) }
    return { data, error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}

export const updateUser = async (payload: any) => {
  try {
    const token = await ensureValidSession()
    const { data, error } = await supabase.functions.invoke('update-user', {
      body: payload,
      headers: { Authorization: `Bearer ${token}` },
    })

    if (error) {
      const extractedMsg = await extractErrorMessage(error, error.message)
      return { data: null, error: new Error(extractedMsg) }
    }

    if (data && data.error) return { data: null, error: new Error(data.error) }
    return { data, error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}
