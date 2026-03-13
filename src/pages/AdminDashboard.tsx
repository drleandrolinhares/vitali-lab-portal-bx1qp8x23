import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import {
  Activity,
  Clock,
  CheckCircle2,
  PackageCheck,
  BarChart3,
  Trophy,
  Wallet,
  TrendingUp,
  ChevronRight,
  Medal,
  Radio,
} from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'

function Top10List({
  title,
  icon: Icon,
  description,
  data,
  metricKey,
  formatValue,
  colorClass,
  maxVal,
  emptyText,
}: any) {
  return (
    <Card
      className={cn('shadow-lg flex flex-col h-full overflow-hidden border-t-4', colorClass.border)}
    >
      <CardHeader className="pb-4 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-xl', colorClass.bg)}>
            <Icon className={cn('w-6 h-6', colorClass.text)} />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-16">
            <Icon className="w-12 h-12 mb-4 opacity-20" />
            <span>{emptyText}</span>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border/50">
            {data.map((dentist: any, index: number) => {
              const value = dentist[metricKey]
              const pct = maxVal > 0 ? (value / maxVal) * 100 : 0
              let rankIcon = null
              let rankClasses = 'text-muted-foreground bg-muted font-bold text-sm'

              if (index === 0) {
                rankIcon = <Trophy className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
                rankClasses =
                  'text-yellow-700 bg-yellow-500/20 font-black shadow-sm ring-1 ring-yellow-500/50 dark:text-yellow-400'
              } else if (index === 1) {
                rankIcon = <Medal className="w-4 h-4 text-slate-400 drop-shadow-sm" />
                rankClasses =
                  'text-slate-700 bg-slate-400/20 font-bold shadow-sm ring-1 ring-slate-400/50 dark:text-slate-300'
              } else if (index === 2) {
                rankIcon = <Medal className="w-4 h-4 text-orange-700 drop-shadow-sm" />
                rankClasses =
                  'text-orange-800 bg-orange-700/20 font-bold shadow-sm ring-1 ring-orange-700/50 dark:text-orange-500'
              }

              return (
                <Link
                  key={dentist.id}
                  to="/history"
                  className="group block relative p-4 hover:bg-muted/50 transition-all bg-background"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-transform group-hover:scale-110',
                        rankClasses,
                      )}
                    >
                      {rankIcon ? rankIcon : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-foreground truncate pr-2 group-hover:text-primary transition-colors">
                          {dentist.name}
                        </span>
                        <span className={cn('font-bold shrink-0 tabular-nums', colorClass.text)}>
                          {formatValue(value)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-1000 ease-out',
                              colorClass.bar,
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        {dentist.clinic && (
                          <span className="text-xs text-muted-foreground truncate max-w-[120px] shrink-0">
                            {dentist.clinic}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -ml-1 group-hover:translate-x-1 duration-200" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { orders, selectedLab, currentUser, checkPermission, updateSetting } = useAppStore()

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          selectedLab === 'Todos' ||
          (o.sector || '').toLowerCase() === (selectedLab || '').toLowerCase(),
      ),
    [orders, selectedLab],
  )

  const metrics = useMemo(
    () => ({
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === 'pending' || o.kanbanStage === 'TRIAGEM')
        .length,
      production: filteredOrders.filter((o) => o.status === 'in_production').length,
      completed: filteredOrders.filter((o) => o.status === 'completed' || o.status === 'delivered')
        .length,
    }),
    [filteredOrders],
  )

  const rankings = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const map = new Map<string, any>()

    filteredOrders.forEach((o) => {
      if (!o.dentistId) return
      if (!map.has(o.dentistId)) {
        map.set(o.dentistId, {
          id: o.dentistId,
          name: o.dentistName || 'Desconhecido',
          clinic: o.dentistClinic || '',
          totalOrders: 0,
          totalValue: 0,
          recentOrders: 0,
        })
      }
      const stat = map.get(o.dentistId)!
      stat.totalOrders += 1
      stat.totalValue += Number(o.basePrice) || 0
      if (new Date(o.createdAt) >= thirtyDaysAgo) stat.recentOrders += 1
    })

    const arr = Array.from(map.values())
    const byVolume = [...arr].sort((a, b) => b.totalOrders - a.totalOrders).slice(0, 10)
    const byValue = [...arr].sort((a, b) => b.totalValue - a.totalValue).slice(0, 10)
    const byFreq = [...arr].sort((a, b) => b.recentOrders - a.recentOrders).slice(0, 10)

    return {
      byVolume,
      maxVolume: byVolume[0]?.totalOrders || 0,
      byValue,
      maxValue: byValue[0]?.totalValue || 0,
      byFreq,
      maxFreq: byFreq[0]?.recentOrders || 0,
    }
  }, [filteredOrders])

  const canView =
    currentUser?.role === 'admin' ||
    currentUser?.role === ('master' as any) ||
    checkPermission('dashboards', 'view_general')

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-destructive mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground">Você não tem permissão para acessar o dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-screen-2xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl shadow-inner border border-primary/20">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase">
              Dashboard Gerencial
            </h2>
            <p className="text-muted-foreground">
              Visão geral de desempenho e parceiros de destaque.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm w-full sm:w-auto justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
            Sincronização em Tempo Real Ativa
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-subtle border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Novos Pedidos (Total)
            </CardTitle>
            <Activity className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-500 transition-all duration-500">
              {metrics.total}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-amber-500 hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Na Triagem
            </CardTitle>
            <Clock className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-500 transition-all duration-500">
              {metrics.pending}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-indigo-500 hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Em Produção
            </CardTitle>
            <PackageCheck className="w-5 h-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 transition-all duration-500">
              {metrics.production}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-emerald-500 hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Finalizados
            </CardTitle>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 transition-all duration-500">
              {metrics.completed}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-bold tracking-tight">Top 10 Parceiros</h3>
        <div className="h-px flex-1 bg-border/50 ml-4"></div>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        <Top10List
          title="Volume Total"
          description="Dentistas com mais pedidos"
          icon={Activity}
          data={rankings.byVolume}
          metricKey="totalOrders"
          formatValue={(v: number) => `${v} ped.`}
          maxVal={rankings.maxVolume}
          emptyText="Sem dados de volume"
          colorClass={{
            bg: 'bg-blue-500/10',
            text: 'text-blue-500',
            bar: 'bg-blue-500',
            border: 'border-t-blue-500',
          }}
        />
        <Top10List
          title="Receita Bruta"
          description="Maior valor em pedidos (c/ descontos)"
          icon={Wallet}
          data={rankings.byValue}
          metricKey="totalValue"
          formatValue={formatCurrency}
          maxVal={rankings.maxValue}
          emptyText="Sem dados financeiros"
          colorClass={{
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-500',
            bar: 'bg-emerald-500',
            border: 'border-t-emerald-500',
          }}
        />
        <Top10List
          title="Frequência Mensal"
          description="Pedidos nos últimos 30 dias"
          icon={TrendingUp}
          data={rankings.byFreq}
          metricKey="recentOrders"
          formatValue={(v: number) => `${v} ped.`}
          maxVal={rankings.maxFreq}
          emptyText="Nenhum pedido recente"
          colorClass={{
            bg: 'bg-indigo-500/10',
            text: 'text-indigo-500',
            bar: 'bg-indigo-500',
            border: 'border-t-indigo-500',
          }}
        />
      </div>
    </div>
  )
}
