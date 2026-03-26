import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/StatusBadge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Loader2,
  MessageCircle,
  Filter,
  ListChecks,
  CheckCircle2,
  Clock,
  MonitorPlay,
  Minimize2,
} from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'
import { cn } from '@/lib/utils'

export default function HistoryPage() {
  const { orders, currentUser, checkPermission, effectiveRole, refreshOrders } = useAppStore()
  const [search, setSearch] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [dentistFilter, setDentistFilter] = useState<string>('all')
  const [isTvMode, setIsTvMode] = useState(false)

  const [historySector, setHistorySector] = useState<string>(
    () => sessionStorage.getItem('vitali_history_lab') || 'ALL',
  )

  useEffect(() => {
    sessionStorage.setItem('vitali_history_lab', historySector)
  }, [historySector])

  useEffect(() => {
    if (!isTvMode) return
    const interval = setInterval(
      () => {
        refreshOrders()
      },
      5 * 60 * 1000,
    ) // Update every 5 mins in TV Mode
    return () => clearInterval(interval)
  }, [isTvMode, refreshOrders])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsTvMode(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const toggleTvMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsTvMode(true)
    } else {
      document.exitFullscreen()
      setIsTvMode(false)
    }
  }

  const isCollaboratorOrAdmin = [
    'admin',
    'master',
    'receptionist',
    'technical_assistant',
    'financial',
    'relationship_manager',
  ].includes(effectiveRole || '')

  const canSelectDentist = checkPermission('history', 'select_dentist') || isCollaboratorOrAdmin
  const canShowCompleted = checkPermission('history', 'show_completed') || isCollaboratorOrAdmin
  const canSearch = checkPermission('history', 'search') || isCollaboratorOrAdmin

  const availableDentists = useMemo(() => {
    const map = new Map<string, string>()
    orders.forEach((o) => {
      if (o.dentistId && o.dentistName && o.dentistRole !== 'master') {
        map.set(o.dentistId, o.dentistName)
      }
    })
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [orders])

  const sectorFilteredOrders = useMemo(() => {
    if (historySector === 'ALL') return orders
    return orders.filter((o) => o.sector && o.sector.toUpperCase().trim() === historySector)
  }, [orders, historySector])

  const filtered = sectorFilteredOrders.filter((o) => {
    if (o.dentistRole === 'master') return false

    if (canSearch && search.trim()) {
      const matchesSearch =
        o.patientName.toLowerCase().includes(search.toLowerCase()) ||
        o.friendlyId.toLowerCase().includes(search.toLowerCase())
      if (!matchesSearch) return false
    }
    if (canSelectDentist && dentistFilter !== 'all' && o.dentistId !== dentistFilter) return false

    const isFinished =
      o.status === 'completed' || o.status === 'delivered' || o.status === 'cancelled'
    if (isFinished && !showCompleted && (!canSearch || !search.trim())) {
      return false
    }
    return true
  })

  // Chart Data
  const kpis = useMemo(() => {
    const validOrders = sectorFilteredOrders.filter((o) => o.dentistRole !== 'master')
    const total = validOrders.length
    const completed = validOrders.filter((o) =>
      ['completed', 'delivered'].includes(o.status),
    ).length
    const pending = validOrders.filter((o) =>
      ['pending', 'in_production'].includes(o.status),
    ).length
    return { total, completed, pending }
  }, [sectorFilteredOrders])

  const statusChartData = useMemo(() => {
    const validOrders = sectorFilteredOrders.filter((o) => o.dentistRole !== 'master')
    const counts = { pending: 0, in_production: 0, completed: 0, delivered: 0 }
    validOrders.forEach((o) => {
      if (counts[o.status as keyof typeof counts] !== undefined)
        counts[o.status as keyof typeof counts]++
    })
    return [
      { status: 'Pendente', count: counts.pending, fill: 'hsl(var(--chart-1))' },
      { status: 'Em Produção', count: counts.in_production, fill: 'hsl(var(--chart-2))' },
      { status: 'Finalizado', count: counts.completed, fill: 'hsl(var(--chart-3))' },
      { status: 'Entregue', count: counts.delivered, fill: 'hsl(var(--chart-4))' },
    ].filter((d) => d.count > 0)
  }, [sectorFilteredOrders])

  const timeChartData = useMemo(() => {
    const validOrders = sectorFilteredOrders.filter((o) => o.dentistRole !== 'master')
    const map = new Map<string, number>()
    validOrders.forEach((o) => {
      const d = new Date(o.createdAt)
      if (isNaN(d.getTime())) return
      const monthYear = format(d, 'MMM/yy', { locale: ptBR })
      map.set(monthYear, (map.get(monthYear) || 0) + 1)
    })
    const data = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthYear = format(d, 'MMM/yy', { locale: ptBR })
      data.push({ month: monthYear, pedidos: map.get(monthYear) || 0 })
    }
    return data
  }, [sectorFilteredOrders])

  const statusChartConfig = {
    pending: { label: 'Pendente', color: 'hsl(var(--chart-1))' },
    in_production: { label: 'Em Produção', color: 'hsl(var(--chart-2))' },
    completed: { label: 'Finalizado', color: 'hsl(var(--chart-3))' },
    delivered: { label: 'Entregue', color: 'hsl(var(--chart-4))' },
  } satisfies ChartConfig

  const timeChartConfig = {
    pedidos: { label: 'Pedidos', color: 'hsl(var(--primary))' },
  } satisfies ChartConfig

  if (!currentUser) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isTvMode) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#020617] text-slate-50 flex flex-col p-8 overflow-hidden font-sans">
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-900/50">
              <MonitorPlay className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
                Monitoramento de Produção
              </h1>
              <p className="text-2xl text-blue-400 mt-2 uppercase font-bold tracking-widest flex items-center gap-3">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
                {historySector === 'ALL' ? 'Visão Consolidada' : historySector}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTvMode}
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-20 w-20 rounded-full transition-colors"
          >
            <Minimize2 className="w-10 h-10" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8 flex-1 min-h-0">
          <div className="bg-slate-900/80 rounded-[2.5rem] p-10 border border-slate-800/80 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500" />
            <ListChecks className="w-24 h-24 text-blue-500/30 mb-8" />
            <p className="text-4xl text-slate-400 font-bold uppercase tracking-widest mb-6 z-10">
              Total de Pedidos
            </p>
            <p className="text-[12rem] font-black text-blue-500 leading-none tracking-tighter z-10 drop-shadow-2xl">
              {kpis.total}
            </p>
          </div>
          <div className="bg-slate-900/80 rounded-[2.5rem] p-10 border border-slate-800/80 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors duration-500" />
            <Clock className="w-24 h-24 text-amber-500/30 mb-8" />
            <p className="text-4xl text-slate-400 font-bold uppercase tracking-widest mb-6 z-10">
              Em Andamento
            </p>
            <p className="text-[12rem] font-black text-amber-500 leading-none tracking-tighter z-10 drop-shadow-2xl">
              {kpis.pending}
            </p>
          </div>
          <div className="bg-slate-900/80 rounded-[2.5rem] p-10 border border-slate-800/80 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500" />
            <CheckCircle2 className="w-24 h-24 text-emerald-500/30 mb-8" />
            <p className="text-4xl text-slate-400 font-bold uppercase tracking-widest mb-6 z-10">
              Concluídos
            </p>
            <p className="text-[12rem] font-black text-emerald-500 leading-none tracking-tighter z-10 drop-shadow-2xl">
              {kpis.completed}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const showDentistCol = effectiveRole !== 'dentist' && effectiveRole !== 'laboratory'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
            {isCollaboratorOrAdmin ? 'Histórico Global' : 'Meu Histórico'}
          </h2>
          <p className="text-muted-foreground">
            Consulte todos os casos e a evolução dos trabalhos.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={historySector} onValueChange={setHistorySector}>
            <SelectTrigger className="w-full md:w-[280px] justify-start text-left font-normal shadow-sm h-10 bg-background border-border uppercase text-xs font-bold">
              <Filter className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="SELECIONAR LABORATÓRIO" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="uppercase text-xs font-bold">
                TODOS OS LABORATÓRIOS
              </SelectItem>
              <SelectItem value="SOLUÇÕES CERÂMICAS" className="uppercase text-xs font-bold">
                SOLUÇÕES CERÂMICAS
              </SelectItem>
              <SelectItem value="STÚDIO ACRÍLICO" className="uppercase text-xs font-bold">
                STÚDIO ACRÍLICO
              </SelectItem>
            </SelectContent>
          </Select>

          {isCollaboratorOrAdmin && (
            <Button
              variant="outline"
              onClick={toggleTvMode}
              className="h-10 w-full md:w-auto border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900/50 dark:hover:bg-blue-900/20 font-bold tracking-wider uppercase text-xs shadow-sm transition-all"
            >
              <MonitorPlay className="w-4 h-4 mr-2" />
              Modo TV
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="history" className="w-full space-y-6">
        <TabsList className="bg-muted/50 border shadow-sm w-full justify-start h-auto flex-wrap p-1">
          <TabsTrigger value="history" className="uppercase text-xs font-bold tracking-wider py-2">
            {isCollaboratorOrAdmin ? 'Histórico Global' : 'Meu Histórico'}
          </TabsTrigger>
          <TabsTrigger
            value="evolution"
            className="uppercase text-xs font-bold tracking-wider py-2"
          >
            Evolução dos Trabalhos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4 outline-none">
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 w-full">
            {canSelectDentist && showDentistCol && (
              <Select value={dentistFilter} onValueChange={setDentistFilter}>
                <SelectTrigger className="w-full sm:w-[220px] h-10 bg-background shadow-sm border-border">
                  <SelectValue placeholder="SELECIONAR CLIENTE" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">TODOS OS CLIENTES</SelectItem>
                  {availableDentists.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {canShowCompleted && (
              <div className="flex items-center space-x-2 bg-background border px-3 py-2 rounded-md h-10 w-full sm:w-auto shadow-sm">
                <Switch
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={setShowCompleted}
                />
                <Label
                  htmlFor="show-completed"
                  className="text-sm font-medium cursor-pointer whitespace-nowrap uppercase tracking-wider text-[10px]"
                >
                  MOSTRAR CONCLUÍDOS
                </Label>
              </div>
            )}

            {canSearch && (
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="BUSCA POR PACIENTE/ID..."
                  className="pl-9 h-10 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          <Card className="shadow-subtle">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">ID</TableHead>
                    {showDentistCol && <TableHead>Clínica/Dentista</TableHead>}
                    <TableHead>Paciente</TableHead>
                    <TableHead>Trabalho</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((order, index) => (
                    <TableRow key={`${order.id}-${index}`}>
                      <TableCell className="pl-6 font-medium">{order.friendlyId}</TableCell>
                      {showDentistCol && <TableCell>{order.dentistName}</TableCell>}
                      <TableCell>{order.patientName}</TableCell>
                      <TableCell>{order.workType}</TableCell>
                      <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {order.dentistGroupLink && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300"
                              asChild
                            >
                              <a
                                href={order.dentistGroupLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Contato via WhatsApp"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/order/${order.id}`}>Detalhes</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={showDentistCol ? 7 : 6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Nenhum pedido encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6 outline-none">
          {sectorFilteredOrders.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed bg-muted/30">
              <p className="text-muted-foreground">
                Nenhum dado encontrado para o laboratório selecionado.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpis.total}</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">{kpis.completed}</div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">{kpis.pending}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Pedidos por Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={statusChartConfig} className="h-[300px] w-full">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={statusChartData}
                          dataKey="count"
                          nameKey="status"
                          innerRadius={60}
                          paddingAngle={2}
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Volume de Pedidos (Últimos 6 meses)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={timeChartConfig} className="h-[300px] w-full">
                      <BarChart
                        data={timeChartData}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="pedidos" fill="var(--color-pedidos)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
