import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Printer } from 'lucide-react'
import { useAppStore } from '@/stores/main'

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
  const { appSettings } = useAppStore()

  const labRazao = appSettings['lab_razao_social'] || ''
  const labCnpj = appSettings['lab_cnpj'] || ''
  const labEndereco = appSettings['lab_address'] || ''
  const labTelefone = appSettings['lab_phone'] || ''
  const labEmail = appSettings['lab_email'] || ''
  const labSite = appSettings['lab_website'] || ''
  const labInstagram = appSettings['lab_instagram'] || ''
  const labPix = appSettings['lab_pix_key'] || ''

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const handlePrint = () => {
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const reactCompanyInfo = [labRazao ? `${labRazao}` : '', labCnpj ? `CNPJ: ${labCnpj}` : '']
    .filter(Boolean)
    .join(' | ')

  const reactContacts = [labTelefone, labEmail, labSite, labInstagram].filter(Boolean).join(' | ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-100/60 border-none shadow-2xl backdrop-blur-sm print:bg-white print:shadow-none print:border-none print:backdrop-blur-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Prévia de Faturamento</DialogTitle>
          <DialogDescription>
            Documento de prévia para conferência de faturamento do dentista.
          </DialogDescription>
        </DialogHeader>

        <div className="absolute top-4 right-14 z-50 print:hidden">
          <Button onClick={handlePrint} className="gap-2 shadow-md">
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </Button>
        </div>

        <ScrollArea className="max-h-[90vh] w-full print:max-h-none print:overflow-visible">
          <div className="p-6 md:py-8 md:px-12 flex justify-center min-h-full print:p-0 print:block">
            <div className="relative w-full max-w-[800px] bg-white print:shadow-none print:border-none shadow-sm border border-slate-200 px-8 md:px-12 pb-12 pt-[2cm] print:pt-[2cm] print:px-[2cm] print:pb-[2cm] flex flex-col font-sans text-slate-900 mx-auto">
              {/* Header Blank Space */}
              <div
                className="w-full h-[80px] bg-transparent mb-[1cm] print:mb-[1cm]"
                aria-hidden="true"
              ></div>

              {/* Title */}
              <div className="text-center mb-12 print:mb-12">
                <h1 className="text-lg font-bold tracking-[0.1em] uppercase text-slate-900 m-0 print:text-black print:text-lg">
                  RECIBO DE PRESTAÇÃO DE SERVIÇOS
                </h1>
              </div>

              {/* Info Blocks - Horizontal */}
              <div className="flex flex-row justify-between mb-8 print:mb-8 border-b border-slate-200 print:border-slate-800 pb-6 print:pb-6 gap-8">
                <div className="flex flex-col text-left flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-slate-600 mb-1.5">
                    Cliente
                  </span>
                  <span className="text-base font-bold text-slate-900 uppercase print:text-black">
                    {dentistName}
                  </span>
                </div>
                <div className="flex flex-col text-right flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-slate-600 mb-1.5">
                    Clínica
                  </span>
                  <span className="text-base font-bold text-slate-900 uppercase print:text-black">
                    {clinicName || 'NÃO INFORMADA'}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 relative">
                <table className="w-full text-[13px] text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 print:border-black">
                      <th className="py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px]">
                        Data
                      </th>
                      <th className="py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px]">
                        Pedido
                      </th>
                      <th className="py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px]">
                        Paciente
                      </th>
                      <th className="py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px]">
                        Serviço
                      </th>
                      <th className="py-3 px-2 font-bold text-slate-900 uppercase tracking-widest print:text-black text-[11px] text-right">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-slate-100 print:divide-slate-300">
                    {orders.map((order, i) => (
                      <tr
                        key={order.id || i}
                        className="hover:bg-slate-50/50 transition-colors border-b border-dashed border-slate-200 print:border-slate-300 print:border-dashed"
                      >
                        <td className="py-4 px-2 whitespace-nowrap text-slate-700 print:text-black font-medium">
                          {order.created_at || order.createdAt
                            ? format(new Date(order.created_at || order.createdAt), 'dd/MM/yyyy')
                            : '-'}
                        </td>
                        <td className="py-4 px-2 whitespace-nowrap text-slate-700 print:text-black font-medium">
                          {order.friendly_id ||
                            order.friendlyId ||
                            order.id?.substring(0, 8) ||
                            '-'}
                        </td>
                        <td className="py-4 px-2 uppercase text-slate-700 print:text-black font-medium">
                          {order.patient_name || order.patientName || '-'}
                        </td>
                        <td className="py-4 px-2 uppercase text-slate-700 print:text-black font-medium">
                          {order.work_type || order.workType || order.service || '-'}
                        </td>
                        <td className="py-4 px-2 text-right whitespace-nowrap text-slate-900 font-bold print:text-black">
                          {formatCurrency(order.base_price ?? order.basePrice ?? order.price ?? 0)}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-slate-500 print:text-black"
                        >
                          Nenhum pedido selecionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex flex-col items-end pt-6 mt-6 space-y-1 border-t border-slate-200 print:border-slate-300">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest print:text-slate-600">
                  Total Selecionado
                </p>
                <p className="text-2xl font-bold text-slate-900 print:text-black">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-20 pt-8 border-t border-slate-200 print:border-slate-300 text-center text-xs text-slate-600 print:text-black space-y-1.5 leading-relaxed flex flex-col items-center">
                {reactCompanyInfo && (
                  <p className="font-bold text-slate-900 print:text-black text-sm">
                    {reactCompanyInfo}
                  </p>
                )}
                {labEndereco && <p className="font-medium text-[13px]">{labEndereco}</p>}
                {reactContacts && <p className="mt-1 font-medium text-[13px]">{reactContacts}</p>}

                {labPix && (
                  <div className="mt-8 border border-slate-300 print:border-slate-500 bg-slate-50/50 print:bg-transparent py-4 px-8 inline-flex flex-col items-center rounded-sm">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-slate-600 mb-1.5">
                      Pagamento via PIX
                    </p>
                    <p className="text-slate-900 font-extrabold text-base tracking-widest uppercase print:text-black">
                      CHAVE: {labPix}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
