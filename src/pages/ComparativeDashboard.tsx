import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { getOrderFinancials, PriceItem, formatBRL } from '@/lib/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { PieChart, TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react'
import { Navigate } from 'react-router-dom'

export default function ComparativeDashboard() {
  const { currentUser, orders, kanbanStages } = useAppStore()
  const [priceList, setPriceList] = useState<PriceItem[]>([])
  const [expenses, setExpenses] = useState<any[]>([])

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

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const getSectorStats = (sectorName: string) => {
    const sectorOrders = orders.filter((o) => o.sector === sectorName)
    const sectorExpenses = expenses.filter((e) => e.sector === sectorName)

    const revenue = sectorOrders.reduce((acc, o) => {
      const isCompletedThisMonth = o.history.some(
        (h: any) =>
          (h.status === 'completed' || h.status === 'delivered') &&
          new Date(h.date).getMonth() === currentMonth &&
          new Date(h.date).getFullYear() === currentYear,
      )
      if (isCompletedThisMonth) {
        return acc + getOrderFinancials(o, priceList, kanbanStages).totalCost
      }
      return acc
    }, 0)

    const expensesTotal = sectorExpenses.reduce((acc, e) => {
      const date = new Date(e.due_date + 'T00:00:00')
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        return acc + Number(e.amount)
      }
      return acc
    }, 0)

    const profit = revenue - expensesTotal
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0

    return { revenue, expenses: expensesTotal, profit, margin }
  }

  const statsSC = useMemo(
    () => getSectorStats('Soluções Cerâmicas'),
    [orders, expenses, priceList, kanbanStages, currentMonth, currentYear],
  )
  const statsSA = useMemo(
    () => getSectorStats('Studio Acrílico'),
    [orders, expenses, priceList, kanbanStages, currentMonth, currentYear],
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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <PieChart className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Dash Comparativo</h2>
          <p className="text-muted-foreground text-sm">
            Desempenho financeiro por laboratório (Mês Atual).
          </p>
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
          <CardTitle>Comparativo de Receitas vs Despesas</CardTitle>
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
