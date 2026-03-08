import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { formatBRL } from '@/lib/financial'
import { format } from 'date-fns'
import {
  Plus,
  DollarSign,
  Calendar,
  TrendingDown,
  CheckCircle,
  Trash2,
  XCircle,
} from 'lucide-react'

export default function AccountsPayable() {
  const { selectedLab, logAudit } = useAppStore()
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    cost_center: 'Fixo',
    due_date: '',
    amount: '',
  })

  const fetchExpenses = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .order('due_date', { ascending: true })
    if (data) setExpenses(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => selectedLab === 'Todos' || e.sector === selectedLab)
  }, [expenses, selectedLab])

  const handleSave = async () => {
    if (!formData.description || !formData.amount || !formData.due_date) {
      return toast({ title: 'Preencha todos os campos.', variant: 'destructive' })
    }

    const { error } = await supabase.from('expenses').insert({
      description: formData.description,
      cost_center: formData.cost_center,
      due_date: formData.due_date,
      amount: Number(formData.amount.replace(/[^0-9,-]+/g, '').replace(',', '.')),
      sector: selectedLab === 'Todos' ? 'Soluções Cerâmicas' : selectedLab,
      status: 'pending',
    })

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Despesa registrada com sucesso!' })
      setModalOpen(false)
      setFormData({ description: '', cost_center: 'Fixo', due_date: '', amount: '' })
      fetchExpenses()
    }
  }

  const markAsPaid = async (id: string) => {
    const { error } = await supabase.from('expenses').update({ status: 'paid' }).eq('id', id)
    if (!error) {
      toast({ title: 'Despesa marcada como paga' })
      fetchExpenses()
    }
  }

  const cancelPayment = async (expense: any) => {
    if (!confirm('Deseja cancelar o pagamento desta despesa?')) return
    const { error } = await supabase
      .from('expenses')
      .update({ status: 'pending' })
      .eq('id', expense.id)
    if (!error) {
      toast({ title: 'Pagamento cancelado' })
      logAudit('CANCEL_PAYMENT', 'expense', expense.id, {
        description: expense.description,
        amount: expense.amount,
      })
      fetchExpenses()
    } else {
      toast({ title: 'Erro ao cancelar', description: error.message, variant: 'destructive' })
    }
  }

  const deleteExpense = async (id: string) => {
    if (!confirm('Deseja excluir esta despesa?')) return
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      toast({ title: 'Despesa excluída' })
      fetchExpenses()
    }
  }

  const projectedFixed = useMemo(
    () =>
      filteredExpenses
        .filter((e) => e.cost_center === 'Fixo' && e.status === 'pending')
        .reduce((a, b) => a + Number(b.amount), 0),
    [filteredExpenses],
  )

  const projectedVariable = useMemo(
    () =>
      filteredExpenses
        .filter((e) => e.cost_center === 'Variável' && e.status === 'pending')
        .reduce((a, b) => a + Number(b.amount), 0),
    [filteredExpenses],
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 rounded-xl dark:bg-red-900/30">
            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Contas a Pagar</h2>
            <p className="text-muted-foreground text-sm">Gerencie despesas fixas e variáveis.</p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nova Despesa
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-subtle border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Pendente (Fixo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{formatBRL(projectedFixed)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Pendente (Variável)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{formatBRL(projectedVariable)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-slate-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Projeção Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatBRL(projectedFixed + projectedVariable)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Vencimento</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Centro de Custo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Nenhuma despesa encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    className={expense.status === 'paid' ? 'opacity-60 bg-muted/30' : ''}
                  >
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        {format(new Date(expense.due_date + 'T00:00:00'), 'dd/MM/yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={expense.cost_center === 'Fixo' ? 'bg-slate-100' : 'bg-amber-50'}
                      >
                        {expense.cost_center}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatBRL(Number(expense.amount))}
                    </TableCell>
                    <TableCell>
                      {expense.status === 'pending' ? (
                        <Badge className="bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20">
                          Pendente
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20">
                          Pago
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        {expense.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsPaid(expense.id)}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Marcar como Pago"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {expense.status === 'paid' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => cancelPayment(expense)}
                            className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                            title="Cancelar Pagamento"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Despesa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                placeholder="Ex: Aluguel, Resina..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Centro de Custo</Label>
                <Select
                  value={formData.cost_center}
                  onValueChange={(v) => setFormData({ ...formData, cost_center: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixo">Despesa Fixa</SelectItem>
                    <SelectItem value="Variável">Despesa Variável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data de Vencimento</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="0,00"
                  className="pl-9"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Despesa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
