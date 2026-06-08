import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface InvoicePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dentistName: string
  clinicName?: string
  orders: any[]
  totalAmount: number
  settlementId?: string
  date?: string
}

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  dentistName,
  clinicName,
  orders,
  totalAmount,
  settlementId,
  date,
}: InvoicePreviewDialogProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden print:max-w-none print:h-auto print:border-none print:shadow-none print:p-4 print:overflow-visible">
        <DialogHeader className="px-6 py-4 border-b print:hidden">
          <DialogTitle className="flex justify-between items-center">
            <span>Prévia da Fatura</span>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible bg-white print:bg-transparent">
          <div className="space-y-8 max-w-3xl mx-auto print:max-w-none print:mx-0">
            {/* Cabecalho da Fatura */}
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  FATURA DE SERVIÇOS
                </h2>
                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-700">Dentista:</span> {dentistName}
                  </p>
                  {clinicName && (
                    <p>
                      <span className="font-semibold text-slate-700">Clínica:</span> {clinicName}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right text-sm text-slate-600 space-y-1">
                {settlementId && (
                  <p>
                    <span className="font-semibold text-slate-700">Fatura Nº:</span>{' '}
                    {settlementId.substring(0, 8).toUpperCase()}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-slate-700">Data Emissão:</span>{' '}
                  {date
                    ? new Date(date).toLocaleDateString('pt-BR')
                    : new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Lista de Pedidos */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Trabalhos Concluídos</h3>
              <div className="border rounded-md print:border-none print:p-0">
                <Table>
                  <TableHeader className="bg-slate-50 print:bg-transparent">
                    <TableRow>
                      <TableHead className="text-slate-700 font-bold">Pedido</TableHead>
                      <TableHead className="text-slate-700 font-bold">Paciente</TableHead>
                      <TableHead className="text-slate-700 font-bold">Trabalho</TableHead>
                      <TableHead className="text-slate-700 font-bold text-center">
                        Data de Conclusão
                      </TableHead>
                      <TableHead className="text-slate-700 font-bold text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o, idx) => (
                      <TableRow key={o.id || idx} className="print:border-b print:border-slate-200">
                        <TableCell className="font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span>{o.friendlyId || o.id?.substring(0, 8)}</span>
                            {o.isRepetition && (
                              <Badge
                                variant="destructive"
                                className="text-[10px] uppercase px-1.5 py-0 h-4 print:border print:border-red-500 print:text-red-600 print:bg-transparent"
                              >
                                Repetição
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{o.patientName || '-'}</TableCell>
                        <TableCell>{o.workType || '-'}</TableCell>
                        <TableCell className="text-center">
                          {o.completedAt
                            ? new Date(o.completedAt).toLocaleDateString('pt-BR')
                            : o.createdAt
                              ? new Date(o.createdAt).toLocaleDateString('pt-BR')
                              : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(o.clearedAmount ?? o.basePrice ?? 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum pedido atrelado a esta fatura.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end pt-4 border-t print:border-slate-300">
              <div className="bg-slate-50 p-4 rounded-lg print:bg-transparent print:p-0 min-w-[250px]">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                    Total Geral
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Assinatura / Termos (opcional) */}
            <div className="mt-16 pt-8 border-t border-dashed text-center text-sm text-slate-500 print:block hidden">
              <p>Obrigado pela preferência e parceria.</p>
              <p className="mt-1 font-medium">Laboratório Vitali Lab</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
