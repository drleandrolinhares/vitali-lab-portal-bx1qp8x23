import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency, cn } from '@/lib/utils'
import {
  Loader2,
  Download,
  BarChart3,
  Wallet,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { parseISO } from 'date-fns'

const MONTHS = [
  { value: '0', label: 'Janeiro' },
  { value: '1', label: 'Fevereiro' },
  { value: '2', label: 'Março' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Maio' },
  { value: '5', label: 'Junho' },
  { value: '6', label: 'Julho' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Setembro' },
  { value: '9', label: 'Outubro' },
  { value: '10', label: 'Novembro' },
  { value: '11', label: 'Dezembro' },
]

const YEARS = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

export default function AdminFinancial() {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [settlements, setSettlements] = useState<any[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [profilesRes, ordersRes, settlementsRes] = await Promise.all([
        supabase.from('profiles').select('id, name, clinic').eq('role', 'dentist'),
        supabase
          .from('orders')
          .select('id, base_price, status, kanban_stage, created_at, dentist_id, settlement_id'),
        supabase.from('settlements').select('id, amount, created_at, dentist_id'),
      ])

      if (profilesRes.data) setProfiles(profilesRes.data)
      if (ordersRes.data) setOrders(ordersRes.data)
      if (settlementsRes.data) setSettlements(settlementsRes.data)
    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const { summary, tableData } = useMemo(() => {
    let faturado = 0
    let emAberto = 0
    let recebido = 0
    let inadimplencia = 0 // Keeping 0 for now as per missing explicit overdue logic

    const map = new Map<string, any>()
    profiles.forEach((p) => {
      map.set(p.id, {
        id: p.id,
        name: p.name,
        clinic: p.clinic,
        finalizadosMes: 0,
        emProducao: 0,
      })
    })

    const isSamePeriod = (dateStr: string) => {
      if (!dateStr) return false
      const d = parseISO(dateStr)
      return (
        d.getMonth().toString() === selectedMonth && d.getFullYear().toString() === selectedYear
      )
    }

    orders.forEach((o) => {
      const isCompleted =
        o.status === 'completed' ||
        o.status === 'delivered' ||
        o.kanban_stage?.toUpperCase().includes('FINALIZADO') ||
        o.kanban_stage?.toUpperCase().includes('ENTREGUE')
      const isCancelled = o.status === 'cancelled'
      const inPeriod = isSamePeriod(o.created_at)

      if (inPeriod && isCompleted) {
        faturado += Number(o.base_price || 0)
        if (!o.settlement_id) {
          emAberto += Number(o.base_price || 0)
        }
      }

      if (!o.dentist_id || !map.has(o.dentist_id)) return
      const dentistData = map.get(o.dentist_id)

      if (inPeriod && isCompleted && !o.settlement_id) {
        dentistData.finalizadosMes += Number(o.base_price || 0)
      }

      if (!isCompleted && !isCancelled && inPeriod) {
        dentistData.emProducao += Number(o.base_price || 0)
      }
    })

    settlements.forEach((s) => {
      if (isSamePeriod(s.created_at)) {
        recebido += Number(s.amount || 0)
      }
    })

    const activeTableData = Array.from(map.values())
      .filter((d) => d.finalizadosMes > 0 || d.emProducao > 0)
      .sort((a, b) => b.finalizadosMes - a.finalizadosMes)

    return {
      summary: { faturado, emAberto, recebido, inadimplencia },
      tableData: activeTableData,
    }
  }, [profiles, orders, settlements, selectedMonth, selectedYear])

  const handleExport = () => {
    let csv = 'Dentista / Clínica,Finalizados no Mês (R$),Em Produção (Pipeline) (R$)\n'
    tableData.forEach((d) => {
      csv += `"${d.name} ${d.clinic ? `/ ${d.clinic}` : ''}",${d.finalizadosMes},${d.emProducao}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Producao_${MONTHS.find((m) => m.value === selectedMonth)?.label}_${selectedYear}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[1600px] flex flex-col gap-6 animate-in fade-in duration-500 lg:h-[calc(100vh-6rem)]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary uppercase">
              PAINEL GERENCIAL GLOBAL
            </h1>
            <p className="text-muted-foreground text-sm">
              Visão financeira e acompanhamento de faturamento do laboratório.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2 bg-white">
            <Download className="w-4 h-4" /> Exportar
          </Button>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-sm p-1">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0 h-8 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-px h-4 bg-slate-200" />
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0 h-8 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* OUTER TABS */}
      <Tabs defaultValue="receber" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit flex-none">
          <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
        </TabsList>

        <TabsContent
          value="receber"
          className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden mt-4 gap-6"
        >
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Faturado
                  </p>
                  <h3 className="text-2xl font-bold text-blue-600">
                    {formatCurrency(summary.faturado)}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-amber-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Em Aberto
                  </p>
                  <h3 className="text-2xl font-bold text-amber-600">
                    {formatCurrency(summary.emAberto)}
                  </h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-full">
                  <Activity className="w-5 h-5 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Recebido
                  </p>
                  <h3 className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(summary.recebido)}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-red-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Inadimplência
                  </p>
                  <h3 className="text-2xl font-bold text-red-600">
                    {formatCurrency(summary.inadimplencia)}
                  </h3>
                </div>
                <div className="p-3 bg-red-50 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* INNER TABS */}
          <Tabs defaultValue="producao" className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-fit flex-none">
              <TabsTrigger
                value="producao"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Produção em R$
              </TabsTrigger>
              <TabsTrigger
                value="faturas"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Faturas Fechadas
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="producao"
              className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden mt-4"
            >
              <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-slate-200 overflow-hidden">
                <div className="overflow-auto flex-1 bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-700 pl-6">
                          Dentista / Clínica
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                          Finalizados no Mês (R$)
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right pr-6">
                          Em Produção (Pipeline) (R$)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-12 text-muted-foreground"
                          >
                            Nenhum dado encontrado para o período selecionado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        tableData.map((row) => (
                          <TableRow key={row.id} className="hover:bg-slate-50/50">
                            <TableCell className="pl-6">
                              <p className="font-semibold text-slate-900">{row.name}</p>
                              {row.clinic && (
                                <p className="text-xs text-muted-foreground">{row.clinic}</p>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium text-emerald-600">
                              {formatCurrency(row.finalizadosMes)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-amber-600 pr-6">
                              {formatCurrency(row.emProducao)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent
              value="faturas"
              className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden mt-4"
            >
              <Card className="flex-1 flex items-center justify-center text-muted-foreground bg-slate-50/50 border-dashed">
                Nenhuma fatura fechada no período.
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="faturamento" className="flex-1 m-0 data-[state=inactive]:hidden mt-4">
          <Card className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground border-dashed">
            Módulo de Faturamento
          </Card>
        </TabsContent>

        <TabsContent value="pagar" className="flex-1 m-0 data-[state=inactive]:hidden mt-4">
          <Card className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground border-dashed">
            Módulo de Contas a Pagar
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
