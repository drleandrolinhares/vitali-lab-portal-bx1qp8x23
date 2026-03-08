import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { format, addMonths, parseISO } from 'date-fns'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entries: any[]) => Promise<void>
}

export function ExpenseFormModal({ open, onOpenChange, onSave }: Props) {
  const [saving, setSaving] = useState(false)
  const [installments, setInstallments] = useState<any[]>([])
  const [formData, setFormData] = useState({
    description: '',
    classification: 'Custo Fixo',
    category: '',
    dre_category: 'Despesa Administrativa',
    purchase_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: '',
    payment_method: 'Boleto',
    amount: '',
    type: 'unica',
    installments_count: 2,
  })

  useEffect(() => {
    if (
      formData.type === 'parcelada' &&
      formData.amount &&
      formData.installments_count &&
      formData.due_date
    ) {
      const total = Number(formData.amount.replace(/[^0-9,-]+/g, '').replace(',', '.'))
      if (!isNaN(total) && total > 0) {
        const perInst = total / formData.installments_count
        setInstallments(
          Array.from({ length: formData.installments_count }).map((_, i) => ({
            id: `temp-${i}`,
            installment_current: i + 1,
            due_date: format(addMonths(parseISO(formData.due_date), i), 'yyyy-MM-dd'),
            amount: perInst.toFixed(2).replace('.', ','),
          })),
        )
      }
    }
  }, [formData.type, formData.amount, formData.installments_count, formData.due_date])

  const handleSave = async () => {
    setSaving(true)
    const baseAmount = Number(formData.amount.replace(/[^0-9,-]+/g, '').replace(',', '.'))
    let entries = []
    const base = {
      description: formData.description,
      classification: formData.classification,
      category: formData.category || 'Geral',
      dre_category: formData.dre_category,
      purchase_date: formData.purchase_date || null,
      payment_method: formData.payment_method,
      cost_center: formData.classification,
      status: 'pending',
    }

    if (formData.type === 'unica') {
      entries.push({
        ...base,
        due_date: formData.due_date,
        amount: baseAmount,
        is_recurring: false,
      })
    } else if (formData.type === 'parcelada') {
      entries = installments.map((i) => ({
        ...base,
        due_date: i.due_date,
        amount: Number(i.amount.replace(/[^0-9,-]+/g, '').replace(',', '.')),
        installment_current: i.installment_current,
        installment_total: formData.installments_count,
      }))
    } else {
      const dMonth = parseInt(formData.due_date.split('-')[2], 10)
      for (let i = 0; i < 12; i++) {
        const d = addMonths(parseISO(formData.due_date), i)
        d.setDate(Math.min(dMonth, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()))
        entries.push({
          ...base,
          due_date: format(d, 'yyyy-MM-dd'),
          amount: baseAmount,
          is_recurring: true,
          recurring_day: dMonth,
        })
      }
    }

    await onSave(entries)
    setSaving(false)
    if (open) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Conta a Pagar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Aluguel, Resina..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo de Conta</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unica">Conta Única</SelectItem>
                <SelectItem value="parcelada">Parcelada</SelectItem>
                <SelectItem value="recorrente">Recorrente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Classificação</Label>
            <Select
              value={formData.classification}
              onValueChange={(v) => setFormData({ ...formData, classification: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Custo Fixo">Custo Fixo</SelectItem>
                <SelectItem value="Custo Variável">Custo Variável</SelectItem>
                <SelectItem value="Investimento">Investimento</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>
              Categoria DRE <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.dre_category}
              onValueChange={(v) => setFormData({ ...formData, dre_category: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Material de Laboratório">
                  Material de Lab. (Custo Variável)
                </SelectItem>
                <SelectItem value="Pessoal">Pessoal / Folha (Despesa Operacional)</SelectItem>
                <SelectItem value="Despesa Administrativa">
                  Despesa Administrativa (Fixo)
                </SelectItem>
                <SelectItem value="Impostos">Impostos</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-1">
              Define a linha correspondente no relatório DRE.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Categoria Interna (Opcional)</Label>
            <Input
              placeholder="Ex: Laboratório Externo, Materiais..."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <Input
              placeholder="Ex: Boleto, PIX..."
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Data da Compra</Label>
            <Input
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{formData.type === 'unica' ? 'Vencimento' : '1º Vencimento'}</Label>
            <Input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{formData.type === 'parcelada' ? 'Valor Total (R$)' : 'Valor (R$)'}</Label>
            <Input
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          {formData.type === 'parcelada' && (
            <div className="space-y-2">
              <Label>Nº de Parcelas</Label>
              <Input
                type="number"
                min="2"
                max="60"
                value={formData.installments_count}
                onChange={(e) =>
                  setFormData({ ...formData, installments_count: parseInt(e.target.value) || 2 })
                }
              />
            </div>
          )}
          {formData.type === 'parcelada' && installments.length > 0 && (
            <div className="col-span-1 md:col-span-2 space-y-3 mt-2 border rounded-md p-4 bg-muted/10">
              <h4 className="font-medium text-sm">Parcelas Geradas</h4>
              {installments.map((inst, idx) => (
                <div key={inst.id} className="grid grid-cols-3 gap-4 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Parcela</Label>
                    <div className="h-9 px-3 border rounded-md bg-background flex items-center text-sm">
                      {inst.installment_current} / {formData.installments_count}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Vencimento</Label>
                    <Input
                      type="date"
                      value={inst.due_date}
                      onChange={(e) => {
                        const n = [...installments]
                        n[idx].due_date = e.target.value
                        setInstallments(n)
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Valor (R$)</Label>
                    <Input
                      value={inst.amount}
                      onChange={(e) => {
                        const n = [...installments]
                        n[idx].amount = e.target.value
                        setInstallments(n)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Despesa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
