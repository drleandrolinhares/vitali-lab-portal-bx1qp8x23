import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { isWithinInterval, startOfDay, endOfDay, subDays } from 'date-fns'
import {
  Wrench,
  CheckCircle2,
  TrendingUp,
  Users,
  AlertCircle,
  ArrowUpRight,
  Clock,
  CalendarDays,
  DollarSign,
} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'

const RankingList = ({ items, title, icon: Icon, valueKey, valueFormatter, colorClass }: any) => (
  <Card className="shadow-subtle flex flex-col hover:shadow-md transition-shadow">
    <CardHeader className="pb-3 border-b bg-muted/10">
      <CardTitle className="text-base flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClass}`} /> {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-4 flex-1">
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item: any, index: number) => (
            <div key={item.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-5 text-xs font-bold text-muted-foreground text-right">
                  {index + 1}.
                </div>
                <Avatar className="w-8 h-8 border border-border/50 group-hover:border-primary/50 transition-colors">
                  <AvatarImage src={item.avatar} className="object-cover" />
                  <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                    {item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm truncate max-w-[140px]" title={item.name}>
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-sm bg-muted px-2 py-0.5 rounded-md">
                {valueFormatter ? valueFormatter(item[valueKey]) : item[valueKey]}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-xs text-muted-foreground">Sem dados no período</div>
        )}
      </div>
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  const { currentUser, orders } = useAppStore()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(startOfDay(new Date()), 30),
    to: endOfDay(new Date()),
  })

  const [profiles, setProfiles] = useState<any[]>([])
  const [settlements, setSettlements] = useState<any[]>([])
  const [priceList, setPriceList] = useState<any[]>([])
  const [loadingMetrics, setLoadingMetrics] = useState(false)

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const fetchData = async () => {
        setLoadingMetrics(true)
        const [profilesRes, settlementsRes, priceRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('role', 'dentist'),
          supabase.from('settlements').select('*'),
          supabase.from('price_list').select('*'),
        ])
        if (profilesRes.data) setProfiles(profilesRes.data)
        if (settlementsRes.data) setSettlements(settlementsRes.data)
        if (priceRes.data) setPriceList(priceRes.data)
        setLoadingMetrics(false)
      }
      fetchData()
    }
  }, [currentUser])

  // Formatting helper
  const formatBRL = useCallback(
    (val: number) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val),
    [],
  )

  // Parse price logic
  const getPriceForOrder = useCallback(
    (workType: string) => {
      const item = priceList.find((p) => p.work_type === workType)
      if (!item || !item.price) return 0
      // Try to parse R$ 150,00 to 150.00
      const parsed = parseFloat(item.price.replace(/[R$\s.]/g, '').replace(',', '.'))
      return isNaN(parsed) ? 0 : parsed
    },
    [priceList],
  )

  const { filteredOrders, filteredSettlements } = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to)
      return { filteredOrders: orders, filteredSettlements: settlements }

    const start = startOfDay(dateRange.from)
    const end = endOfDay(dateRange.to)

    return {
      filteredOrders: orders.filter((o) => isWithinInterval(new Date(o.createdAt), { start, end })),
      filteredSettlements: settlements.filter((s) =>
        isWithinInterval(new Date(s.created_at), { start, end }),
      ),
    }
  }, [orders, settlements, dateRange])

  // KPIs Summary
  const pending = filteredOrders.filter((o) => o.status === 'pending').length
  const inProgress = filteredOrders.filter((o) => o.status === 'in_production').length
  const completedCount = filteredOrders.filter(
    (o) => o.status === 'completed' || o.status === 'delivered',
  ).length

  const turnaroundTimes = filteredOrders
    .map((o) => {
      const endEvent =
        o.history.find((h: any) => h.status === 'delivered') ||
        o.history.find((h: any) => h.status === 'completed')
      if (!endEvent) return null
      return Math.max(
        0,
        (new Date(endEvent.date).getTime() - new Date(o.createdAt).getTime()) / (1000 * 3600 * 24),
      )
    })
    .filter((t): t is number => t !== null)
  const avgTurnaround = turnaroundTimes.length
    ? (turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length).toFixed(1)
    : '-'

  // Rankings Calculation
  const rankings = useMemo(() => {
    const map: Record<string, any> = {}

    // Init map with all dentists
    profiles.forEach((p) => {
      map[p.id] = {
        id: p.id,
        name: p.name,
        avatar: p.avatar_url,
        incoming: 0,
        completed: 0,
        generatedRev: 0,
        paidRev: 0,
        onTimePayments: 0,
        latePayments: 0,
      }
    })

    // Process Orders for Incoming, Completed, Generated Revenue
    filteredOrders.forEach((o) => {
      if (!map[o.dentistId]) return
      map[o.dentistId].incoming += 1
      if (o.status === 'completed' || o.status === 'delivered') {
        map[o.dentistId].completed += 1
      }
      map[o.dentistId].generatedRev += getPriceForOrder(o.workType)
    })

    // Process Settlements for Paid Revenue, On-Time, Late Payments
    filteredSettlements.forEach((s) => {
      if (!map[s.dentist_id]) return
      map[s.dentist_id].paidRev += Number(s.amount)

      const d = profiles.find((p) => p.id === s.dentist_id)
      const dueDate = d?.payment_due_date || 5
      const settlementDay = new Date(s.created_at).getDate()

      if (settlementDay <= dueDate) {
        map[s.dentist_id].onTimePayments += 1
      } else {
        map[s.dentist_id].latePayments += 1
      }
    })

    const arr = Object.values(map)
    return {
      topIncoming: [...arr]
        .sort((a, b) => b.incoming - a.incoming)
        .slice(0, 5)
        .filter((i) => i.incoming > 0),
      topCompleted: [...arr]
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 5)
        .filter((i) => i.completed > 0),
      topGenRev: [...arr]
        .sort((a, b) => b.generatedRev - a.generatedRev)
        .slice(0, 5)
        .filter((i) => i.generatedRev > 0),
      topPaidRev: [...arr]
        .sort((a, b) => b.paidRev - a.paidRev)
        .slice(0, 5)
        .filter((i) => i.paidRev > 0),
      topOnTime: [...arr]
        .sort((a, b) => b.onTimePayments - a.onTimePayments)
        .slice(0, 5)
        .filter((i) => i.onTimePayments > 0),
      topLate: [...arr]
        .sort((a, b) => b.latePayments - a.latePayments)
        .slice(0, 5)
        .filter((i) => i.latePayments > 0),
    }
  }, [filteredOrders, filteredSettlements, profiles, getPriceForOrder])

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border shadow-subtle">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Painel de Performance</h2>
          <p className="text-muted-foreground text-sm">
            Métricas de produção e rankings de dentistas.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Label className="text-xs text-muted-foreground block mb-1.5 ml-1">
            Filtro de Período
          </Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-subtle border-l-4 border-l-amber-500 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-amber-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Novos Casos</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando produção</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-blue-500 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Em Produção</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">Sendo trabalhados</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-emerald-500 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-emerald-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Concluídos/Entregues</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-primary overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-primary">
              {avgTurnaround}{' '}
              <span className="text-lg text-muted-foreground font-normal">dias</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Para conclusão</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-foreground/80 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Rankings de Dentistas
        </h3>

        {loadingMetrics ? (
          <div className="h-64 flex items-center justify-center border rounded-xl bg-muted/20">
            <div className="text-muted-foreground animate-pulse">Calculando métricas...</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <RankingList
              title="Mais Casos Enviados"
              icon={ArrowUpRight}
              colorClass="text-blue-500"
              items={rankings.topIncoming}
              valueKey="incoming"
              valueFormatter={(v: number) => `${v} casos`}
            />
            <RankingList
              title="Mais Casos Concluídos"
              icon={CheckCircle2}
              colorClass="text-emerald-500"
              items={rankings.topCompleted}
              valueKey="completed"
              valueFormatter={(v: number) => `${v} casos`}
            />
            <RankingList
              title="Maior Receita Gerada"
              icon={TrendingUp}
              colorClass="text-purple-500"
              items={rankings.topGenRev}
              valueKey="generatedRev"
              valueFormatter={formatBRL}
            />
            <RankingList
              title="Maior Faturamento Pago"
              icon={DollarSign}
              colorClass="text-emerald-600"
              items={rankings.topPaidRev}
              valueKey="paidRev"
              valueFormatter={formatBRL}
            />
            <RankingList
              title="Pagamentos em Dia"
              icon={Clock}
              colorClass="text-blue-500"
              items={rankings.topOnTime}
              valueKey="onTimePayments"
              valueFormatter={(v: number) => `${v} pgts`}
            />
            <RankingList
              title="Pagamentos em Atraso"
              icon={CalendarDays}
              colorClass="text-red-500"
              items={rankings.topLate}
              valueKey="latePayments"
              valueFormatter={(v: number) => `${v} atrasos`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
