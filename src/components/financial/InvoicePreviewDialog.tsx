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
import logoUrl from '@/assets/vitalli-02-9f298.png'
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
  const labSite = appSettings['lab_website'] || ''
  const labInstagram = appSettings['lab_instagram'] || ''
  const labPix = appSettings['lab_pix_key'] || ''

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const handlePrint = () => {
    const absoluteLogoUrl = new URL(logoUrl, window.location.origin).href
    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('Por favor, permita popups no seu navegador para visualizar a impressão.')
      return
    }

    const orderRows = orders
      .map(
        (order) => `
      <tr>
        <td>${order.created_at || order.createdAt ? format(new Date(order.created_at || order.createdAt), 'dd/MM/yyyy') : '-'}</td>
        <td><b>${order.friendly_id || order.friendlyId || order.id?.substring(0, 8) || '-'}</b></td>
        <td>${order.patient_name || order.patientName || '-'}</td>
        <td>${order.work_type || order.workType || order.service || '-'}</td>
        <td class="right"><b>${formatCurrency(
          order.base_price ?? order.basePrice ?? order.price ?? 0,
        )}</b></td>
      </tr>
    `,
      )
      .join('')

    const footerHtml = `
      <div class="footer">
        ${
          labRazao || labCnpj
            ? `<div><strong>${labRazao}</strong>${labRazao && labCnpj ? ' | ' : ''}${labCnpj ? `CNPJ: ${labCnpj}` : ''}</div>`
            : ''
        }
        ${labEndereco ? `<div>${labEndereco}</div>` : ''}
        ${
          labTelefone || labSite || labInstagram
            ? `<div>
            ${labTelefone}${labTelefone && (labSite || labInstagram) ? ' | ' : ''}
            ${labSite}${labSite && labInstagram ? ' | ' : ''}
            ${labInstagram}
          </div>`
            : ''
        }
        ${labPix ? `<div class="pix">CHAVE PIX: ${labPix}</div>` : ''}
      </div>
    `

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prévia de Faturamento - ${dentistName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
            @page { margin: 0; }
            body { font-family: 'Inter', sans-serif; padding: 2cm 40px 40px; color: #0f172a; margin: 0; background: #fff; box-sizing: border-box; }
            .container { max-width: 800px; margin: 0 auto; position: relative; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.03; z-index: -1; width: 80%; max-width: 600px; filter: grayscale(100%); pointer-events: none; }
            .header { text-align: center; margin-bottom: 32px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .logo { width: 80%; height: auto; max-width: none; object-fit: contain; margin-bottom: 1cm; }
            .title { font-size: 26px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: -0.02em; text-transform: uppercase; }
            .subtitle { font-size: 14px; font-weight: 700; color: #64748b; letter-spacing: 0.15em; text-transform: uppercase; }
            .info-box { display: flex; gap: 40px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; margin-bottom: 40px; }
            .info-item { flex: 1; }
            .info-item label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px; }
            .info-item span { font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 13px; }
            th { text-align: left; padding-bottom: 16px; border-bottom: 3px solid #e2e8f0; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px; }
            th.right, td.right { text-align: right; }
            td { padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-weight: 500; text-transform: uppercase; }
            .total-box { border-top: 4px solid #0f172a; padding-top: 24px; text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
            .total-label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
            .total-value { font-size: 42px; font-weight: 900; letter-spacing: -0.05em; }
            .footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6; }
            .footer div { margin-bottom: 4px; }
            .footer .pix { margin-top: 12px; font-size: 13px; font-weight: 900; color: #0f172a; text-transform: uppercase; background: #f1f5f9; display: inline-block; padding: 10px 20px; border-radius: 8px; letter-spacing: 0.05em; border: 1px solid #e2e8f0; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${absoluteLogoUrl}" class="watermark" />
            <div class="header">
              <img src="${absoluteLogoUrl}" class="logo" />
              <h1 class="title">RECIBO DE PRESTAÇÃO DE SERVIÇOS</h1>
              <div class="subtitle">Prévia para Conferência</div>
            </div>
            <div class="info-box">
              <div class="info-item">
                <label>Cliente</label>
                <span>${dentistName}</span>
              </div>
              <div class="info-item">
                <label>Clínica</label>
                <span>${clinicName || 'NÃO INFORMADA'}</span>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Pedido</th>
                  <th>Paciente</th>
                  <th>Serviço</th>
                  <th class="right">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${orderRows || `<tr><td colspan="5" style="text-align:center; padding: 40px 0; color: #64748b;">Nenhum pedido selecionado.</td></tr>`}
              </tbody>
            </table>
            <div class="total-box">
              <div class="total-label">Total Selecionado</div>
              <div class="total-value">${formatCurrency(totalAmount)}</div>
            </div>
            ${footerHtml}
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-100/60 border-none shadow-2xl backdrop-blur-sm">
        <DialogHeader className="sr-only">
          <DialogTitle>Prévia de Faturamento</DialogTitle>
          <DialogDescription>
            Documento de prévia para conferência de faturamento do dentista.
          </DialogDescription>
        </DialogHeader>

        <div className="absolute top-4 right-14 z-50">
          <Button onClick={handlePrint} className="gap-2 shadow-md">
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </Button>
        </div>

        <ScrollArea className="max-h-[90vh] w-full">
          <div className="p-6 md:py-8 md:px-12 flex justify-center min-h-full">
            <div className="relative w-full max-w-[850px] bg-white shadow-sm border border-slate-200 rounded-sm px-8 md:px-16 pb-6 md:pb-10 pt-[2cm] overflow-hidden min-h-[800px] flex flex-col">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 select-none">
                <img
                  src={logoUrl}
                  alt="Vitali Lab Watermark"
                  className="w-[80%] max-w-[600px] object-contain grayscale"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex flex-col items-center border-b-2 border-slate-100 pb-6">
                  <img
                    src={logoUrl}
                    alt="Vitali Lab"
                    className="w-[80%] h-auto max-w-none object-contain mb-[1cm]"
                  />
                  <div className="text-center space-y-1.5">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">
                      RECIBO DE PRESTAÇÃO DE SERVIÇOS
                    </h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                      Prévia para Conferência
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                  <div className="p-6 md:p-8 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Cliente
                    </p>
                    <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                      {dentistName}
                    </p>
                  </div>
                  <div className="p-6 md:p-8 rounded-xl border border-slate-200 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Clínica
                    </p>
                    <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                      {clinicName || 'NÃO INFORMADA'}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
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
                            {order.created_at || order.createdAt
                              ? format(new Date(order.created_at || order.createdAt), 'dd/MM/yyyy')
                              : '-'}
                          </td>
                          <td className="py-4 text-slate-900 font-bold whitespace-nowrap pr-4">
                            {order.friendly_id ||
                              order.friendlyId ||
                              order.id?.substring(0, 8) ||
                              '-'}
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
                            Nenhum pedido selecionado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="pt-6 border-t-[4px] border-slate-900 flex flex-col items-end space-y-2 mt-8">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    Total Selecionado
                  </p>
                  <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>

                {/* Footer Section */}
                <div className="mt-16 pt-6 border-t border-slate-200 text-center text-[11px] text-slate-500 space-y-1.5 leading-relaxed">
                  {(labRazao || labCnpj) && (
                    <p>
                      <strong className="text-slate-700">{labRazao}</strong>
                      {labRazao && labCnpj && ' | '}
                      {labCnpj && `CNPJ: ${labCnpj}`}
                    </p>
                  )}
                  {labEndereco && <p>{labEndereco}</p>}
                  {(labTelefone || labSite || labInstagram) && (
                    <p>
                      {labTelefone}
                      {labTelefone && (labSite || labInstagram) && ' | '}
                      {labSite}
                      {labSite && labInstagram && ' | '}
                      {labInstagram}
                    </p>
                  )}
                  {labPix && (
                    <div className="mt-4 inline-block bg-slate-50 border border-slate-200 py-2.5 px-5 rounded-lg shadow-sm">
                      <p className="text-slate-900 font-black text-[13px] tracking-wide uppercase">
                        CHAVE PIX: {labPix}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
