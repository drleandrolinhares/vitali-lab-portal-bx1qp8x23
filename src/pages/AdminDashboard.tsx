import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useMemo } from 'react'
import { subDays, isAfter, differenceInDays } from 'date-fns'
import { Wrench, CheckCircle2, TrendingUp, Users, AlertCircle } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Label } from '@/components/ui/label'

export default function AdminDashboard() {
  const { currentUser, orders } = useAppStore()
  const [dateRange, setDateRange] = useState('30')
  const [dentistFilter, setDentistFilter] = useState('all')

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const filteredOrders = useMemo(() => {
    let filtered = orders

    if (dateRange !== 'all') {
      const days = parseInt(dateRange, 10)
      const cutoff = subDays(new Date(), days)
      filtered = filtered.filter((o) => isAfter(new Date(o.createdAt), cutoff))
    }

    if (dentistFilter !== 'all') {
      filtered = filtered.filter((o) => o.dentistName === dentistFilter)
    }

    return filtered
  }, [orders, dateRange, dentistFilter])

  const pending = filteredOrders.filter((o) => o.status === 'pending').length
  const inProgress = filteredOrders.filter((o) => o.status === 'in_production').length
  const completed = filteredOrders.filter(
    (o) => o.status === 'completed' || o.status === 'delivered',
  ).length

  const turnaroundTimes = filteredOrders
    .map((o) => {
      const endEvent =
        o.history.find((h) => h.status === 'delivered') ||
        o.history.find((h) => h.status === 'completed')
      if (!endEvent) return null
      return Math.max(0, differenceInDays(new Date(endEvent.date), new Date(o.createdAt)))
    })
    .filter((t): t is number => t !== null)

  const avgTurnaround = turnaroundTimes.length
    ? (turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length).toFixed(1)
    : '-'

  const dentistCounts = filteredOrders.reduce(
    (acc, o) => {
      acc[o.dentistName] = (acc[o.dentistName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topDentists = Object.entries(dentistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const allDentists = Array.from(new Set(orders.map((o) => o.dentistName))).sort()

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Painel Gerencial</h2>
          <p className="text-muted-foreground">
            Visão geral do desempenho e métricas do laboratório.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Período</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-primary/20 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="all">Todo o período</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Dentista</Label>
            <Select value={dentistFilter} onValueChange={setDentistFilter}>
              <SelectTrigger className="w-full sm:w-56 bg-white border-primary/20 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Todos os Dentistas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Dentistas</SelectItem>
                {allDentists.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-subtle border-l-4 border-l-amber-500 overflow-hidden relative group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-amber-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Novos Casos (Pendentes)</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando produção</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-blue-500 overflow-hidden relative group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Em Produção</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">Sendo trabalhados</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-emerald-500 overflow-hidden relative group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-emerald-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Casos Finalizados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{completed}</div>
            <p className="text-xs text-muted-foreground mt-1">Concluídos ou Entregues</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-primary overflow-hidden relative group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-primary">
              {avgTurnaround}{' '}
              <span className="text-lg text-muted-foreground font-normal">dias</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Para conclusão de casos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Top Dentistas
            </CardTitle>
            <CardDescription>
              Dentistas com maior volume de casos no período selecionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDentists.length > 0 ? (
                topDentists.map(([name, count], index) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">{name}</span>
                    </div>
                    <span className="font-bold text-lg">
                      {count}{' '}
                      <span className="text-xs font-normal text-muted-foreground">casos</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                  Nenhum dado para o período selecionado.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
