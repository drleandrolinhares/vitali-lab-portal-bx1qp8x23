import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  getOrderFinancials,
  formatBRL,
  generateMonthOptions,
  filterOrdersForFinancials,
} from '@/lib/financial'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  TrendingUp,
  Wallet,
  CheckCircle,
  TrendingDown,
  DollarSign,
  BarChart3,
  List,
  Activity,
  CalendarDays,
  Search,
  Send,
  Download,
  FileText,
} from 'lucide-react'
import { Navigate, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { DentistBillingTab } from '@/components/financial/DentistBillingTab'

export default function AdminFinancial() {
  const { currentUser, orders, refreshOrders, selectedLab, priceList, dreCategories } =
    useAppStore()
  const [dentists, setDentists] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [billingControls, setBillingControls] = useState<any[]>([])
  const [settleDialog, setSettleDialog] = useState<any>(null)
  const [detailsDialog, setDetailsDialog] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
    supabase
      .from('expenses')
      .select('*')
      .then(({ data }) => {
        if (data) setExpenses(data)
      })
  }, [])

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

  const monthFilteredOrders = useMemo(
    () => filterOrdersForFinancials(filteredOrders, selectedMonth),
    [filteredOrders, selectedMonth],
  )

  const financials = useMemo(() => {
    return monthFilteredOrders.map((o) => getOrderFinancials(o, priceList))
  }, [monthFilteredOrders, priceList])

  const monthlyRevenue = useMemo(
    () =>
      financials.reduce((acc, o) => {
        if (o.status === 'completed' || o.status === 'delivered') {
          return acc + o.totalCost
        }
        return acc
      }, 0),
    [financials],
  )

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (selectedLab === 'Todos') return true
      return (e.sector || '').trim().toUpperCase() === selectedLab.trim().toUpperCase()
    })
  }, [expenses, selectedLab])

  const revenueCategories = useMemo(() => {
    return dreCategories.filter((c) => c.category_type === 'revenue').map((c) => c.name)
  }, [dreCategories])

  const monthlyExpenses = useMemo(
    () =>
      filteredExpenses
        .filter((e) => {
          const isRevenue =
            revenueCategories.includes(e.dre_category) ||
            e.dre_category === 'Receita' ||
            e.category === 'Serviços Realizados'
          return e.due_date && e.due_date.startsWith(selectedMonth) && !isRevenue
        })
        .reduce((acc, e) => acc + Number(e.amount), 0),
    [filteredExpenses, selectedMonth, revenueCategories],
  )

  const monthlyProfit = monthlyRevenue - monthlyExpenses
  const profitability = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0

  const dentistStats = dentists
    .map((d) => {
      const dentistOrders = financials.filter((o) => o.dentistId === d.id)
      const outstandingBalance = dentistOrders.reduce((acc, o) => acc + o.outstandingCost, 0)
      const pipelineBalance = dentistOrders.reduce((acc, o) => acc + o.pipelineCost, 0)
      const invoiceSent = billingControls.some((b) => b.dentist_id === d.id)
      return { ...d, outstandingBalance, pipelineBalance, dentistOrders, invoiceSent }
    })
    .filter((d) => d.outstandingBalance > 0 || d.pipelineBalance > 0)
    .sort((a, b) => {
      const aDue = a.payment_due_date || 999
      const bDue = b.payment_due_date || 999
      if (aDue !== bDue) return aDue - bDue
      return a.name.localeCompare(b.name)
    })

  const displayedDentists = dentistStats.filter((d) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      d.name.toLowerCase().includes(searchLower) ||
      (d.clinic && d.clinic.toLowerCase().includes(searchLower))

    if (searchQuery.trim() !== '') {
      return matchesSearch
    }
    return !d.invoiceSent
  })

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'receptionist')
    return <Navigate to="/" replace />

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
    const { id: dentistId, outstandingBalance, dentistOrders } = settleDialog

    const ordersToSettle = dentistOrders.filter((o: any) => o.outstandingCost > 0)

    const snapshot = ordersToSettle.map((o: any) => ({
      orderId: o.id,
      friendlyId: o.friendlyId,
      patientName: o.patientName,
      workType: o.workType,
      clearedAmount: o.outstandingCost,
    }))

    const { error } = await supabase.from('settlements').insert({
      dentist_id: dentistId,
      amount: outstandingBalance,
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

  const handleExportExcel = () => {
    if (!detailsDialog) return
    const orders = detailsDialog.dentistOrders.filter(
      (o: any) => o.outstandingCost > 0 || o.pipelineCost > 0,
    )

    const headers = [
      'Pedido',
      'Paciente',
      'Trabalho',
      'Status',
      'Qtd',
      'Valor Unitário',
      'Saldo Devedor',
      'Estimativa Pipeline',
    ]
    const rows = orders.map((o: any) => [
      o.friendlyId,
      o.patientName,
      o.workType,
      o.status,
      o.quantity,
      o.effectiveUnitPrice,
      o.outstandingCost,
      o.pipelineCost,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n')

    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Fechamento_${detailsDialog.name}_${selectedMonth}.csv`
    link.click()
  }

  const handleExportPDF = () => {
    if (!detailsDialog) return
    const orders = detailsDialog.dentistOrders.filter(
      (o: any) => o.outstandingCost > 0 || o.pipelineCost > 0,
    )

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Fechamento - ${detailsDialog.name}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h2, h3 { margin: 0 0 10px 0; color: #111; }
            p { margin: 0 0 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-size: 13px; }
            th { background-color: #f9fafb; font-weight: 600; color: #374151; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-row { font-weight: bold; background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <div style="margin-bottom: 30px;">
            <h2>Fechamento Financeiro</h2>
            <p><strong>Dentista / Clínica:</strong> ${detailsDialog.name} ${
              detailsDialog.clinic ? `(${detailsDialog.clinic})` : ''
            }</p>
            <p><strong>Mês de Referência:</strong> ${selectedMonthLabel}</p>
          </div>
          
          <h3>Trabalhos Finalizados (Saldo Devedor)</h3>
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Paciente</th>
                <th>Trabalho</th>
                <th class="text-center">Qtd.</th>
                <th class="text-right">Unitário</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${
                orders.filter((o: any) => o.outstandingCost > 0).length === 0
                  ? `<tr><td colspan="6" class="text-center">Nenhum pedido finalizado</td></tr>`
                  : orders
                      .filter((o: any) => o.outstandingCost > 0)
                      .map(
                        (o: any) => `
                <tr>
                  <td>${o.friendlyId}</td>
                  <td>${o.patientName}</td>
                  <td>${o.workType}</td>
                  <td class="text-center">${o.quantity}</td>
                  <td class="text-right">${formatBRL(o.effectiveUnitPrice || 0)}</td>
                  <td class="text-right">${formatBRL(o.outstandingCost)}</td>
                </tr>
              `,
                      )
                      .join('')
              }
              <tr class="total-row">
                <td colspan="5" class="text-right">Total Faturado:</td>
                <td class="text-right">${formatBRL(detailsDialog.outstandingBalance)}</td>
              </tr>
            </tbody>
          </table>

          <h3>Pipeline (Em Produção neste Mês)</h3>
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Paciente</th>
                <th>Trabalho</th>
                <th class="text-center">Qtd.</th>
                <th class="text-right">Unitário</th>
                <th class="text-right">Estimativa</th>
              </tr>
            </thead>
            <tbody>
              ${
                orders.filter((o: any) => o.pipelineCost > 0).length === 0
                  ? `<tr><td colspan="6" class="text-center">Nenhum pedido em produção</td></tr>`
                  : orders
                      .filter((o: any) => o.pipelineCost > 0)
                      .map(
                        (o: any) => `
                <tr>
                  <td>${o.friendlyId}</td>
                  <td>${o.patientName}</td>
                  <td>${o.workType}</td>
                  <td class="text-center">${o.quantity}</td>
                  <td class="text-right">${formatBRL(o.effectiveUnitPrice || 0)}</td>
                  <td class="text-right">${formatBRL(o.pipelineCost)}</td>
                </tr>
              `,
                      )
                      .join('')
              }
              <tr class="total-row">
                <td colspan="5" class="text-right">Total Estimado:</td>
                <td class="text-right">${formatBRL(detailsDialog.pipelineBalance)}</td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center;">
            <p>Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
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
              Gerenciamento de faturamento e recebimentos do laboratório.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
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

          <Button asChild variant="outline" className="hidden sm:flex">
            <Link to="/dre">
              <BarChart3 className="w-4 h-4 mr-2" /> Relatório DRE
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="shadow-subtle border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Receitas ({selectedMonthLabel})
            </CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatBRL(monthlyRevenue)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-red-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Despesas ({selectedMonthLabel})
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatBRL(monthlyExpenses)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-blue-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Lucro Operacional
            </CardTitle>
            <Wallet className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatBRL(monthlyProfit)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-purple-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Rentabilidade (%)
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{profitability.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="geral" className="w-full mt-8">
        <TabsList className="mb-2">
          <TabsTrigger value="geral">Visão Consolidada</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento Dentistas</TabsTrigger>
        </TabsList>
        <TabsContent value="geral" className="mt-0">
          <Card className="shadow-subtle">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-muted-foreground" /> Contas a Receber do Período (
                {selectedMonthLabel})
                {displayedDentists.length > 0 && (
                  <div className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-sm font-bold ml-2">
                    {displayedDentists.length} pendentes
                  </div>
                )}
              </CardTitle>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar dentista (exibe faturas enviadas)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 py-2">Dentista / Clínica</TableHead>
                    <TableHead className="h-10 py-2 text-center">Vencimento</TableHead>
                    <TableHead className="h-10 py-2 text-right">Pipeline no Mês</TableHead>
                    <TableHead className="h-10 py-2 text-right">Saldo Devedor (Faturado)</TableHead>
                    <TableHead className="h-10 py-2 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedDentists.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchQuery
                          ? 'Nenhum dentista encontrado para a busca.'
                          : 'Nenhum faturamento pendente para este mês.'}
                      </TableCell>
                    </TableRow>
                  )}
                  {displayedDentists.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="py-2.5 font-medium">
                        {d.name}
                        <div className="text-xs text-muted-foreground font-normal mt-0.5">
                          {d.clinic || 'Clínica não informada'}
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-center text-muted-foreground">
                        {d.payment_due_date ? `Dia ${d.payment_due_date}` : '-'}
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-medium text-amber-600">
                        {formatBRL(d.pipelineBalance)}
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-bold text-red-600">
                        {formatBRL(d.outstandingBalance)}
                      </TableCell>
                      <TableCell className="py-2.5 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Button size="sm" variant="ghost" onClick={() => setDetailsDialog(d)}>
                            <List className="w-4 h-4 mr-1.5" /> Detalhes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                            disabled={d.invoiceSent}
                            onClick={() => handleInvoiceSent(d.id)}
                          >
                            {d.invoiceSent ? (
                              <CheckCircle className="w-4 h-4 mr-1.5" />
                            ) : (
                              <Send className="w-4 h-4 mr-1.5" />
                            )}
                            {d.invoiceSent ? 'Fatura Enviada' : 'FATURA ENVIADA'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                            disabled={d.outstandingBalance <= 0}
                            onClick={() => setSettleDialog(d)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Liquidar Mês
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faturamento" className="mt-0">
          <DentistBillingTab
            selectedMonth={selectedMonth}
            dentists={dentists}
            selectedMonthLabel={selectedMonthLabel}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!detailsDialog} onOpenChange={(open) => !open && setDetailsDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
            <DialogTitle>
              Detalhes Financeiros - {detailsDialog?.name} ({selectedMonthLabel})
            </DialogTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportExcel}
                className="flex-1 sm:flex-initial"
              >
                <Download className="w-4 h-4 mr-2" /> Excel
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportPDF}
                className="flex-1 sm:flex-initial"
              >
                <FileText className="w-4 h-4 mr-2" /> PDF
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 pb-4">
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-red-600">
                <Wallet className="w-4 h-4" /> Saldo Devedor (Finalizados no Mês)
              </h4>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-10 py-2">Pedido</TableHead>
                      <TableHead className="h-10 py-2">Trabalho</TableHead>
                      <TableHead className="h-10 py-2 text-center">Qtd.</TableHead>
                      <TableHead className="h-10 py-2 text-right">Unitário</TableHead>
                      <TableHead className="h-10 py-2 text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsDialog?.dentistOrders.filter((o: any) => o.outstandingCost > 0)
                      .length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          Nenhum pedido finalizado pendente para este mês.
                        </TableCell>
                      </TableRow>
                    )}
                    {detailsDialog?.dentistOrders
                      .filter((o: any) => o.outstandingCost > 0)
                      .map((o: any) => (
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
                          <TableCell className="py-2.5 text-right font-medium">
                            {formatBRL(o.outstandingCost)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-amber-600">
                <Activity className="w-4 h-4" /> Pipeline (Em Produção neste Mês)
              </h4>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-10 py-2">Pedido</TableHead>
                      <TableHead className="h-10 py-2">Trabalho</TableHead>
                      <TableHead className="h-10 py-2 text-center">Qtd.</TableHead>
                      <TableHead className="h-10 py-2 text-right">Unitário</TableHead>
                      <TableHead className="h-10 py-2 text-right">Estimativa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsDialog?.dentistOrders.filter((o: any) => o.pipelineCost > 0).length ===
                      0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          Nenhum pedido em produção.
                        </TableCell>
                      </TableRow>
                    )}
                    {detailsDialog?.dentistOrders
                      .filter((o: any) => o.pipelineCost > 0)
                      .map((o: any) => (
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
                          <TableCell className="py-2.5 text-right font-medium">
                            {formatBRL(o.pipelineCost)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!settleDialog} onOpenChange={(open) => !open && setSettleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Liquidação do Mês</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Você está prestes a liquidar o saldo devedor de <strong>{selectedMonthLabel}</strong>{' '}
              para o dentista <strong>{settleDialog?.name}</strong>. Isso arquivará o valor de{' '}
              <strong>{settleDialog && formatBRL(settleDialog.outstandingBalance)}</strong> no
              histórico de pagamentos e zerará o saldo destes pedidos específicos.
            </p>
            <p className="text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              Atenção: Esta ação não pode ser desfeita.
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
              Confirmar Liquidação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
