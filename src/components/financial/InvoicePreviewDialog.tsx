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

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  dentistName,
  clinicName,
  orders,
  totalAmount,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dentistName: string
  clinicName: string
  orders: any[]
  totalAmount: number
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Prévia da Fatura</DialogTitle>
        </DialogHeader>
        <div className="p-6 overflow-auto flex-1">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-800">{dentistName}</h3>
            {clinicName && <p className="text-muted-foreground">{clinicName}</p>}
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium text-xs font-mono">
                      {o.friendlyId || o.id?.substring(0, 8)}
                    </TableCell>
                    <TableCell>{o.patientName}</TableCell>
                    <TableCell>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(o.basePrice || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 flex justify-end">
            <div className="text-right bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[250px]">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                Total da Fatura
              </p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
            </div>
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
