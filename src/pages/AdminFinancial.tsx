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
} from 'lucide-react'
import { Navigate, Link } from 'react-router-dom'
import { format } from 'date-fns'

export default function AdminFinancial() {
  const { currentUser, orders, refreshOrders, selectedLab, priceList, dreCategories } =
    useAppStore()
  const [dentists, setDentists] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
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
    supabase
      .from('expenses')
      .select('*')
      .then(({ data }) => {
        if (data) setExpenses(data)
      })
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedLab === 'Todos') return true
      return (o.sector || '').trim().toUpperCase() === selectedLab.trim().toUpperCase()
    })
  }, [orders, selectedLab])

  // Filter orders and expenses by the selected month
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
          // Avoid double counting auto-generated revenue records as expenses
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
      return { ...d, outstandingBalance, pipelineBalance, dentistOrders }
    })
    .filter((d) => d.outstandingBalance > 0 || d.pipelineBalance > 0)

  const dentistsWithOutstanding = dentistStats.filter((d) => d.outstandingBalance > 0)

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'receptionist')
    return <Navigate to="/" replace />

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Painel Financeiro</h2>
            <p className="text-muted-foreground text-sm">
              Resultados operacionais, lucros e contas a receber.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
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

      <Card className="shadow-subtle mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-muted-foreground" /> Contas a Receber do Período (
            {selectedMonthLabel})
            {dentistStats.length > 0 && (
              <div className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-sm font-bold ml-2">
                {dentistsWithOutstanding.length}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dentista / Clínica</TableHead>
                <TableHead className="text-right">Pipeline no Mês</TableHead>
                <TableHead className="text-right">Saldo Devedor (Faturado)</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dentistStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum pedido registrado ou pendente para este mês.
                  </TableCell>
                </TableRow>
              )}
              {dentistStats.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">
                    {d.name}
                    <div className="text-xs text-muted-foreground font-normal">
                      {d.clinic || 'Clínica não informada'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-amber-600">
                    {formatBRL(d.pipelineBalance)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {formatBRL(d.outstandingBalance)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setDetailsDialog(d)}>
                        <List className="w-4 h-4 mr-1.5" /> Detalhes
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

      <Dialog open={!!detailsDialog} onOpenChange={(open) => !open && setDetailsDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Detalhes Financeiros - {detailsDialog?.name} ({selectedMonthLabel})
            </DialogTitle>
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
                      <TableHead>Pedido</TableHead>
                      <TableHead>Trabalho</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsDialog?.dentistOrders.filter((o: any) => o.outstandingCost > 0)
                      .length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                          Nenhum pedido finalizado pendente para este mês.
                        </TableCell>
                      </TableRow>
                    )}
                    {detailsDialog?.dentistOrders
                      .filter((o: any) => o.outstandingCost > 0)
                      .map((o: any) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">
                            {o.friendlyId}
                            <div className="text-xs text-muted-foreground font-normal">
                              {o.patientName}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{o.workType}</TableCell>
                          <TableCell className="text-right font-medium">
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
                      <TableHead>Pedido</TableHead>
                      <TableHead>Trabalho</TableHead>
                      <TableHead className="text-right">Estimativa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsDialog?.dentistOrders.filter((o: any) => o.pipelineCost > 0).length ===
                      0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                          Nenhum pedido em produção.
                        </TableCell>
                      </TableRow>
                    )}
                    {detailsDialog?.dentistOrders
                      .filter((o: any) => o.pipelineCost > 0)
                      .map((o: any) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">
                            {o.friendlyId}
                            <div className="text-xs text-muted-foreground font-normal">
                              {o.patientName}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{o.workType}</TableCell>
                          <TableCell className="text-right font-medium">
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
