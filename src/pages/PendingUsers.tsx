import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, UserPlus, Clock } from 'lucide-react'

export default function PendingUsersPage() {
  const { pendingUsers, approveUser, rejectUser } = useAppStore()

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dateString))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cadastros Pendentes</h2>
        <p className="text-muted-foreground">
          Gerencie os dentistas que solicitaram acesso ao sistema.
        </p>
      </div>

      {pendingUsers.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Tudo limpo!</h3>
              <p className="text-muted-foreground text-sm">
                Não há nenhum cadastro pendente de aprovação no momento.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingUsers.map((user) => (
            <Card key={user.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Registrado em {formatDate(user.created_at)}
                    </CardDescription>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500 shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium text-[10px] uppercase tracking-wider block mb-0.5">
                      Clínica
                    </span>
                    {user.clinic || (
                      <span className="text-muted-foreground italic">Não informada</span>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium text-[10px] uppercase tracking-wider block mb-0.5">
                      Email
                    </span>
                    {user.email}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    onClick={() => approveUser(user.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => rejectUser(user.id)}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 border-red-200 dark:border-red-900/30 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                    Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
