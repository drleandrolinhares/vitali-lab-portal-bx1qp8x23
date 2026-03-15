import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import logoUrl from '@/assets/vitalli-02-9f298.png'

export interface InvoicePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dentistName: string
  clinicName: string
  orders: any[]
  totalAmount: number
}

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  dentistName,
  clinicName,
  orders,
  totalAmount,
}: InvoicePreviewDialogProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-100/60 border-none shadow-2xl backdrop-blur-sm">
        <DialogHeader className="sr-only">
          <DialogTitle>Prévia de Faturamento</DialogTitle>
          <DialogDescription>
            Documento de prévia para conferência de faturamento do dentista.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[90vh] w-full">
          <div className="p-6 md:p-12 flex justify-center min-h-full">
            {/* A4 Document Container */}
            <div className="relative w-full max-w-[850px] bg-white shadow-sm border border-slate-200 rounded-sm p-8 md:p-16 overflow-hidden min-h-[800px]">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 select-none">
                <img
                  src={logoUrl}
                  alt="Vitali Lab Watermark"
                  className="w-[80%] max-w-[600px] object-contain grayscale"
                />
              </div>

              <div className="relative z-10 space-y-12">
                {/* Header: Logo and Title */}
                <div className="flex flex-col items-center space-y-8">
                  <img src={logoUrl} alt="Vitali Lab" className="h-16 md:h-24 object-contain" />
                  <div className="text-center space-y-1.5">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                      PRÉVIA DE FATURAMENTO
                    </h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                      Prévia para Conferência
                    </p>
                  </div>
                </div>

                {/* Customer Info Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Cliente
                    </p>
                    <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                      {dentistName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Clínica
                    </p>
                    <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                      {clinicName || 'NÃO INFORMADA'}
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="pt-2">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b-[3px] border-slate-200">
                        <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Data
                        </th>
                        <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Pedido
                        </th>
                        <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Paciente
                        </th>
                        <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Serviço
                        </th>
                        <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order, i) => (
                        <tr
                          key={order.id || i}
                          className="bg-white hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-4 text-slate-600 font-medium whitespace-nowrap pr-4">
                            {order.created_at
                              ? format(new Date(order.created_at), 'dd/MM/yyyy')
                              : '-'}
                          </td>
                          <td className="py-4 text-slate-900 font-bold whitespace-nowrap pr-4">
                            {order.friendly_id || order.id?.substring(0, 8) || '-'}
                          </td>
                          <td className="py-4 text-slate-700 uppercase pr-4 font-medium">
                            {order.patient_name || order.patientName || '-'}
                          </td>
                          <td className="py-4 text-slate-700 uppercase pr-4">
                            {order.work_type || order.workType || order.service || '-'}
                          </td>
                          <td className="py-4 text-slate-900 font-bold text-right whitespace-nowrap">
                            {formatCurrency(
                              order.base_price ?? order.basePrice ?? order.price ?? 0,
                            )}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                            Nenhum pedido encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer / Total */}
                <div className="pt-6 border-t-[4px] border-slate-900 flex flex-col items-end space-y-2 mt-8">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    Total a Faturar
                  </p>
                  <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
