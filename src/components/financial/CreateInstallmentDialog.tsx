import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function CreateInstallmentDialog({
  open,
  onOpenChange,
  dentistId,
  orders,
  totalAmount,
  onSuccess,
}: any) {
  const [loading, setLoading] = useState(false)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const handleCreate = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'billed' })
        .in(
          'id',
          orders.map((o: any) => o.id),
        )

      if (error) throw error

      toast.success('Faturamento gerado com sucesso!')
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao gerar faturamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Confirmar Faturamento</DialogTitle>
          <DialogDescription>
            Você está prestes a faturar {orders.length} pedidos. Esta ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 flex justify-between items-center shadow-inner">
            <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Valor Total
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={loading} className="gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirmar Faturamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
