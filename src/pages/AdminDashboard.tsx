import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import {
  PlusCircle,
  ArrowRight,
  Activity,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  RefreshCw,
  Inbox,
  AlertTriangle,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfDay,
  startOfDay,
  isWithinInterval,
  isSameDay,
  differenceInDays,
  addDays,
  differenceInMonths,
  addMonths,
  subDays,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatBRL } from '@/lib/financial'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

export default function AdminDashboard() {
  const { orders, pendingUsers, loading } = useAppStore()

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  })

  const [repetitions, setRepetitions] = useState<any[]>([])
  const [loadingReps, setLoadingReps] = useState(true)

  useEffect(() => {
    async function fetchReps() {
      setLoadingReps(true)
      const { data } = await supabase
        .from('order_repetitions')
        .select('id, estimated_loss, logged_at')
      if (data) setRepetitions(data)
      setLoadingReps(false)
    }
    fetchReps()
  }, [])

  const filteredOrders = useMemo(() => {
    if (!dateRange?.from) return orders
    return orders.filter((o) => {
      const d = new Date(o.createdAt)
      if (dateRange.to) {
        return isWithinInterval(d, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        })
      }
      return isSameDay(d, dateRange.from)
    })
  }, [orders, dateRange])

  const filteredRepetitions = useMemo(() => {
    if (!dateRange?.from) return repetitions
    return repetitions.filter((r) => {
      const d = new Date(r.logged_at)
      if (dateRange.to) {
        return isWithinInterval(d, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        })
      }
      return isSameDay(d, dateRange.from)
    })
  }, [repetitions, dateRange])

  const activeOrders = filteredOrders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'completed' && o.status !== 'cancelled',
  )

  const completedOrders = filteredOrders.filter(
    (o) => o.status === 'completed' || o.status === 'delivered',
  )

  const repetitionsCount = filteredRepetitions.length
  const repetitionsLoss = filteredRepetitions.reduce(
    (sum, r) => sum + (Number(r.estimated_loss) || 0),
    0,
  )

  const recentOrders = useMemo(() => {
    return [...filteredOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [filteredOrders])

  const stats = [
    {
      label: 'Casos em Produção',
      value: activeOrders.length,
      icon: Activity,
      color: 'text-primary',
    },
    {
      label: 'Casos Concluídos',
      value: completedOrders.length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    {
      label: 'Repetições (Retornos)',
      value: repetitionsCount,
      subValue: `Prejuízo: ${formatBRL(repetitionsLoss)}`,
      icon: AlertTriangle,
      color: 'text-rose-500',
    },
    {
      label: 'Pendentes de Ciente',
      value: filteredOrders.filter((o) => !o.isAcknowledged).length,
      icon: Clock,
      color: 'text-amber-500',
    },
  ]

  const chartData = useMemo(() => {
    let start: Date
    let end: Date

    if (!dateRange?.from) {
      start = subDays(new Date(), 30)
      end = new Date()
    } else {
      start = dateRange.from
      end = dateRange.to || dateRange.from
    }

    const days = differenceInDays(end, start)

    if (days <= 31) {
      const data = []
      for (let i = 0; i <= days; i++) {
        const d = addDays(start, i)
        data.push({
          date: format(d, 'yyyy-MM-dd'),
          label: format(d, 'dd/MM'),
          count: 0,
        })
      }
      filteredOrders.forEach((o) => {
        const oDate = format(new Date(o.createdAt), 'yyyy-MM-dd')
        const day = data.find((d) => d.date === oDate)
        if (day) day.count++
      })
      return data
    } else {
      const data = []
      const months = differenceInMonths(end, start)
      for (let i = 0; i <= months; i++) {
        const d = addMonths(start, i)
        data.push({
          date: format(d, 'yyyy-MM'),
          label: format(d, 'MMM/yy', { locale: ptBR }),
          count: 0,
        })
      }
      filteredOrders.forEach((o) => {
        const oDate = format(new Date(o.createdAt), 'yyyy-MM')
        const month = data.find((d) => d.date === oDate)
        if (month) month.count++
      })
      return data
    }
  }, [filteredOrders, dateRange])

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Painel Administrativo</h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Visão geral do laboratório e métricas rápidas.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full xl:w-auto">
          <DatePickerWithRange
            date={dateRange}
            setDate={setDateRange}
            className="w-full lg:w-auto shrink-0"
          />
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto shrink-0">
            <Button
              asChild
              className="flex-1 sm:flex-none h-10 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-sm"
            >
              <Link to="/new-request?type=repetition">Repetições</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 sm:flex-none h-10 border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2 font-bold shadow-sm"
            >
              <Link to="/new-request?type=adjustment">
                <RefreshCw className="w-4 h-4 hidden sm:block" /> Ajustes
              </Link>
            </Button>
            <Button asChild className="flex-1 sm:flex-none h-10 font-bold shadow-sm">
              <Link to="/new-request">
                <PlusCircle className="w-4 h-4 mr-2 hidden sm:block" /> Novo Pedido
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {pendingUsers.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm sm:text-base">
              Você tem {pendingUsers.length} usuário(s) aguardando aprovação de cadastro.
            </span>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-white dark:bg-transparent shrink-0"
          >
            <Link to="/users">Avaliar Usuários</Link>
          </Button>
        </div>
      )}

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
              {loading || loadingReps ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div>
                  <div className="text-4xl font-bold">{s.value}</div>
                  {s.subValue && (
                    <p className="text-xs font-medium text-muted-foreground mt-1 tracking-wide">
                      {s.subValue}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-subtle lg:col-span-2">
          <CardHeader>
            <CardTitle>Entrada de Pedidos (Período Selecionado)</CardTitle>
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
              <CardTitle>Pedidos no Período</CardTitle>
              <CardDescription>
                Lista de pedidos recentes conforme o filtro selecionado.
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
            <div className="text-center py-12 text-muted-foreground">
              Nenhum pedido encontrado no período.
            </div>
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
