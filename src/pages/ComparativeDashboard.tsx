import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  getOrderFinancials,
  PriceItem,
  formatBRL,
  generateMonthOptions,
  getOrderCompletionDate,
} from '@/lib/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { PieChart, TrendingUp, TrendingDown, Wallet, DollarSign, CalendarDays } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Navigate } from 'react-router-dom'
import { format } from 'date-fns'

export default function ComparativeDashboard() {
  const { currentUser, orders, kanbanStages, dreCategories } = useAppStore()
  const [priceList, setPriceList] = useState<PriceItem[]>([])
  const [expenses, setExpenses] = useState<any[]>([])

  const monthOptions = useMemo(() => generateMonthOptions(), [])
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'))

  useEffect(() => {
    supabase
      .from('price_list')
      .select('id, work_type, sector, price_stages(*)')
      .then(({ data }) => {
        if (data) setPriceList(data as PriceItem[])
      })
    supabase
      .from('expenses')
      .select('*')
      .then(({ data }) => {
        if (data) setExpenses(data)
      })
  }, [])

  const revenueCategories = useMemo(() => {
    return dreCategories.filter((c) => c.category_type === 'revenue').map((c) => c.name)
  }, [dreCategories])

  const getSectorStats = (sectorName: string) => {
    const sectorOrders = orders.filter(
      (o) => (o.sector || '').toUpperCase() === sectorName.toUpperCase(),
    )
    const sectorExpenses = expenses.filter(
      (e) => (e.sector || '').toUpperCase() === sectorName.toUpperCase(),
    )

    const revenue = sectorOrders.reduce((acc, o) => {
      const isFullyCompleted = o.status === 'completed' || o.status === 'delivered'
      if (!isFullyCompleted) return acc

      const compDate = getOrderCompletionDate(o)
      if (compDate && format(compDate, 'yyyy-MM') === selectedMonth) {
        return acc + getOrderFinancials(o, priceList, kanbanStages).completedCost
      }
      return acc
    }, 0)

    const expensesTotal = sectorExpenses.reduce((acc, e) => {
      if (e.due_date && e.due_date.startsWith(selectedMonth)) {
        const isRevenue =
          revenueCategories.includes(e.dre_category) ||
          e.dre_category === 'Receita' ||
          e.category === 'Serviços Realizados'

        if (!isRevenue) {
          return acc + Number(e.amount)
        }
      }
      return acc
    }, 0)

    const profit = revenue - expensesTotal
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0

    return { revenue, expenses: expensesTotal, profit, margin }
  }

  const statsSC = useMemo(
    () => getSectorStats('Soluções Cerâmicas'),
    [orders, expenses, priceList, kanbanStages, selectedMonth, revenueCategories],
  )
  const statsSA = useMemo(
    () => getSectorStats('Studio Acrílico'),
    [orders, expenses, priceList, kanbanStages, selectedMonth, revenueCategories],
  )

  const chartData = [
    { name: 'Soluções Cerâmicas', Receitas: statsSC.revenue, Despesas: statsSC.expenses },
    { name: 'Studio Acrílico', Receitas: statsSA.revenue, Despesas: statsSA.expenses },
  ]

  const chartConfig = {
    Receitas: { label: 'Receitas (R$)', color: 'hsl(var(--emerald-500))' },
    Despesas: { label: 'Despesas (R$)', color: 'hsl(var(--red-500))' },
  }

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'receptionist')
    return <Navigate to="/" replace />

  const selectedMonthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label

  const renderKPIs = (title: string, stats: any) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-primary/80 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-sm border-l-2 border-l-emerald-500">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase flex items-center justify-between">
              Receitas <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg font-bold text-emerald-600">{formatBRL(stats.revenue)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-2 border-l-red-500">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase flex items-center justify-between">
              Despesas <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg font-bold text-red-600">{formatBRL(stats.expenses)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-2 border-l-blue-500">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase flex items-center justify-between">
              Lucro Líquido <Wallet className="w-3.5 h-3.5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg font-bold text-blue-600">{formatBRL(stats.profit)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-2 border-l-purple-500">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase flex items-center justify-between">
              Rentabilidade <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg font-bold text-purple-600">{stats.margin.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <PieChart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
              Dashboard Comparativo Interno
            </h2>
            <p className="text-muted-foreground text-sm">
              Desempenho financeiro por laboratório no período selecionado.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm w-full sm:w-auto">
          <CalendarDays className="w-4 h-4 text-muted-foreground ml-2" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-[200px] border-0 bg-transparent shadow-none focus:ring-0">
              <SelectValue placeholder="Selecione o Mês" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          {renderKPIs('Soluções Cerâmicas', statsSC)}
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          {renderKPIs('Studio Acrílico', statsSA)}
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Comparativo de Receitas vs Despesas ({selectedMonthLabel})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full mt-4">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(val) => `R$ ${val}`}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ fill: 'transparent' }}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="Receitas"
                    fill="var(--color-Receitas)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar
                    dataKey="Despesas"
                    fill="var(--color-Despesas)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
