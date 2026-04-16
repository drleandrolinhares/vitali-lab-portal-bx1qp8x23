import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { toast } from '@/hooks/use-toast'
import { formatBRL } from '@/lib/financial'
import {
  format,
  parseISO,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, CheckCircle, Trash2, XCircle, Edit2 } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { ExpenseFormModal } from '@/components/ExpenseFormModal'

const getStatusDetails = (item: any) => {
  if (item.status === 'paid')
    return { label: 'Paga', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  const due = parseISO(item.due_date)
  if (isBefore(due, startOfDay(new Date())))
    return { label: 'Vencida', color: 'text-red-600 bg-red-50 border-red-200' }
  return { label: 'A Vencer', color: 'text-blue-600 bg-blue-50 border-blue-200' }
}

export default function AccountsPayable() {
  const { selectedLab } = useAppStore()
  const [expenses, setExpenses] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any | null>(null)
  const [filterStatus, setFilterStatus] = useState({ pending: true, paid: true })
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .is('order_id', null)
      .order('due_date', { ascending: true })
    if (data) setExpenses(data)
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (e.status === 'paid' && !filterStatus.paid) return false
      if (e.status === 'pending' && !filterStatus.pending) return false
      if (selectedLab !== 'Todos' && e.sector !== selectedLab) return false
      if (e.order_id !== null) return false
      const date = parseISO(e.due_date)
      if (dateRange?.from && isBefore(date, startOfDay(dateRange.from))) return false
      if (dateRange?.to && isAfter(date, endOfDay(dateRange.to))) return false
      return true
    })
  }, [expenses, selectedLab, filterStatus, dateRange])

  const totals = useMemo(() => {
    const t = { fixo: 0, variavel: 0, investimento: 0, outros: 0, total: 0 }
    filteredExpenses.forEach((e) => {
      const val = Number(e.amount)
      if (e.classification === 'Custo Fixo') t.fixo += val
      else if (e.classification === 'Custo Variável') t.variavel += val
      else if (e.classification === 'Investimento') t.investimento += val
      else t.outros += val
      t.total += val
    })
    return t
  }, [filteredExpenses])

  const groups = useMemo(() => {
    const g: Record<string, any[]> = {}
    filteredExpenses.forEach((e) => {
      if (!g[e.due_date]) g[e.due_date] = []
      g[e.due_date].push(e)
    })
    return Object.entries(g).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredExpenses])

  const handleSaveModal = async (entries: any[], isEdit?: boolean) => {
    if (isEdit && editingExpense) {
      const updateData = {
        ...entries[0],
        sector: selectedLab === 'Todos' ? 'Soluções Cerâmicas' : selectedLab,
      }
      delete updateData.id
      const { error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', editingExpense.id)
      if (error)
        toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Atualizado com sucesso!' })
        fetchExpenses()
      }
    } else {
      const { error } = await supabase.from('expenses').insert(
        entries.map((e) => ({
          ...e,
          sector: selectedLab === 'Todos' ? 'Soluções Cerâmicas' : selectedLab,
        })),
      )
      if (error)
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Salvo com sucesso!' })
        fetchExpenses()
      }
    }
    setEditingExpense(null)
  }

  const markAsPaid = async (id: string) => {
    await supabase.from('expenses').update({ status: 'paid' }).eq('id', id)
    fetchExpenses()
  }

  const cancelPayment = async (exp: any) => {
    await supabase.from('expenses').update({ status: 'pending' }).eq('id', exp.id)
    fetchExpenses()
  }

  const deleteExpense = async (id: string) => {
    if (!confirm('Excluir esta despesa?')) return
    await supabase.from('expenses').delete().eq('id', id)
    fetchExpenses()
  }

  const handleNewAccount = () => {
    setEditingExpense(null)
    setModalOpen(true)
  }

  const handleEditAccount = (item: any) => {
    setEditingExpense(item)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Contas a Pagar</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie despesas, parcelamentos e contas recorrentes.
          </p>
        </div>
        <Button onClick={handleNewAccount}>
          <Plus className="w-4 h-4 mr-2" /> Nova Conta
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg border">
        <div className="flex items-center gap-4 border-r pr-4">
          <span className="text-sm font-medium text-muted-foreground">Mostrar:</span>
          <div className="flex items-center gap-2">
            <Checkbox
              id="pending"
              checked={filterStatus.pending}
              onCheckedChange={(v) => setFilterStatus((s) => ({ ...s, pending: !!v }))}
            />
            <label htmlFor="pending" className="text-sm cursor-pointer">
              A Pagar
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="paid"
              checked={filterStatus.paid}
              onCheckedChange={(v) => setFilterStatus((s) => ({ ...s, paid: !!v }))}
            />
            <label htmlFor="paid" className="text-sm cursor-pointer">
              Pagas
            </label>
          </div>
        </div>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Custo Fixo', val: totals.fixo },
          { label: 'Custo Variável', val: totals.variavel },
          { label: 'Investimento', val: totals.investimento },
          { label: 'Outros', val: totals.outros },
          { label: 'Valor Total', val: totals.total, primary: true },
        ].map((t) => (
          <Card
            key={t.label}
            className={cn('shadow-none border-0', t.primary ? 'bg-primary/10' : 'bg-muted/20')}
          >
            <CardContent className="p-4 flex flex-col items-center">
              <span
                className={cn(
                  'text-xs font-semibold uppercase',
                  t.primary ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {t.label}
              </span>
              <span
                className={cn('text-xl font-bold', t.primary ? 'text-primary' : 'text-foreground')}
              >
                {formatBRL(t.val)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/10 text-muted-foreground">
          Nenhuma conta encontrada neste período.
        </div>
      ) : (
        <div className="border rounded-lg bg-background shadow-subtle overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b text-sm font-medium text-muted-foreground bg-muted/30">
            <div className="col-span-1"></div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Ações</div>
            <div className="col-span-2">Classificação</div>
            <div className="col-span-2">Categoria DRE</div>
            <div className="col-span-3">Descrição</div>
            <div className="col-span-1 text-right">Valor</div>
          </div>
          <div className="divide-y">
            {groups.map(([dateStr, items]) => (
              <div key={dateStr} className="flex flex-col md:flex-row">
                <div className="w-full md:w-20 md:border-r bg-muted/10 flex md:flex-col items-center justify-center md:justify-start pt-2 md:pt-4 px-2 border-b md:border-b-0 py-2 md:py-0">
                  <span className="text-lg md:text-2xl font-bold">
                    {format(parseISO(dateStr), 'dd')}
                  </span>
                  <span className="text-xs md:text-sm uppercase text-muted-foreground ml-2 md:ml-0">
                    {format(parseISO(dateStr), 'MMM', { locale: ptBR })}
                  </span>
                </div>
                <div className="flex-1 flex flex-col divide-y">
                  {items.map((item) => {
                    const { label, color } = getStatusDetails(item)
                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 md:grid-cols-11 gap-4 px-4 py-3 items-center hover:bg-muted/5 group"
                      >
                        <div className="col-span-1 md:col-span-2 flex items-center">
                          <Badge variant="outline" className={cn('font-semibold border', color)}>
                            <span className="mr-1.5 font-normal">$</span> {label}
                          </Badge>
                          {item.is_recurring && (
                            <Badge variant="secondary" className="ml-2 text-[10px]">
                              Recorrente
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-1 md:col-span-1 flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.status === 'pending' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                              onClick={() => markAsPaid(item.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-500 hover:bg-amber-50"
                              onClick={() => cancelPayment(item)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                            onClick={() => handleEditAccount(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => deleteExpense(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div
                          className="col-span-1 md:col-span-2 text-sm text-muted-foreground truncate"
                          title={item.classification}
                        >
                          {item.classification}
                        </div>
                        <div
                          className="col-span-1 md:col-span-2 text-sm truncate font-medium text-blue-600"
                          title={item.dre_category}
                        >
                          {item.dre_category}
                        </div>
                        <div className="col-span-1 md:col-span-3 text-sm truncate flex flex-col justify-center">
                          <div className="font-medium truncate">
                            {item.description}
                            {item.installment_total > 1 && (
                              <span className="ml-1.5 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {item.installment_current}/{item.installment_total}
                              </span>
                            )}
                          </div>
                          {item.observations && (
                            <div
                              className="text-xs text-muted-foreground truncate mt-0.5"
                              title={item.observations}
                            >
                              {item.observations}
                            </div>
                          )}
                        </div>
                        <div
                          className={cn(
                            'col-span-1 md:col-span-1 text-right font-semibold',
                            label === 'Vencida' ? 'text-red-600' : 'text-foreground',
                          )}
                        >
                          {formatBRL(Number(item.amount))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ExpenseFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveModal}
        expenseToEdit={editingExpense}
      />
    </div>
  )
}
