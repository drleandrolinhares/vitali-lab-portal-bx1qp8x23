import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
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
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { addMonths, format, parseISO } from 'date-fns'
import { useAppStore } from '@/stores/main'

export function ManualEntryForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void
  onCancel: () => void
}) {
  const [dentists, setDentists] = useState<any[]>([])
  const [selectedDentist, setSelectedDentist] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { selectedLab } = useAppStore()

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name')
      .in('role', ['dentist', 'laboratory'])
      .order('name')
      .then(({ data }) => {
        if (data) setDentists(data)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDentist || !totalAmount || !startDate) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const total = parseFloat(totalAmount.replace(',', '.'))
      if (isNaN(total) || total <= 0) {
        throw new Error('Valor inválido')
      }

      const numInstallments = 8
      const installmentValue = total / numInstallments
      const start = parseISO(startDate)

      const inserts = []
      const activeLab =
        selectedLab && selectedLab !== 'TODOS' && selectedLab !== 'Todos'
          ? selectedLab
          : 'SOLUÇÕES CERÂMICAS'

      for (let i = 1; i <= numInstallments; i++) {
        const dueDate = addMonths(start, i - 1)
        const monthYear = format(dueDate, 'MM/yyyy')
        inserts.push({
          dentist_id: selectedDentist,
          total_amount: total,
          installment_value: installmentValue,
          total_installments: numInstallments,
          remaining_installments: numInstallments - i + 1,
          status: 'active',
          due_date: format(dueDate, 'yyyy-MM-dd'),
          installment_number: i,
          note: `Parcela ${i}/${numInstallments} ref. ${monthYear}`,
          sector: activeLab,
        })
      }

      const { error } = await supabase.from('billing_installments').insert(inserts as any)
      if (error) throw error

      toast({ title: 'Lançamento avulso criado com sucesso' })
      onSuccess()
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Erro ao criar lançamento',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Dentista / Cliente</Label>
        <Select value={selectedDentist} onValueChange={setSelectedDentist}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o cliente" />
          </SelectTrigger>
          <SelectContent>
            {dentists.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Valor Total (R$)</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="Ex: 5000.00"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          O valor será dividido automaticamente em 8 parcelas.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Data do Primeiro Vencimento</Label>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Gerar Parcelas
        </Button>
      </div>
    </form>
  )
}
