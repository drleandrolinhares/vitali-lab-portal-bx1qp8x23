import { useState } from 'react'
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
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { formatBRL } from '@/lib/financial'

export function CreateInstallmentDialog({ open, onOpenChange, dentistData, onSuccess }: any) {
  const [installments, setInstallments] = useState(2)
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    setSaving(true)
    try {
      const totalAmount = dentistData.ordersTotal
      const installmentValue = totalAmount / installments

      const { error } = await supabase.from('billing_installments').insert({
        dentist_id: dentistData.id,
        total_amount: totalAmount,
        installment_value: installmentValue,
        total_installments: installments,
        remaining_installments: installments,
        status: 'active',
      })
      if (error) throw error

      if (dentistData.outstandingOrders.length > 0) {
        const updates = dentistData.outstandingOrders.map((o: any) =>
          supabase.from('orders').update({ cleared_balance: o.completedCost }).eq('id', o.id),
        )
        await Promise.all(updates)
      }

      toast({ title: 'Parcelamento criado com sucesso!' })
      onSuccess()
    } catch (e: any) {
      toast({ title: 'Erro ao parcelar', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Parcelar Fatura do Mês</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Você está parcelando o valor total de trabalhos deste mês. O saldo dos pedidos será
            marcado como liquidado e substituído pelas parcelas do plano.
          </p>
          <div className="p-3 bg-muted rounded-md flex justify-between items-center border border-border">
            <span className="font-semibold">Valor a Parcelar:</span>
            <span className="font-bold text-lg text-primary">
              {formatBRL(dentistData.ordersTotal)}
            </span>
          </div>
          <div className="space-y-2">
            <Label>Número de Parcelas</Label>
            <Input
              type="number"
              min="2"
              max="24"
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
            />
          </div>
          <p className="text-sm">
            Valor de cada parcela:{' '}
            <strong className="text-emerald-600">
              {formatBRL(dentistData.ordersTotal / installments)}
            </strong>
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={saving || installments < 2}>
            {saving ? 'Processando...' : 'Confirmar Parcelamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
