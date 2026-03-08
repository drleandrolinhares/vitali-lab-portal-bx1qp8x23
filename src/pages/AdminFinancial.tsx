import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { getOrderFinancials, PriceItem, formatBRL } from '@/lib/financial'
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
import { TrendingUp, Wallet, CheckCircle, TrendingDown, DollarSign } from 'lucide-react'
import { Navigate } from 'react-router-dom'

export default function AdminFinancial() {
  const { currentUser, orders, kanbanStages, refreshOrders } = useAppStore()
  const [priceList, setPriceList] = useState<PriceItem[]>([])
  const [dentists, setDentists] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [settleDialog, setSettleDialog] = useState<any>(null)

  useEffect(() => {
    supabase
      .from('price_list')
      .select('id, work_type, price_stages(*)')
      .then(({ data }) => {
        if (data) setPriceList(data as PriceItem[])
      })
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

  const financials = useMemo(() => {
    return orders.map((o) => getOrderFinancials(o, priceList, kanbanStages))
  }, [orders, priceList, kanbanStages])

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'receptionist')
    return <Navigate to="/" replace />

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyRevenue = useMemo(
    () =>
      orders.reduce((acc, o) => {
        const isCompletedThisMonth = o.history.some(
          (h: any) =>
            (h.status === 'completed' || h.status === 'delivered') &&
            new Date(h.date).getMonth() === currentMonth &&
            new Date(h.date).getFullYear() === currentYear,
        )
        if (isCompletedThisMonth) {
          const orderFin = getOrderFinancials(o, priceList, kanbanStages)
          return acc + orderFin.totalCost
        }
        return acc
      }, 0),
    [orders, priceList, kanbanStages],
  )

  const monthlyExpenses = useMemo(
    () =>
      expenses
        .filter(
          (e) =>
            new Date(e.due_date + 'T00:00:00').getMonth() === currentMonth &&
            new Date(e.due_date + 'T00:00:00').getFullYear() === currentYear,
        )
        .reduce((acc, e) => acc + Number(e.amount), 0),
    [expenses],
  )

  const monthlyProfit = monthlyRevenue - monthlyExpenses
  const profitability = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0

  const dentistStats = dentists
    .map((d) => {
      const dentistOrders = financials.filter((o) => o.dentistId === d.id)
      const outstandingBalance = dentistOrders.reduce((acc, o) => acc + o.outstandingCost, 0)
      return { ...d, outstandingBalance, dentistOrders }
    })
    .filter((d) => d.outstandingBalance > 0 || d.dentistOrders.length > 0)

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
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

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="shadow-subtle border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Receitas do Mês
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
              Despesas do Mês
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
            <Wallet className="w-5 h-5 text-muted-foreground" /> Contas a Receber (Por Dentista)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dentista / Clínica</TableHead>
                <TableHead>Fechamento</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Saldo Devedor</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dentistStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhum dado encontrado.
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
                  <TableCell>{d.closing_date ? `Dia ${d.closing_date}` : '-'}</TableCell>
                  <TableCell>{d.payment_due_date ? `Dia ${d.payment_due_date}` : '-'}</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">
                    {formatBRL(d.outstandingBalance)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      disabled={d.outstandingBalance <= 0}
                      onClick={() => setSettleDialog(d)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Liquidar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!settleDialog} onOpenChange={(open) => !open && setSettleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Liquidação</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Você está prestes a liquidar o saldo devedor atual de{' '}
              <strong>{settleDialog?.name}</strong>. Isso arquivará o valor de{' '}
              <strong>{settleDialog && formatBRL(settleDialog.outstandingBalance)}</strong> no
              histórico de pagamentos e zerará o saldo pendente do dentista.
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
