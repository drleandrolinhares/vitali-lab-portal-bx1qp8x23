import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function PendingApproval() {
  const { signOut } = useAuth()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full bg-white dark:bg-card p-8 rounded-xl shadow-lg border text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Cadastro em Análise</h2>
          <p className="text-muted-foreground text-sm">
            Seu cadastro foi recebido com sucesso e está aguardando aprovação por um administrador
            do laboratório. Assim que seu acesso for liberado, esta tela será atualizada
            automaticamente.
          </p>
        </div>
        <Button onClick={() => signOut()} variant="outline" className="w-full mt-4">
          Sair
        </Button>
      </div>
    </div>
  )
}
