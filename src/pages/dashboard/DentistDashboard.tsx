import { Link } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { PlusCircle, ArrowRight, Activity, CheckCircle2, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Logo } from '@/components/Logo'

export function DentistDashboard() {
  const { orders, currentUser } = useAppStore()
  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'completed')

  const stats = [
    {
      label: 'Pendentes',
      value: orders.filter((o) => o.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      label: 'Em Produção',
      value: orders.filter((o) => o.status === 'in_production').length,
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      label: 'Concluídos',
      value: orders.filter((o) => o.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Logo variant="square" size="lg" className="hidden sm:flex" />
          <div>
            <Logo variant="square" size="sm" className="sm:hidden mb-4" />
            <h2 className="text-3xl font-bold tracking-tight">Olá, {currentUser.name}</h2>
            <p className="text-muted-foreground mt-1 text-lg">
              Aqui está o resumo dos seus casos protéticos.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="gap-2 shadow-sm whitespace-nowrap w-full sm:w-auto">
          <Link to="/new-request">
            <PlusCircle className="w-5 h-5" /> Novo Pedido
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((s, i) => (
          <Card key={i} className="shadow-subtle hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {s.label}
              </CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-subtle border-muted/60">
        <CardHeader className="bg-muted/10">
          <CardTitle>Casos Ativos</CardTitle>
          <CardDescription>
            Acompanhe o status dos trabalhos em andamento no laboratório.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {activeOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Nenhum caso ativo no momento.</p>
              <Button variant="link" asChild className="mt-2">
                <Link to="/new-request">Iniciar um novo pedido</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-4"
                >
                  <div className="grid gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{order.patientName}</span>
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {order.friendlyId}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium text-foreground/80">{order.workType}</span> •{' '}
                      {order.material} • Criado em{' '}
                      {format(new Date(order.createdAt), 'dd MMM, HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <StatusBadge status={order.status} className="px-3 py-1" />
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                      <Link to={`/order/${order.id}`}>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
