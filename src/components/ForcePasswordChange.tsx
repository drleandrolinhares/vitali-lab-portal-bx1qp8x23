import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { useAppStore } from '@/stores/main'
import { Eye, EyeOff } from 'lucide-react'

export default function ForcePasswordChange() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updateProfile } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' })
      return
    }
    if (newPassword.length < 6) {
      toast({ title: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' })
      return
    }
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      if (
        error.message?.includes('Session from session_id claim in JWT does not exist') ||
        error.message?.includes('session_not_found') ||
        (error as any).code === 'session_not_found'
      ) {
        toast({
          title: 'Sessão Expirada',
          description: 'Sua sessão expirou. Por favor, faça login novamente.',
          variant: 'destructive',
        })
        await supabase.auth.signOut()
        window.location.href = '/'
        return
      }

      toast({
        title: 'Erro ao atualizar senha',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      await updateProfile({ requires_password_change: false } as any)
      toast({ title: 'Senha atualizada com sucesso!' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-elevation border-0">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-xl font-bold">Atualização de Senha Obrigatória</CardTitle>
          <CardDescription>
            Como este é seu primeiro acesso com uma senha temporária, você precisa definir uma nova
            senha para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pr-10 normal-case"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10 normal-case"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
