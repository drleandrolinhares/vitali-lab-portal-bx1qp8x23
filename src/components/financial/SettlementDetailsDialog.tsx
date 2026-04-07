import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function SettlementDetailsDialog({
  open,
  onOpenChange,
  settlement,
  dentist,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  settlement: any
  dentist: any
}) {
  if (!settlement) return null

  const orders = Array.isArray(settlement.orders_snapshot) ? settlement.orders_snapshot : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Detalhes da Fatura #{settlement.id.substring(0, 8)}</DialogTitle>
        </DialogHeader>
        <div className="p-6 overflow-auto flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                {dentist?.name || 'Desconhecido'}
              </h3>
              {dentist?.clinic && <p className="text-muted-foreground">{dentist.clinic}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Status</p>
              <p
                className={`font-bold uppercase text-sm ${settlement.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}
              >
                {settlement.status === 'paid' ? 'Recebido' : 'Aguardando Pagamento'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Data Fechamento
              </p>
              <p className="font-medium text-slate-800">
                {new Date(settlement.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Data Pagamento
              </p>
              <p className="font-medium text-slate-800">
                {settlement.paid_at
                  ? new Date(settlement.paid_at).toLocaleDateString('pt-BR')
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Total de Pedidos
              </p>
              <p className="font-medium text-slate-800">{orders.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Valor Total
              </p>
              <p className="font-bold text-primary text-lg leading-none">
                {formatCurrency(settlement.amount)}
              </p>
            </div>
          </div>

          <h4 className="font-bold text-slate-700 mb-3">Pedidos Inclusos</h4>
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Trabalho</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o: any) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium text-xs font-mono">
                      {o.friendlyId || o.id?.substring(0, 8)}
                    </TableCell>
                    <TableCell>{o.patientName}</TableCell>
                    <TableCell>{o.workType || '-'}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(o.clearedAmount || 0)}
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum pedido atrelado a esta fatura.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
