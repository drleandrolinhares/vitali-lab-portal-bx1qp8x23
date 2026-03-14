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
  Check,
  ListChecks,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { useState, useMemo } from 'react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'

export default function HistoryPage() {
  const { orders, currentUser, checkPermission } = useAppStore()
  const [search, setSearch] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [dentistFilter, setDentistFilter] = useState<string>('all')
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])

  const isCollaboratorOrAdmin = [
    'admin',
    'master',
    'receptionist',
    'technical_assistant',
    'financial',
    'relationship_manager',
  ].includes(currentUser?.role || '')

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

  const availableSectors = useMemo(() => {
    const sectors = new Set<string>()
    orders.forEach((o) => {
      if (o.sector) sectors.add(o.sector.toUpperCase().trim())
    })
    return Array.from(sectors).sort()
  }, [orders])

  const sectorFilteredOrders = useMemo(() => {
    if (selectedSectors.length === 0) return orders
    return orders.filter((o) => o.sector && selectedSectors.includes(o.sector.toUpperCase().trim()))
  }, [orders, selectedSectors])

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

  const showDentistCol = currentUser?.role !== 'dentist'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
            {isCollaboratorOrAdmin ? 'Histórico Global' : 'Histórico de Pedidos'}
          </h2>
          <p className="text-muted-foreground">
            Consulte todos os casos e a evolução dos trabalhos.
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[280px] justify-start text-left font-normal shadow-sm h-10 bg-background border-border"
            >
              <Filter className="mr-2 h-4 w-4 opacity-50" />
              <span className="truncate">
                {selectedSectors.length === 0
                  ? 'TODOS OS LABORATÓRIOS'
                  : selectedSectors.length === 1
                    ? selectedSectors[0]
                    : `${selectedSectors.length} SELECIONADOS`}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Buscar laboratório..." />
              <CommandList>
                <CommandEmpty>Nenhum laboratório encontrado.</CommandEmpty>
                <CommandGroup>
                  {availableSectors.map((sector) => (
                    <CommandItem
                      key={sector}
                      onSelect={() => {
                        setSelectedSectors((prev) =>
                          prev.includes(sector)
                            ? prev.filter((s) => s !== sector)
                            : [...prev, sector],
                        )
                      }}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          selectedSectors.includes(sector)
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      {sector}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              {selectedSectors.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setSelectedSectors([])}
                      className="justify-center text-center text-sm font-medium text-muted-foreground cursor-pointer"
                    >
                      Limpar Filtros
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </Command>
          </PopoverContent>
        </Popover>
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
