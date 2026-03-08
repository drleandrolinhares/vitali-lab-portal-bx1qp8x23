import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Logo } from '@/components/Logo'

export default function PendingApproval() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full bg-background dark:bg-card p-8 rounded-xl shadow-lg border text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center pb-2">
          <Logo size="xl" />
        </div>

        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Cadastro em Análise</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Seu cadastro foi recebido com sucesso e está aguardando aprovação por um administrador
            do laboratório. Assim que seu acesso for liberado, esta tela será atualizada
            automaticamente.
          </p>
        </div>

        <Button onClick={() => signOut()} variant="outline" size="lg" className="w-full mt-4">
          Sair
        </Button>
      </div>
    </div>
  )
}
