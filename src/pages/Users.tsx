import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { UsersManagement } from '@/components/UsersManagement'
import { RolePermissionsPanel } from '@/components/RolePermissionsPanel'
import { Loader2 } from 'lucide-react'

export default function UsersPage() {
  const { currentUser } = useAppStore()
  const isMaster = currentUser?.role === 'master'
  const [isValidating, setIsValidating] = useState(true)

  useEffect(() => {
    let isMounted = true
    const validateSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          if (
            error.message?.includes('Refresh Token') ||
            error.message?.includes('refresh token')
          ) {
            await supabase.auth.signOut()
            window.location.href = '/'
            return
          }
        }
        if (!session) {
          window.location.href = '/'
          return
        }
        if (isMounted) setIsValidating(false)
      } catch (err: any) {
        if (err?.message?.includes('Refresh Token') || err?.message?.includes('refresh token')) {
          await supabase.auth.signOut()
          window.location.href = '/'
        }
      }
    }
    validateSession()
    return () => {
      isMounted = false
    }
  }, [])

  if (isValidating) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground font-medium">Validando sessão...</span>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
          GESTÃO DE USUÁRIOS
        </h2>
        <p className="text-muted-foreground uppercase text-xs font-bold mt-1">
          GERENCIE ACESSOS, DENTISTAS E A EQUIPE DE COLABORADORES DO LABORATÓRIO.
        </p>
      </div>

      <UsersManagement />

      {isMaster && (
        <div className="pt-8 space-y-4 animate-fade-in-up">
          <RolePermissionsPanel />
        </div>
      )}
    </div>
  )
}
