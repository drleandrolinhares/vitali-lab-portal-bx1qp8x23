import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  getOrderFinancials,
  formatBRL,
  generateMonthOptions,
  filterOrdersForFinancials,
  getOrderCompletionDate,
} from '@/lib/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  TrendingUp,
  Wallet,
  CheckCircle,
  Activity,
  CalendarDays,
  Send,
  Download,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

function getSafeDate(year: number, month: number, day: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(day, daysInMonth))
}

export default function AdminFinancial() {
  const { currentUser, orders, refreshOrders, selectedLab, priceList, checkPermission } =
    useAppStore()
  const [dentists, setDentists] = useState<any[]>([])
  const [billingControls, setBillingControls] = useState<any[]>([])
  const [settleDialog, setSettleDialog] = useState<any>(null)
  const [detailsDialog, setDetailsDialog] = useState<any>(null)

  const monthOptions = useMemo(() => generateMonthOptions(), [])
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'))

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name, clinic, closing_date, payment_due_date')
      .eq('role', 'dentist')
      .then(({ data }) => {
        if (data) setDentists(data)
      })
  }, [currentUser])

  useEffect(() => {
    supabase
      .from('billing_controls' as any)
      .select('*')
      .eq('month', selectedMonth)
      .then(({ data }) => {
        if (data) setBillingControls(data)
      })
  }, [selectedMonth])

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedLab === 'Todos') return true
      return (o.sector || '').trim().toUpperCase() === selectedLab.trim().toUpperCase()
    })
  }, [orders, selectedLab])

  const timelineData = useMemo(() => {
    if (!dentists.length || !filteredOrders.length) return []

    const [yearStr, monthStr] = selectedMonth.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) - 1

    const items = dentists
      .filter((d) => (currentUser?.role === 'dentist' ? d.id === currentUser.id : true))
      .map((d) => {
        const dueDay = d.payment_due_date || 5
        const closeDay = d.closing_date || 30

        const dueDate = getSafeDate(year, month, dueDay)

        let closeYear = year
        let closeMonth = month

        if (closeDay >= dueDay) {
          closeMonth -= 1
          if (closeMonth < 0) {
            closeMonth = 11
            closeYear -= 1
          }
        }

        const closeDate = getSafeDate(closeYear, closeMonth, closeDay)
        closeDate.setHours(23, 59, 59, 999)

        let startMonth = closeMonth - 1
        let startYear = closeYear
        if (startMonth < 0) {
          startMonth = 11
          startYear -= 1
        }
        const cycleStart = getSafeDate(startYear, startMonth, closeDay)
        cycleStart.setDate(cycleStart.getDate() + 1)
        cycleStart.setHours(0, 0, 0, 0)

        const dOrders = filteredOrders.filter((o) => o.dentistId === d.id)
        const financials = dOrders.map((o) => getOrderFinancials(o, priceList))

        const cycleOrders = financials.filter((o) => {
          if (o.status !== 'completed' && o.status !== 'delivered') return false
          const compDate = getOrderCompletionDate(o)
          return compDate && compDate >= cycleStart && compDate <= closeDate
        })

        const pendingOrders = financials.filter(
          (o) => o.status === 'pending' || o.status === 'in_production',
        )

        const invoicedAmount = cycleOrders.reduce((acc, o) => acc + o.completedCost, 0)
        const clearedAmount = cycleOrders.reduce((acc, o) => acc + o.clearedBalance, 0)
        const outstandingAmount = Math.max(0, invoicedAmount - clearedAmount)
        const pipelineAmount = pendingOrders.reduce((acc, o) => acc + o.pipelineCost, 0)

        const now = new Date()
        const isOpen = now < closeDate
        const isPastDue = !isOpen && now > dueDate && outstandingAmount > 0
        const isSent = billingControls.some((b) => b.dentist_id === d.id)

        let status: 'FATURA EM ABERTO' | 'PENDENTE' | 'VENCIDO' | 'ENVIADO' | 'LIQUIDADO' =
          'PENDENTE'
        if (isOpen) status = 'FATURA EM ABERTO'
        else if (outstandingAmount === 0 && invoicedAmount > 0) status = 'LIQUIDADO'
        else if (isPastDue) status = 'VENCIDO'
        else if (isSent) status = 'ENVIADO'

        const displayAmount = isOpen ? invoicedAmount + pipelineAmount : outstandingAmount

        return {
          id: d.id,
          dentist: d,
          dueDate,
          dueDay,
          closeDate,
          cycleStart,
          cycleOrders,
          pendingOrders,
          invoicedAmount,
          clearedAmount,
          outstandingAmount,
          pipelineAmount,
          displayAmount,
          isOpen,
          isPastDue,
          isSent,
          status,
          hasActivity: invoicedAmount > 0 || (isOpen && pipelineAmount > 0),
        }
      })
      .filter((item) => item.hasActivity)

    const grouped = items.reduce(
      (acc, item) => {
        if (!acc[item.dueDay]) acc[item.dueDay] = []
        acc[item.dueDay].push(item)
        return acc
      },
      {} as Record<number, typeof items>,
    )

    return Object.entries(grouped)
      .map(([day, items]) => ({ day: parseInt(day, 10), items }))
      .sort((a, b) => a.day - b.day)
  }, [dentists, filteredOrders, selectedMonth, billingControls, priceList, currentUser])

  const closedFaturas = useMemo(() => {
    return timelineData
      .map((group) => ({
        day: group.day,
        items: group.items.filter((item) => !item.isOpen),
      }))
      .filter((group) => group.items.length > 0)
  }, [timelineData])

  const producaoData = useMemo(() => {
    if (!dentists.length || !filteredOrders.length)
      return { list: [], totalFinalized: 0, totalPipeline: 0 }

    const [yearStr, monthStr] = selectedMonth.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) - 1

    let totalFinalized = 0
    let totalPipeline = 0

    const list = dentists
      .filter((d) => (currentUser?.role === 'dentist' ? d.id === currentUser.id : true))
      .map((d) => {
        const dOrders = filteredOrders.filter((o) => o.dentistId === d.id)
        const financials = dOrders.map((o) => getOrderFinancials(o, priceList))

        const calendarMonthOrders = financials.filter((o) => {
          if (o.status !== 'completed' && o.status !== 'delivered') return false
          const compDate = getOrderCompletionDate(o)
          return compDate && compDate.getFullYear() === year && compDate.getMonth() === month
        })

        const pendingOrders = financials.filter(
          (o) => o.status === 'pending' || o.status === 'in_production',
        )

        const finalized = calendarMonthOrders.reduce((acc, o) => acc + o.completedCost, 0)
        const pipeline = pendingOrders.reduce((acc, o) => acc + o.pipelineCost, 0)

        totalFinalized += finalized
        totalPipeline += pipeline

        return {
          dentist: d,
          finalized,
          pipeline,
        }
      })
      .filter((item) => item.finalized > 0 || item.pipeline > 0)
      .sort((a, b) => b.finalized - a.finalized)

    return { list, totalFinalized, totalPipeline }
  }, [dentists, filteredOrders, selectedMonth, priceList, currentUser])

  const topCardsData = useMemo(() => {
    let faturadoFechadas = 0
    let emAberto = 0
    let recebido = 0
    let inadimplencia = 0

    timelineData.forEach((group) => {
      group.items.forEach((item) => {
        if (item.isOpen) {
          emAberto += item.invoicedAmount
        } else {
          faturadoFechadas += item.invoicedAmount
          recebido += item.clearedAmount
          if (item.isPastDue && item.status !== 'LIQUIDADO') {
            inadimplencia += item.outstandingAmount
          }
        }
      })
    })

    return { faturadoFechadas, emAberto, recebido, inadimplencia }
  }, [timelineData])

  const canView =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'master' ||
    currentUser?.role === 'receptionist' ||
    currentUser?.role === 'financial' ||
    currentUser?.role === 'dentist' ||
    checkPermission('finances')

  if (currentUser && !canView) return <Navigate to="/" replace />

  const handleInvoiceSent = async (dentistId: string) => {
    const { error } = await supabase.from('billing_controls' as any).insert({
      dentist_id: dentistId,
      month: selectedMonth,
      status: 'sent',
    })

    if (error && error.code !== '23505') {
      return toast({
        title: 'Erro',
        description: 'Não foi possível registrar o envio da fatura.',
        variant: 'destructive',
      })
    }

    toast({ title: 'Fatura marcada como enviada com sucesso!' })
    setBillingControls((prev) => [
      ...prev,
      { dentist_id: dentistId, month: selectedMonth, status: 'sent' },
    ])
  }

  const handleSettle = async () => {
    if (!settleDialog) return
    const { dentist, outstandingAmount, cycleOrders } = settleDialog

    const ordersToSettle = cycleOrders.filter((o: any) => o.outstandingCost > 0)

    const snapshot = ordersToSettle.map((o: any) => ({
      orderId: o.id,
      friendlyId: o.friendlyId,
      patientName: o.patientName,
      workType: o.workType,
      clearedAmount: o.outstandingCost,
    }))

    const { error } = await supabase.from('settlements').insert({
      dentist_id: dentist.id,
      amount: outstandingAmount,
      orders_snapshot: snapshot,
    })

    if (error) {
      return toast({
        title: 'Erro',
        description: 'Não foi possível liquidar o pagamento.',
        variant: 'destructive',
      })
    }

    const updates = ordersToSettle.map((o: any) =>
      supabase.from('orders').update({ cleared_balance: o.completedCost }).eq('id', o.id),
    )
    await Promise.all(updates)

    toast({ title: 'Pagamento Liquidado com Sucesso!' })
    setSettleDialog(null)
    refreshOrders()
  }

  const selectedMonthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label

  const handleExportAllClosed = () => {
    const monthFilteredOrders = filterOrdersForFinancials(filteredOrders, selectedMonth)
    const closedOrders = monthFilteredOrders.filter(
      (o) => o.status === 'completed' || o.status === 'delivered',
    )

    const headers = [
      'Pedido',
      'Paciente',
      'Dentista',
      'Trabalho',
      'Valor Base',
      'Valor Efetivo',
      'Data de Conclusão',
      'Status Pagamento',
    ]
    const rows = closedOrders.map((o) => {
      const fin = getOrderFinancials(o, priceList)
      const compDate = getOrderCompletionDate(o)
      const isPaid = fin.outstandingCost === 0 ? 'Pago' : 'Pendente'
      return [
        o.friendlyId,
        o.patientName,
        o.dentistName || 'Desconhecido',
        o.workType,
        formatBRL(fin.basePrice),
        formatBRL(fin.completedCost),
        compDate ? format(compDate, 'dd/MM/yyyy') : '-',
        isPaid,
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n')

    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Casos_Fechados_${selectedMonthLabel?.replace(/\s/g, '_') || selectedMonth}.csv`
    link.click()
  }

  const handleExportExcel = () => {
    if (!detailsDialog) return
    const orders = detailsDialog.isOpen
      ? [...detailsDialog.cycleOrders, ...detailsDialog.pendingOrders]
      : detailsDialog.cycleOrders

    const headers = [
      'Pedido',
      'Paciente',
      'Trabalho',
      'Status',
      'Qtd',
      'Valor Unitário',
      'Valor Total',
    ]
    const rows = orders.map((o: any) => [
      o.friendlyId,
      o.patientName,
      o.workType,
      o.status,
      o.quantity,
      o.effectiveUnitPrice,
      o.status === 'pending' || o.status === 'in_production' ? o.pipelineCost : o.outstandingCost,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n')

    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Fatura_${detailsDialog.dentist.name}_${selectedMonth}.csv`
    link.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FATURA EM ABERTO':
        return 'bg-muted text-muted-foreground border-muted-foreground/30'
      case 'PENDENTE':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'VENCIDO':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'ENVIADO':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'LIQUIDADO':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FATURA EM ABERTO':
        return <Activity className="w-3 h-3 mr-1" />
      case 'PENDENTE':
        return <Clock className="w-3 h-3 mr-1" />
      case 'VENCIDO':
        return <AlertCircle className="w-3 h-3 mr-1" />
      case 'ENVIADO':
        return <Send className="w-3 h-3 mr-1" />
      case 'LIQUIDADO':
        return <CheckCircle2 className="w-3 h-3 mr-1" />
      default:
        return null
    }
  }

  const [yearStr, monthStr] = selectedMonth.split('-')
  const timelineMonthShort = format(new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1), 'MMM', {
    locale: ptBR,
  }).toUpperCase()

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary uppercase">
              Contas a Receber
            </h2>
            <p className="text-muted-foreground text-sm">
              Gerenciamento de faturamento e recebimentos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {currentUser?.role !== 'dentist' && (
            <Button
              variant="outline"
              onClick={handleExportAllClosed}
              className="hidden sm:flex bg-background border-border"
            >
              <Download className="w-4 h-4 mr-2" /> Exportar Fechados
            </Button>
          )}

          <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm flex-1 sm:flex-initial">
            <CalendarDays className="w-4 h-4 text-muted-foreground ml-2" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[180px] border-0 bg-transparent shadow-none focus:ring-0">
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-subtle border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              {currentUser?.role === 'dentist' ? 'Faturado no Mês' : `Faturado (Fechadas)`}
            </CardTitle>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatBRL(topCardsData.faturadoFechadas)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-l-4 border-l-amber-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              {currentUser?.role === 'dentist' ? 'Estimativa Aberta' : `Em Aberto (Estimativa)`}
            </CardTitle>
            <Activity className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatBRL(topCardsData.emAberto)}
            </div>
          </CardContent>
        </Card>

        {currentUser?.role !== 'dentist' && (
          <>
            <Card className="shadow-subtle border-l-4 border-l-blue-500">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Recebido (Liquidadas)
                </CardTitle>
                <CheckCircle className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatBRL(topCardsData.recebido)}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-subtle border-l-4 border-l-red-500">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Inadimplência (Vencidas)
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatBRL(topCardsData.inadimplencia)}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="producao" className="w-full mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="producao">PRODUÇÃO EM R$</TabsTrigger>
          <TabsTrigger value="faturas">FATURAS FECHADAS</TabsTrigger>
        </TabsList>

        <TabsContent value="producao" className="mt-0">
          <Card className="shadow-subtle border-0 bg-transparent sm:bg-card sm:border">
            <CardHeader className="px-0 sm:px-6 pb-2 pt-0 sm:pt-6">
              <CardTitle className="hidden sm:block">Painel de Produção Operacional</CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
                      Trabalhos Finalizados no Mês
                    </p>
                  </div>
                  <p className="text-3xl font-extrabold text-emerald-700">
                    {formatBRL(producaoData.totalFinalized)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">
                    Trabalhos finalizados no mês calendário selecionado
                  </p>
                </div>
                <div className="p-5 bg-amber-50 border border-amber-100 rounded-xl shadow-sm flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                      Total de Trabalhos em Pipeline
                    </p>
                  </div>
                  <p className="text-3xl font-extrabold text-amber-700">
                    {formatBRL(producaoData.totalPipeline)}
                  </p>
                  <p className="text-xs text-amber-600 mt-1 font-medium">
                    Trabalhos pendentes ou em produção no momento
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 mt-4 sm:mt-0">
              <div className="border rounded-lg bg-background shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="py-3 px-4">Dentista / Clínica</TableHead>
                      <TableHead className="py-3 px-4 text-right">Finalizados no Mês</TableHead>
                      <TableHead className="py-3 px-4 text-right">Em Produção (Pipeline)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {producaoData.list.map((item) => (
                      <TableRow
                        key={item.dentist.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <TableCell className="py-3 px-4">
                          <div className="font-semibold text-foreground">{item.dentist.name}</div>
                          <div className="text-xs text-muted-foreground font-medium">
                            {item.dentist.clinic || 'Clínica não informada'}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right font-bold text-emerald-600">
                          {formatBRL(item.finalized)}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right font-semibold text-amber-600">
                          {formatBRL(item.pipeline)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {producaoData.list.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          Nenhum registro de produção encontrado para este período.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faturas" className="mt-0">
          <Card className="shadow-subtle border-0 bg-transparent sm:bg-card sm:border">
            <CardContent className="p-0 sm:p-6">
              <div className="hidden md:grid grid-cols-[140px_1fr_120px_120px_130px] gap-4 px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 rounded-t-lg border-b ml-[4.5rem]">
                <div>Status</div>
                <div>Dentista / Clínica</div>
                <div className="text-right">Faturado</div>
                <div className="text-right">Aberto/Prev.</div>
                <div className="text-center">Ações</div>
              </div>

              <div className="mt-4 sm:mt-0 space-y-0">
                {closedFaturas.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground bg-background rounded-lg border sm:border-0 sm:bg-transparent">
                    Nenhuma fatura fechada apurada para este período.
                  </div>
                ) : (
                  closedFaturas.map(({ day, items }, groupIdx) => {
                    const isLastGroup = groupIdx === closedFaturas.length - 1
                    return (
                      <div key={day} className="flex relative">
                        {/* Timeline Date Column */}
                        <div className="flex flex-col items-center mr-4 sm:mr-6 w-14 shrink-0">
                          <div className="w-14 h-14 rounded-xl border-2 border-border bg-background flex flex-col items-center justify-center z-10 shadow-sm mt-3">
                            <span className="text-xl font-bold leading-none text-foreground">
                              {day}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5 tracking-wider">
                              {timelineMonthShort}
                            </span>
                          </div>
                          {!isLastGroup && <div className="w-0.5 bg-border flex-1 my-2"></div>}
                        </div>

                        {/* Timeline Items Column */}
                        <div className="flex-1 pb-8 pt-3 space-y-3 min-w-0">
                          {items.map((item) => (
                            <Card
                              key={item.id}
                              className="shadow-sm border border-border/60 hover:border-primary/30 transition-colors overflow-hidden"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_120px_120px_130px] gap-3 md:gap-4 items-center p-3 sm:p-4">
                                <div>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'font-semibold border uppercase text-[10px] tracking-wider w-fit flex items-center',
                                      getStatusColor(item.status),
                                    )}
                                  >
                                    {getStatusIcon(item.status)}
                                    {item.status}
                                  </Badge>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-foreground truncate text-sm sm:text-base">
                                    {item.dentist.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate font-medium">
                                    {item.dentist.clinic || 'Clínica não informada'}
                                  </div>
                                </div>
                                <div className="md:text-right flex justify-between md:block items-center">
                                  <span className="text-xs text-muted-foreground md:hidden uppercase font-semibold">
                                    Faturado:
                                  </span>
                                  <span
                                    className={cn(
                                      'font-bold text-sm sm:text-base',
                                      item.invoicedAmount > 0
                                        ? 'text-foreground'
                                        : 'text-muted-foreground/50',
                                    )}
                                  >
                                    {formatBRL(item.invoicedAmount)}
                                  </span>
                                </div>
                                <div className="md:text-right flex justify-between md:block items-center">
                                  <span className="text-xs text-muted-foreground md:hidden uppercase font-semibold">
                                    Em Aberto/Prev:
                                  </span>
                                  <span
                                    className={cn(
                                      'font-semibold text-sm sm:text-base',
                                      item.pipelineAmount > 0
                                        ? 'text-amber-600'
                                        : 'text-muted-foreground/50',
                                    )}
                                  >
                                    {formatBRL(item.pipelineAmount)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-0 border-border/50">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={() => setDetailsDialog(item)}
                                    title="Ver Detalhes"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {currentUser?.role !== 'dentist' && (
                                    <>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className={cn(
                                          'h-8 w-8 transition-colors',
                                          item.isSent
                                            ? 'text-blue-500 hover:bg-blue-50 hover:text-blue-600'
                                            : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50',
                                        )}
                                        disabled={
                                          item.isOpen || item.isSent || item.invoicedAmount <= 0
                                        }
                                        onClick={() => handleInvoiceSent(item.dentist.id)}
                                        title={
                                          item.isSent ? 'Fatura Enviada' : 'Marcar como Enviada'
                                        }
                                      >
                                        <Send className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className={cn(
                                          'h-8 w-8 transition-colors',
                                          item.status === 'LIQUIDADO'
                                            ? 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600'
                                            : 'text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50',
                                        )}
                                        disabled={item.isOpen || item.outstandingAmount <= 0}
                                        onClick={() => setSettleDialog(item)}
                                        title={
                                          item.status === 'LIQUIDADO' ? 'Liquidado' : 'Liquidar'
                                        }
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!detailsDialog} onOpenChange={(open) => !open && setDetailsDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
            <DialogTitle className="flex flex-col">
              <span>Fatura - {detailsDialog?.dentist.name}</span>
              <span className="text-sm font-normal text-muted-foreground mt-1">
                Ciclo: {detailsDialog && format(detailsDialog.cycleStart, 'dd/MM/yyyy')} a{' '}
                {detailsDialog && format(detailsDialog.closeDate, 'dd/MM/yyyy')}
              </span>
            </DialogTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportExcel}
                className="flex-1 sm:flex-initial"
              >
                <Download className="w-4 h-4 mr-2" /> CSV
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 pb-4 mt-2">
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary uppercase tracking-wider">
                <Wallet className="w-4 h-4" /> Faturado no Ciclo (Finalizados)
              </h4>
              <div className="border rounded-md shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="h-10 py-2">Pedido</TableHead>
                      <TableHead className="h-10 py-2">Trabalho</TableHead>
                      <TableHead className="h-10 py-2 text-center">Qtd.</TableHead>
                      <TableHead className="h-10 py-2 text-right">Unitário</TableHead>
                      <TableHead className="h-10 py-2 text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsDialog?.cycleOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          Nenhum pedido finalizado neste ciclo.
                        </TableCell>
                      </TableRow>
                    )}
                    {detailsDialog?.cycleOrders.map((o: any) => (
                      <TableRow key={o.id}>
                        <TableCell className="py-2.5 font-medium">
                          {o.friendlyId}
                          <div className="text-xs text-muted-foreground font-normal">
                            {o.patientName}
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 text-muted-foreground">{o.workType}</TableCell>
                        <TableCell className="py-2.5 text-center text-muted-foreground">
                          {o.quantity}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-muted-foreground">
                          {formatBRL(o.effectiveUnitPrice || 0)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-semibold">
                          {formatBRL(o.completedCost)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {detailsDialog?.isOpen && detailsDialog?.pendingOrders.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-amber-600 uppercase tracking-wider">
                  <Activity className="w-4 h-4" /> Em Produção (Estimativa)
                </h4>
                <div className="border rounded-md shadow-sm">
                  <Table>
                    <TableHeader className="bg-amber-50/50">
                      <TableRow>
                        <TableHead className="h-10 py-2">Pedido</TableHead>
                        <TableHead className="h-10 py-2">Trabalho</TableHead>
                        <TableHead className="h-10 py-2 text-center">Qtd.</TableHead>
                        <TableHead className="h-10 py-2 text-right">Unitário</TableHead>
                        <TableHead className="h-10 py-2 text-right">Estimativa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailsDialog?.pendingOrders.map((o: any) => (
                        <TableRow key={o.id}>
                          <TableCell className="py-2.5 font-medium">
                            {o.friendlyId}
                            <div className="text-xs text-muted-foreground font-normal">
                              {o.patientName}
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 text-muted-foreground">
                            {o.workType}
                          </TableCell>
                          <TableCell className="py-2.5 text-center text-muted-foreground">
                            {o.quantity}
                          </TableCell>
                          <TableCell className="py-2.5 text-right text-muted-foreground">
                            {formatBRL(o.effectiveUnitPrice || 0)}
                          </TableCell>
                          <TableCell className="py-2.5 text-right font-semibold text-amber-700">
                            {formatBRL(o.pipelineCost)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!settleDialog} onOpenChange={(open) => !open && setSettleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Liquidação</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Você está prestes a liquidar o saldo devedor do ciclo encerrado em{' '}
              <strong>{settleDialog && format(settleDialog.closeDate, 'dd/MM/yyyy')}</strong> para o
              dentista <strong>{settleDialog?.dentist.name}</strong>.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 flex items-center justify-between">
              <span className="font-semibold text-emerald-800">Valor a Liquidar:</span>
              <span className="text-xl font-bold text-emerald-600">
                {settleDialog && formatBRL(settleDialog.outstandingAmount)}
              </span>
            </div>
            <p className="text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              Atenção: Esta ação registrará o pagamento e zerará o saldo destes pedidos específicos.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettleDialog(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSettle}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Recebimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
