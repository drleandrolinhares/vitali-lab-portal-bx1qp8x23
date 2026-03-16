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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/utils'
import {
  Loader2,
  Download,
  BarChart3,
  Wallet,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { InvoicePreviewDialog } from '@/components/financial/InvoicePreviewDialog'
import { useAppStore } from '@/stores/main'
import { filterOrdersForFinancials, getOrderFinancials } from '@/lib/financial'

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
  const {
    orders: storeOrders,
    priceList,
    kanbanStages,
    loading: storeLoading,
    refreshOrders,
  } = useAppStore()

  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedDentist, setSelectedDentist] = useState<string>('all')

  const [loadingSettlements, setLoadingSettlements] = useState(true)
  const [profiles, setProfiles] = useState<any[]>([])
  const [settlements, setSettlements] = useState<any[]>([])

  // Modal State
  const [manualInvoiceDentist, setManualInvoiceDentist] = useState<string | null>(null)
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const fetchData = async () => {
    setLoadingSettlements(true)
    try {
      const [profilesRes, settlementsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, name, clinic, closing_date, payment_due_date')
          .eq('role', 'dentist')
          .order('name'),
        supabase.from('settlements').select('id, amount, created_at, dentist_id'),
      ])

      if (profilesRes.data) setProfiles(profilesRes.data)
      if (settlementsRes.data) setSettlements(settlementsRes.data)
    } catch (error) {
      console.error('Error fetching financial data:', error)
      toast({ title: 'Erro ao buscar dados financeiros', variant: 'destructive' })
    } finally {
      setLoadingSettlements(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const monthStr = (parseInt(selectedMonth) + 1).toString().padStart(2, '0')
  const formattedSelectedMonthYear = `${selectedYear}-${monthStr}`

  const { summary, tableData } = useMemo(() => {
    let faturar = 0
    let pipeline = 0
    let recebido = 0
    const inadimplencia = 0

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
        unsettledOrders: [],
      })
    })

    const safeOrders = Array.isArray(storeOrders) ? storeOrders : []
    const safePriceList = Array.isArray(priceList) ? priceList : []
    const safeKanbanStages = Array.isArray(kanbanStages) ? kanbanStages : []

    const monthFilteredOrders = filterOrdersForFinancials(safeOrders, formattedSelectedMonthYear)
    const displayOrders = monthFilteredOrders.map((o) =>
      getOrderFinancials(o, safePriceList, safeKanbanStages),
    )

    const verifiedDisplayOrders = displayOrders.map((order) => {
      const discount = order.dentistDiscount || 0
      const expectedTotal = order.unitPrice * order.quantity * (1 - discount / 100)
      const isCorrect = Math.abs((order.basePrice || 0) - expectedTotal) < 0.01
      const finalBasePrice = isCorrect ? order.basePrice : expectedTotal
      return {
        ...order,
        basePrice: finalBasePrice,
      }
    })

    verifiedDisplayOrders.forEach((o) => {
      if (selectedDentist !== 'all' && o.dentistId !== selectedDentist) return

      const isCompleted = o.status === 'completed' || o.status === 'delivered'
      const isCancelled = o.status === 'cancelled'

      if (isCompleted && !o.settlementId) {
        faturar += o.basePrice || 0
      }

      if (!isCompleted && !isCancelled) {
        pipeline += o.basePrice || 0
      }

      if (!o.dentistId || !map.has(o.dentistId)) return
      const dentistData = map.get(o.dentistId)

      if (isCompleted && !o.settlementId) {
        dentistData.finalizadosMes += o.basePrice || 0
        dentistData.readyToInvoiceCount += 1
        dentistData.unsettledOrders.push(o)
      }

      if (!isCompleted && !isCancelled) {
        dentistData.emProducao += o.basePrice || 0
      }
    })

    const isSamePeriod = (dateVal: string | null) => {
      if (!dateVal) return false
      const d = new Date(dateVal)
      return (
        d.getMonth().toString() === selectedMonth && d.getFullYear().toString() === selectedYear
      )
    }

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
  }, [
    profiles,
    storeOrders,
    settlements,
    selectedMonth,
    selectedYear,
    selectedDentist,
    priceList,
    kanbanStages,
    formattedSelectedMonthYear,
  ])

  const modalOrders = useMemo(() => {
    if (!manualInvoiceDentist) return []
    const dentistData = tableData.find((d) => d.id === manualInvoiceDentist)
    if (!dentistData) return []
    return dentistData.unsettledOrders.sort(
      (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }, [manualInvoiceDentist, tableData])

  useEffect(() => {
    if (manualInvoiceDentist) {
      setSelectedOrderIds(modalOrders.map((o: any) => o.id))
    } else {
      setSelectedOrderIds([])
    }
  }, [manualInvoiceDentist, modalOrders])

  const handleExport = () => {
    let csv =
      'Dentista / Clínica,Data de Fechamento,Data de Pagamento,Finalizados no Mês (R$),Em Produção (Pipeline) (R$)\n'
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
    if (checked) setSelectedOrderIds(modalOrders.map((o: any) => o.id))
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
      const ordersToSettle = modalOrders.filter((o: any) => selectedOrderIds.includes(o.id))
      const totalAmount = ordersToSettle.reduce(
        (sum: number, o: any) => sum + (o.basePrice || 0),
        0,
      )

      const snapshot = ordersToSettle.map((o: any) => ({
        id: o.id,
        friendlyId: o.friendlyId,
        patientName: o.patientName,
        workType: o.workType,
        clearedAmount: o.basePrice,
      }))

      const { data, error } = await supabase
        .from('settlements')
        .insert({
          dentist_id: manualInvoiceDentist,
          amount: totalAmount,
          orders_snapshot: snapshot,
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
      refreshOrders()
      setManualInvoiceDentist(null)
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao fechar fatura', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (storeLoading || loadingSettlements) {
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
                          Data de Fechamento
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">
                          Data de Pagamento
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
                  {modalOrders.map((o: any) => (
                    <TableRow key={o.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedOrderIds.includes(o.id)}
                          onCheckedChange={(c) => handleToggleOrder(o.id, !!c)}
                        />
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {o.friendlyId || o.id.substring(0, 8)}
                        {o.patientName && (
                          <span className="text-muted-foreground font-normal ml-2">
                            - {o.patientName}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(o.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(o.basePrice || 0)}
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
                    .filter((o: any) => selectedOrderIds.includes(o.id))
                    .reduce((sum: number, o: any) => sum + (o.basePrice || 0), 0),
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={() => setPreviewOpen(true)}
                disabled={selectedOrderIds.length === 0}
                className="gap-2"
              >
                PRÉVIA DA FATURA
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
          orders={modalOrders.filter((o: any) => selectedOrderIds.includes(o.id))}
          totalAmount={modalOrders
            .filter((o: any) => selectedOrderIds.includes(o.id))
            .reduce((sum: number, o: any) => sum + (o.basePrice || 0), 0)}
        />
      )}
    </div>
  )
}
