import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

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

  const reconcileProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, personal_phone')
        .eq('id', currentUser.id)
        .maybeSingle()

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
    } catch (e) {
      console.error('Failed to reconcile profile:', e)
    }
  }

  useEffect(() => {
    const rememberMeFalse = localStorage.getItem('vitali_remember_me') === 'false'
    const isNewTab = !sessionStorage.getItem('vitali_session')

    if (rememberMeFalse && isNewTab) {
      supabase.auth.signOut().then(() => {
        localStorage.removeItem('vitali_remember_me')
      })
    }

    sessionStorage.setItem('vitali_session', 'true')

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        reconcileProfile(session.user).catch(console.error)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        reconcileProfile(session.user).catch(console.error)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, metadata: any) => {
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
  }

  const signIn = async (identifier: string, password: string, rememberMe: boolean = true) => {
    if (!identifier.includes('@')) {
      return {
        error: new Error(
          'Formato de email inválido. Utilize um endereço de email válido para entrar.',
        ),
      }
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    })

    if (!authError) {
      if (!rememberMe) {
        localStorage.setItem('vitali_remember_me', 'false')
      } else {
        localStorage.removeItem('vitali_remember_me')
      }
      sessionStorage.setItem('vitali_session', 'true')

      if (authData?.user) {
        await reconcileProfile(authData.user)
      }
    }
    return { error: authError }
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

    const { error } = await supabase.auth.resetPasswordForEmail(identifier, {
      redirectTo: `${window.location.origin}/app`,
    })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{ user, session, signUp, signIn, signOut, resetPassword, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
