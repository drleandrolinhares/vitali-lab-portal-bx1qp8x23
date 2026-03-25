import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>
  signIn: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (identifier: string) => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const isRefreshError = (error: any) => {
    if (!error) return false
    const msg = (error.message || '').toLowerCase()
    // PGRST301 é erro de RLS/autorização, NÃO erro de token — não deve causar logout
    return (
      msg.includes('refresh token') ||
      msg.includes('session from session_id claim in jwt does not exist') ||
      msg.includes('session_not_found') ||
      msg.includes('refresh_token_not_found')
    )
  }

  const handleSessionError = (silent = false) => {
    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k))
    } catch (e) {
      console.error('Failed to clear local storage', e)
    }

    supabase.auth.signOut().catch(() => {})
    setSession(null)
    setUser(null)
    localStorage.removeItem('vitali_remember_me')
    sessionStorage.removeItem('vitali_session')

    if (!silent && window.location.pathname !== '/login' && window.location.pathname !== '/') {
      toast({
        title: 'Sessão Expirada',
        description: 'Sua sessão expirou ou é inválida. Por favor, faça login novamente.',
        variant: 'destructive',
      })
    }

    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login'
    }
  }

  const reconcileProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, personal_phone')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (error) {
        if (isRefreshError(error)) {
          handleSessionError()
          return
        }
        throw error
      }

      if (!data && !error) {
        await supabase.from('profiles').insert({
          id: currentUser.id,
          email: currentUser.email || '',
          name: currentUser.user_metadata?.name || 'Usuário',
          role: currentUser.user_metadata?.role || 'dentist',
          clinic: currentUser.user_metadata?.clinic || null,
          personal_phone: currentUser.user_metadata?.phone || null,
        })
      } else if (data && !data.personal_phone && currentUser.user_metadata?.phone) {
        await supabase
          .from('profiles')
          .update({
            personal_phone: currentUser.user_metadata.phone,
          })
          .eq('id', currentUser.id)
      }
    } catch (e: any) {
      console.error('Failed to reconcile profile:', e)
      if (isRefreshError(e)) {
        handleSessionError()
      }
    }
  }

  useEffect(() => {
    sessionStorage.setItem('vitali_session', 'true')

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        try {
          const keysToRemove = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
              keysToRemove.push(key)
            }
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k))
        } catch (e) {
          console.error('Failed to clear local storage on sign out', e)
        }

        setSession(null)
        setUser(null)
        setLoading(false)
        localStorage.removeItem('vitali_remember_me')
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        reconcileProfile(session.user).catch(console.error)
      }
    })

    // getSession é usado apenas como fallback de loading caso onAuthStateChange
    // demore a disparar. reconcileProfile já é chamado pelo onAuthStateChange.
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          if (isRefreshError(error)) {
            handleSessionError(true)
            setLoading(false)
            return
          }
        }
        setSession((prev) => prev ?? session)
        setUser((prev) => prev ?? (session?.user ?? null))
        setLoading(false)
      })
      .catch((err) => {
        console.error('getSession error', err)
        if (isRefreshError(err)) {
          handleSessionError(true)
        }
        setLoading(false)
      })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/app`,
        },
      })

      if (data?.user && !error) {
        await reconcileProfile(data.user)
      }

      return { error }
    } catch (err: any) {
      return { error: err }
    }
  }

  const signIn = async (identifier: string, password: string, rememberMe: boolean = true) => {
    if (!identifier.includes('@')) {
      return {
        error: new Error(
          'Formato de email inválido. Utilize um endereço de email válido para entrar.',
        ),
      }
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      })

      if (authError) {
        return { error: authError }
      }

      localStorage.removeItem('vitali_remember_me')
      sessionStorage.setItem('vitali_session', 'true')

      if (authData?.user) {
        await reconcileProfile(authData.user)
      }

      return { error: null }
    } catch (err: any) {
      return { error: err }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      localStorage.removeItem('vitali_remember_me')
    }
    return { error }
  }

  const resetPassword = async (identifier: string) => {
    if (!identifier.includes('@')) {
      return { error: new Error('Formato de email inválido.') }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(identifier, {
        redirectTo: `${window.location.origin}/app`,
      })
      return { error }
    } catch (err: any) {
      return { error: err }
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, session, signUp, signIn, signOut, resetPassword, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
