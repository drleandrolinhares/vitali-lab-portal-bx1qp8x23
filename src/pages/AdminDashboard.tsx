import { Link } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import {
  PlusCircle,
  ArrowRight,
  Activity,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatBRL, getOrderFinancials } from '@/lib/financial'
import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

export default function AdminDashboard() {
  const { orders, currentUser, pendingUsers, loading } = useAppStore()

  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'completed' && o.status !== 'cancelled',
  )

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [orders])

  const stats = [
    {
      label: 'Casos Ativos',
      value: activeOrders.length,
      icon: Activity,
      color: 'text-primary',
    },
    {
      label: 'Pendentes de Ciente',
      value: orders.filter((o) => !o.isAcknowledged).length,
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      label: 'Concluídos (Mês)',
      value: orders.filter(
        (o) =>
          (o.status === 'completed' || o.status === 'delivered') &&
          new Date(o.createdAt).getMonth() === new Date().getMonth(),
      ).length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    {
      label: 'Aprovações Pendentes',
      value: pendingUsers.length,
      icon: Users,
      color: 'text-blue-500',
    },
  ]

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        date: format(d, 'yyyy-MM-dd'),
        label: format(d, 'dd/MM'),
        count: 0,
      }
    })

    orders.forEach((o) => {
      const oDate = format(new Date(o.createdAt), 'yyyy-MM-dd')
      const day = last7Days.find((d) => d.date === oDate)
      if (day) day.count++
    })

    return last7Days
  }, [orders])

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Painel Administrativo</h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Visão geral do laboratório e métricas rápidas.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto h-11">
          <Button
            asChild
            variant="outline"
            className="flex-1 sm:flex-none h-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2"
          >
            <Link to="/new-request?type=adjustment">
              <RefreshCw className="w-5 h-5" /> Retorno{' '}
              <span className="hidden lg:inline">para Ajustes</span>
            </Link>
          </Button>
          <Button asChild className="flex-1 sm:flex-none h-full gap-2 shadow-sm">
            <Link to="/new-request">
              <PlusCircle className="w-5 h-5" /> Novo Pedido
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={i} className="shadow-subtle hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {s.label}
              </CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="text-4xl font-bold">{s.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-subtle lg:col-span-2">
          <CardHeader>
            <CardTitle>Entrada de Pedidos (Últimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ChartContainer
                config={{ count: { color: 'hsl(var(--primary))' } }}
                className="h-[250px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle flex flex-col">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link to="/kanban">
                <Activity className="mr-3 h-5 w-5 text-primary" /> Kanban de Produção
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link to="/app">
                <Inbox className="mr-3 h-5 w-5 text-primary" /> Caixa de Entrada
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link to="/financial">
                <FileText className="mr-3 h-5 w-5 text-primary" /> Faturamento
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link to="/users">
                <Users className="mr-3 h-5 w-5 text-primary" /> Gerenciar Clientes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="bg-muted/10 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Últimos Pedidos</CardTitle>
              <CardDescription>
                Os pedidos mais recentes que entraram no laboratório.
              </CardDescription>
            </div>
            <Button variant="link" asChild>
              <Link to="/history">Ver todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Nenhum pedido encontrado.</div>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className={cn(
                    'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-4',
                    order.isAdjustmentReturn ? 'bg-yellow-50/50 dark:bg-yellow-950/20' : '',
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {order.isAdjustmentReturn ? (
                        <RefreshCw className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'font-semibold',
                            order.isAdjustmentReturn ? 'text-yellow-950 dark:text-yellow-50' : '',
                          )}
                        >
                          {order.patientName}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-mono px-2 py-0.5 rounded',
                            order.isAdjustmentReturn
                              ? 'bg-yellow-200 text-yellow-900'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {order.friendlyId}
                        </span>
                        {order.isAdjustmentReturn && (
                          <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100 border border-yellow-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Ajuste
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        <span className="font-medium text-foreground/70">{order.dentistName}</span>{' '}
                        • {order.workType} • {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <StatusBadge status={order.status} className="px-3 py-1 shrink-0" />
                    <Button variant="ghost" size="icon" asChild className="rounded-full shrink-0">
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
