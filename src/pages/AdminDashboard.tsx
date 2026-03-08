import { useMemo, useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Activity, Clock, CheckCircle2, PackageCheck, BarChart3, Trophy } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, cn } from '@/lib/utils'

export default function AdminDashboard() {
  const { orders, selectedLab, currentUser } = useAppStore()
  const [rankingSort, setRankingSort] = useState<'volume' | 'value' | 'frequency'>('volume')

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => selectedLab === 'Todos' || o.sector === selectedLab)
  }, [orders, selectedLab])

  const metrics = useMemo(() => {
    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === 'pending').length,
      production: filteredOrders.filter((o) => o.status === 'in_production').length,
      completed: filteredOrders.filter((o) => o.status === 'completed' || o.status === 'delivered')
        .length,
    }
  }, [filteredOrders])

  const { dentistRanking, maxValues } = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const map = new Map<
      string,
      {
        id: string
        name: string
        clinic: string
        totalOrders: number
        totalValue: number
        recentOrders: number
      }
    >()

    filteredOrders.forEach((o) => {
      if (!o.dentistId) return

      const isRecent = new Date(o.createdAt) >= thirtyDaysAgo

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
      stat.totalValue += Number(o.clearedBalance) || 0
      if (isRecent) {
        stat.recentOrders += 1
      }
    })

    const arr = Array.from(map.values())

    let maxVol = 0
    let maxVal = 0
    let maxFreq = 0

    arr.forEach((a) => {
      if (a.totalOrders > maxVol) maxVol = a.totalOrders
      if (a.totalValue > maxVal) maxVal = a.totalValue
      if (a.recentOrders > maxFreq) maxFreq = a.recentOrders
    })

    arr.sort((a, b) => {
      if (rankingSort === 'volume') return b.totalOrders - a.totalOrders
      if (rankingSort === 'value') return b.totalValue - a.totalValue
      if (rankingSort === 'frequency') return b.recentOrders - a.recentOrders
      return 0
    })

    return { dentistRanking: arr, maxValues: { volume: maxVol, value: maxVal, frequency: maxFreq } }
  }, [filteredOrders, rankingSort])

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-destructive mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar o dashboard gerencial.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Dashboard Gerencial</h2>
          <p className="text-muted-foreground text-sm">Visão geral de desempenho e produção.</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="ranking">Ranking de Parceiros</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-subtle border-l-4 border-l-blue-500">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Total de Pedidos
                </CardTitle>
                <Activity className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{metrics.total}</div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-l-4 border-l-amber-500">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Na Triagem
                </CardTitle>
                <Clock className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{metrics.pending}</div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-l-4 border-l-indigo-500">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Em Produção
                </CardTitle>
                <PackageCheck className="w-4 h-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">{metrics.production}</div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Finalizados
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{metrics.completed}</div>
              </CardContent>
            </Card>
          </div>

          {metrics.total === 0 && (
            <Card className="shadow-subtle mt-8">
              <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                Nenhum dado encontrado para o laboratório selecionado.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <Card className="shadow-subtle">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Ranking de Parceiros</CardTitle>
                <CardDescription>
                  Acompanhe os dentistas mais ativos e sua contribuição.
                </CardDescription>
              </div>
              <div className="w-full md:w-64">
                <Select value={rankingSort} onValueChange={(v: any) => setRankingSort(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volume">Volume de Pedidos</SelectItem>
                    <SelectItem value="value">Valor Financeiro</SelectItem>
                    <SelectItem value="frequency">Frequência (30 dias)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-center">Posição</TableHead>
                      <TableHead>Dentista</TableHead>
                      <TableHead
                        className={cn(rankingSort === 'volume' && 'text-primary font-bold')}
                      >
                        Volume Total
                      </TableHead>
                      <TableHead
                        className={cn(rankingSort === 'value' && 'text-primary font-bold')}
                      >
                        Valor Total
                      </TableHead>
                      <TableHead
                        className={cn(rankingSort === 'frequency' && 'text-primary font-bold')}
                      >
                        Freq. (30 dias)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dentistRanking.map((dentist, index) => (
                      <TableRow key={dentist.id} className="group hover:bg-muted/30">
                        <TableCell className="text-center align-middle">
                          {index === 0 ? (
                            <Trophy className="w-5 h-5 text-amber-500 mx-auto drop-shadow-sm" />
                          ) : index === 1 ? (
                            <Trophy className="w-5 h-5 text-slate-400 mx-auto drop-shadow-sm" />
                          ) : index === 2 ? (
                            <Trophy className="w-5 h-5 text-amber-700 mx-auto drop-shadow-sm" />
                          ) : (
                            <span className="text-muted-foreground font-medium text-sm">
                              {index + 1}º
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{dentist.name}</span>
                            {dentist.clinic && (
                              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {dentist.clinic}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                'w-8 text-right',
                                rankingSort === 'volume' && 'font-bold',
                              )}
                            >
                              {dentist.totalOrders}
                            </span>
                            {rankingSort === 'volume' &&
                              dentist.totalOrders > 0 &&
                              maxValues.volume > 0 && (
                                <div className="h-2 w-24 bg-primary/10 rounded-full overflow-hidden hidden sm:block">
                                  <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{
                                      width: `${(dentist.totalOrders / maxValues.volume) * 100}%`,
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                'w-24 text-right',
                                rankingSort === 'value' && 'font-bold',
                              )}
                            >
                              {formatCurrency(dentist.totalValue)}
                            </span>
                            {rankingSort === 'value' &&
                              dentist.totalValue > 0 &&
                              maxValues.value > 0 && (
                                <div className="h-2 w-24 bg-blue-500/10 rounded-full overflow-hidden hidden sm:block">
                                  <div
                                    className="h-full bg-blue-500 transition-all duration-500"
                                    style={{
                                      width: `${(dentist.totalValue / maxValues.value) * 100}%`,
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                'w-12 text-right',
                                rankingSort === 'frequency' && 'font-bold',
                              )}
                            >
                              {dentist.recentOrders}
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:inline-block">
                              pedidos/mês
                            </span>
                            {rankingSort === 'frequency' &&
                              dentist.recentOrders > 0 &&
                              maxValues.frequency > 0 && (
                                <div className="h-2 w-24 bg-emerald-500/10 rounded-full overflow-hidden hidden sm:block">
                                  <div
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    style={{
                                      width: `${(dentist.recentOrders / maxValues.frequency) * 100}%`,
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {dentistRanking.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center">
                            <BarChart3 className="w-8 h-8 mb-2 opacity-20" />
                            <span>Nenhum dado de parceiro encontrado.</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
