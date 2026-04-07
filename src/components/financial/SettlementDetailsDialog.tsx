import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, DollarSign, CreditCard, Building2, User } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'

interface SettlementDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settlement: any
  dentist: any
}

export function SettlementDetailsDialog({
  open,
  onOpenChange,
  settlement,
  dentist,
}: SettlementDetailsDialogProps) {
  if (!settlement) return null

  const isPaid = settlement.status === 'paid'
  const orders = Array.isArray(settlement.orders_snapshot) ? settlement.orders_snapshot : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50">
        <DialogHeader className="px-6 py-4 border-b bg-white shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="w-5 h-5 text-primary" />
              Detalhes da Fatura
              <span className="text-muted-foreground font-mono text-sm ml-2">
                #{settlement.id.substring(0, 8)}
              </span>
            </DialogTitle>
            <Badge
              variant={isPaid ? 'default' : 'secondary'}
              className={cn(
                'uppercase tracking-wider font-bold w-fit',
                isPaid
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-100',
              )}
            >
              {isPaid ? 'Recebido' : 'Aguardando Pagamento'}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <User className="w-4 h-4 text-primary" />
                    Dados do Cliente
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">
                        Dentista
                      </p>
                      <p className="font-medium text-slate-900">
                        {dentist?.name || 'Não informado'}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">
                        Clínica
                      </p>
                      <p className="font-medium text-slate-900 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        {dentist?.clinic || 'Não informada'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Dados de Pagamento
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">
                        Data Fechamento
                      </p>
                      <p className="font-medium text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        {format(new Date(settlement.created_at), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">
                        Valor Total
                      </p>
                      <p className="font-bold text-slate-900 flex items-center gap-1 text-base">
                        <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                        {formatCurrency(settlement.amount)}
                      </p>
                    </div>
                    {isPaid && settlement.paid_at && (
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">
                          Data Recebimento
                        </p>
                        <p className="font-medium text-emerald-700 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                          {format(new Date(settlement.paid_at), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    )}
                    {settlement.payment_method && (
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">
                          Método
                        </p>
                        <p className="font-medium text-slate-900 capitalize">
                          {settlement.payment_method}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b bg-slate-50/50 shrink-0">
                <h3 className="font-semibold text-slate-700">
                  Trabalhos Faturados ({orders.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold whitespace-nowrap">Pedido</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">Data</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">Paciente</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">Serviço</TableHead>
                      <TableHead className="text-right font-semibold whitespace-nowrap">
                        Valor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any, idx: number) => (
                      <TableRow key={order.id || idx}>
                        <TableCell className="font-medium text-slate-700 whitespace-nowrap">
                          {order.friendlyId || order.friendly_id || order.id?.substring(0, 8)}
                        </TableCell>
                        <TableCell className="text-slate-600 whitespace-nowrap">
                          {order.createdAt || order.created_at
                            ? format(new Date(order.createdAt || order.created_at), 'dd/MM/yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell className="uppercase text-slate-700">
                          {order.patientName || order.patient_name || '-'}
                        </TableCell>
                        <TableCell
                          className="uppercase text-slate-700 text-xs max-w-[200px] truncate"
                          title={order.workType || order.work_type || order.service || ''}
                        >
                          {order.workType || order.work_type || order.service || '-'}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 whitespace-nowrap">
                          {formatCurrency(
                            order.clearedAmount ??
                              order.basePrice ??
                              order.base_price ??
                              order.price ??
                              0,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum pedido detalhado neste fechamento.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="px-4 py-4 border-t bg-slate-50 flex justify-end items-center gap-4 shrink-0">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  Total da Fatura
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {formatCurrency(settlement.amount)}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
