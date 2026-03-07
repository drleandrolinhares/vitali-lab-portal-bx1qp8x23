import { Link } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { PlusCircle, ArrowRight, Activity, CheckCircle2, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function DentistDashboard() {
  const { orders, currentUser } = useAppStore()
  const myOrders = orders.filter((o) => o.dentistName === currentUser.name)
  const activeOrders = myOrders.filter((o) => o.status !== 'delivered' && o.status !== 'completed')

  const stats = [
    {
      label: 'Pendentes',
      value: myOrders.filter((o) => o.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      label: 'Em Produção',
      value: myOrders.filter((o) => o.status === 'in_production').length,
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      label: 'Concluídos',
      value: myOrders.filter((o) => o.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Olá, {currentUser.name}</h2>
          <p className="text-muted-foreground">Aqui está o resumo dos seus casos protéticos.</p>
        </div>
        <Button asChild className="gap-2 shadow-sm">
          <Link to="/new-request">
            <PlusCircle className="w-4 h-4" /> Novo Pedido
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s, i) => (
          <Card key={i} className="shadow-subtle hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Casos Ativos</CardTitle>
          <CardDescription>
            Acompanhe o status dos trabalhos em andamento no laboratório.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Activity className="w-6 h-6 opacity-50" />
              </div>
              <p>Nenhum caso ativo no momento.</p>
              <Button variant="link" asChild className="mt-2">
                <Link to="/new-request">Iniciar um novo pedido</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{order.patientName}</span>
                      <span className="text-xs text-muted-foreground">({order.id})</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {order.workType} • {order.material} • Criado em{' '}
                      {format(new Date(order.createdAt), 'dd MMM, HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <StatusBadge status={order.status} />
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/order/${order.id}`}>
                        <ArrowRight className="w-4 h-4" />
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
