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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
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
import { toast } from '@/hooks/use-toast'
import { InvoicePreviewDialog } from '@/components/financial/InvoicePreviewDialog'

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
  const [selectedDentist, setSelectedDentist] = useState<string>('all')

  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [settlements, setSettlements] = useState<any[]>([])

  // Modal State
  const [manualInvoiceDentist, setManualInvoiceDentist] = useState<string | null>(null)
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [profilesRes, ordersRes, settlementsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, name, clinic, closing_date, payment_due_date')
          .eq('role', 'dentist')
          .order('name'),
        supabase
          .from('orders')
          .select(
            'id, friendly_id, base_price, status, kanban_stage, created_at, dentist_id, settlement_id, patient_name, work_type, order_history(status, created_at, note)',
          ),
        supabase.from('settlements').select('id, amount, created_at, dentist_id'),
      ])

      if (profilesRes.data) setProfiles(profilesRes.data)
      if (ordersRes.data) setOrders(ordersRes.data)
      if (settlementsRes.data) setSettlements(settlementsRes.data)
    } catch (error) {
      console.error('Error fetching financial data:', error)
      toast({ title: 'Erro ao buscar dados financeiros', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getCompletionDate = (o: any) => {
    const isFinishedStatus = o.status === 'completed' || o.status === 'delivered'
    const isFinishedStage =
      o.kanban_stage?.toUpperCase().includes('FINALIZADO') ||
      o.kanban_stage?.toUpperCase().includes('ENTREGUE')

    if (!isFinishedStatus && !isFinishedStage) return null

    if (o.order_history && o.order_history.length > 0) {
      const completions = o.order_history.filter(
        (h: any) =>
          h.status === 'completed' ||
          h.status === 'delivered' ||
          h.note?.toUpperCase().includes('FINALIZADO') ||
          h.note?.toUpperCase().includes('ENTREGUE'),
      )
      if (completions.length > 0) {
        completions.sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        return new Date(completions[0].created_at)
      }
    }
    return new Date(o.created_at)
  }

  const { summary, tableData } = useMemo(() => {
    let faturar = 0
    let pipeline = 0
    let recebido = 0
    let inadimplencia = 0 // Maintained as 0 due to lack of distinct overdue/unpaid status for settlements

    const map = new Map<string, any>()
    profiles.forEach((p) => {
      if (selectedDentist !== 'all' && p.id !== selectedDentist) return
      map.set(p.id, {
        id: p.id,
        name: p.name,
        clinic: p.clinic,
        closing_date: p.closing_date,
        payment_due_date: p.payment_due_date,
        finalizadosMes: 0,
        emProducao: 0,
        readyToInvoiceCount: 0,
      })
    })

    const isSamePeriod = (dateVal: Date | string | null) => {
      if (!dateVal) return false
      const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal
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

      let compDate = null
      if (isCompleted) compDate = getCompletionDate(o)

      const inPeriodForCompletion = isSamePeriod(compDate)

      if (selectedDentist !== 'all' && o.dentist_id !== selectedDentist) return

      // faturar (Trabalhos Concluídos) uses COMPLETION date within the selected month
      if (inPeriodForCompletion && isCompleted && !o.settlement_id) {
        faturar += Number(o.base_price || 0)
      }

      // pipeline (Em Produção) = Active orders (not completed, not cancelled)
      if (!isCompleted && !isCancelled) {
        pipeline += Number(o.base_price || 0)
      }

      if (!o.dentist_id || !map.has(o.dentist_id)) return
      const dentistData = map.get(o.dentist_id)

      if (inPeriodForCompletion && isCompleted && !o.settlement_id) {
        dentistData.finalizadosMes += Number(o.base_price || 0)
      }

      if (!isCompleted && !isCancelled) {
        dentistData.emProducao += Number(o.base_price || 0)
      }

      if (isCompleted && !o.settlement_id) {
        dentistData.readyToInvoiceCount += 1
      }
    })

    settlements.forEach((s) => {
      if (selectedDentist !== 'all' && s.dentist_id !== selectedDentist) return

      if (isSamePeriod(s.created_at)) {
        recebido += Number(s.amount || 0)
      }
    })

    const activeTableData = Array.from(map.values())
      .filter((d) => d.finalizadosMes > 0 || d.emProducao > 0 || d.readyToInvoiceCount > 0)
      .sort((a, b) => b.finalizadosMes - a.finalizadosMes)

    return {
      summary: { faturar, pipeline, recebido, inadimplencia },
      tableData: activeTableData,
    }
  }, [profiles, orders, settlements, selectedMonth, selectedYear, selectedDentist])

  const modalOrders = useMemo(() => {
    if (!manualInvoiceDentist) return []
    return orders
      .filter((o) => {
        const isCompleted =
          o.status === 'completed' ||
          o.status === 'delivered' ||
          o.kanban_stage?.toUpperCase().includes('FINALIZADO') ||
          o.kanban_stage?.toUpperCase().includes('ENTREGUE')
        return o.dentist_id === manualInvoiceDentist && isCompleted && !o.settlement_id
      })
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }, [orders, manualInvoiceDentist])

  useEffect(() => {
    if (manualInvoiceDentist) {
      setSelectedOrderIds(modalOrders.map((o) => o.id))
    } else {
      setSelectedOrderIds([])
    }
  }, [manualInvoiceDentist, modalOrders])

  const handleExport = () => {
    let csv =
      'Dentista / Clínica,Fechamento,Vencimento,Finalizados no Mês (R$),Em Produção (Pipeline) (R$)\n'
    tableData.forEach((d) => {
      csv += `"${d.name} ${d.clinic ? `/ ${d.clinic}` : ''}",${d.closing_date || ''},${d.payment_due_date || ''},${d.finalizadosMes},${d.emProducao}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Producao_${MONTHS.find((m) => m.value === selectedMonth)?.label}_${selectedYear}.csv`
    link.click()
  }

  const handleToggleAllOrders = (checked: boolean) => {
    if (checked) setSelectedOrderIds(modalOrders.map((o) => o.id))
    else setSelectedOrderIds([])
  }

  const handleToggleOrder = (id: string, checked: boolean) => {
    if (checked) setSelectedOrderIds((prev) => [...prev, id])
    else setSelectedOrderIds((prev) => prev.filter((x) => x !== id))
  }

  const handleConfirmInvoice = async () => {
    if (selectedOrderIds.length === 0) return
    setIsSubmitting(true)
    try {
      const ordersToSettle = modalOrders.filter((o) => selectedOrderIds.includes(o.id))
      const totalAmount = ordersToSettle.reduce((sum, o) => sum + Number(o.base_price || 0), 0)

      const { data, error } = await supabase
        .from('settlements')
        .insert({
          dentist_id: manualInvoiceDentist,
          amount: totalAmount,
          orders_snapshot: ordersToSettle,
        })
        .select('id')
        .single()

      if (error) throw error

      const { error: updateError } = await supabase
        .from('orders')
        .update({ settlement_id: data.id })
        .in('id', selectedOrderIds)

      if (updateError) throw updateError

      toast({ title: 'Fatura fechada com sucesso!' })
      fetchData()
      setManualInvoiceDentist(null)
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao fechar fatura', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
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
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-sm p-1 min-w-[200px]">
            <Select value={selectedDentist} onValueChange={setSelectedDentist}>
              <SelectTrigger className="border-none shadow-none focus:ring-0 h-8 font-medium">
                <SelectValue placeholder="Todos os Dentistas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Dentistas</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
        </TabsList>

        <TabsContent
          value="receber"
          className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden mt-4 gap-6"
        >
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p
                    className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 line-clamp-2 min-h-[32px] flex items-center"
                    title="Trabalhos Concluídos a Faturar"
                  >
                    Trabalhos Concluídos a Faturar
                  </p>
                  <h3 className="text-2xl font-bold text-blue-600">
                    {formatCurrency(summary.faturar)}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full flex-none">
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-amber-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p
                    className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 line-clamp-2 min-h-[32px] flex items-center"
                    title="Trabalhos em Pipeline de Produção"
                  >
                    Trabalhos em Pipeline de Produção
                  </p>
                  <h3 className="text-2xl font-bold text-amber-600">
                    {formatCurrency(summary.pipeline)}
                  </h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-full flex-none">
                  <Activity className="w-5 h-5 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 min-h-[32px] flex items-center">
                    Recebido
                  </p>
                  <h3 className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(summary.recebido)}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full flex-none">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-red-500">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 min-h-[32px] flex items-center">
                    Inadimplência
                  </p>
                  <h3 className="text-2xl font-bold text-red-600">
                    {formatCurrency(summary.inadimplencia)}
                  </h3>
                </div>
                <div className="p-3 bg-red-50 rounded-full flex-none">
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
                        <TableHead className="font-semibold text-slate-700 text-center">
                          Fechamento
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">
                          Vencimento
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                          Finalizados no Mês (R$)
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                          Em Produção (Pipeline) (R$)
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right pr-6">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-12 text-muted-foreground"
                          >
                            Nenhum dado encontrado para o período e filtros selecionados.
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
                            <TableCell className="text-center font-medium text-slate-600">
                              {row.closing_date ? `Dia ${row.closing_date}` : '-'}
                            </TableCell>
                            <TableCell className="text-center font-medium text-slate-600">
                              {row.payment_due_date ? `Dia ${row.payment_due_date}` : '-'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-blue-600">
                              {formatCurrency(row.finalizadosMes)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-amber-600">
                              {formatCurrency(row.emProducao)}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setManualInvoiceDentist(row.id)}
                                disabled={row.readyToInvoiceCount === 0}
                                className="text-xs font-semibold"
                              >
                                FECHAR FATURA MANUAL
                              </Button>
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
      </Tabs>

      {/* MANUAL INVOICE MODAL */}
      <Dialog
        open={!!manualInvoiceDentist}
        onOpenChange={(open) => !open && setManualInvoiceDentist(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Fechar Fatura Manual</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-600 font-medium">
                Pedidos concluídos e pendentes de faturamento:
              </p>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedOrderIds.length === modalOrders.length && modalOrders.length > 0}
                  onCheckedChange={(c) => handleToggleAllOrders(!!c)}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-semibold cursor-pointer select-none"
                >
                  Marcar Todos
                </label>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-12 text-center"></TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Data de Entrada</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modalOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedOrderIds.includes(o.id)}
                          onCheckedChange={(c) => handleToggleOrder(o.id, !!c)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {o.friendly_id || o.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>{new Date(o.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(o.base_price || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {modalOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Nenhum pedido pendente para este dentista.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Total Selecionado
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(
                  modalOrders
                    .filter((o) => selectedOrderIds.includes(o.id))
                    .reduce((sum, o) => sum + Number(o.base_price || 0), 0),
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewOpen(true)}
                disabled={selectedOrderIds.length === 0}
                className="bg-white"
              >
                Prévia da Fatura
              </Button>
              <Button variant="ghost" onClick={() => setManualInvoiceDentist(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmInvoice}
                disabled={selectedOrderIds.length === 0 || isSubmitting}
                className="gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar Fechamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* INVOICE PREVIEW / PDF MODAL */}
      {manualInvoiceDentist && (
        <InvoicePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          dentistName={profiles.find((p) => p.id === manualInvoiceDentist)?.name || ''}
          clinicName={profiles.find((p) => p.id === manualInvoiceDentist)?.clinic || ''}
          orders={modalOrders.filter((o) => selectedOrderIds.includes(o.id))}
          totalAmount={modalOrders
            .filter((o) => selectedOrderIds.includes(o.id))
            .reduce((sum, o) => sum + Number(o.base_price || 0), 0)}
        />
      )}
    </div>
  )
}
