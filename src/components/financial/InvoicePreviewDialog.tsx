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
import logoUrl from '@/assets/vitalli-03-4bb8e.png'
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
        <td class="print-td">${order.created_at || order.createdAt ? format(new Date(order.created_at || order.createdAt), 'dd/MM/yyyy') : '-'}</td>
        <td class="print-td">${order.friendly_id || order.friendlyId || order.id?.substring(0, 8) || '-'}</td>
        <td class="print-td">${order.patient_name || order.patientName || '-'}</td>
        <td class="print-td">${order.work_type || order.workType || order.service || '-'}</td>
        <td class="print-td right">${formatCurrency(
          order.base_price ?? order.basePrice ?? order.price ?? 0,
        )}</td>
      </tr>
    `,
      )
      .join('')

    const printCompanyInfo = [
      labRazao ? `<strong>${labRazao}</strong>` : '',
      labCnpj ? `CNPJ: ${labCnpj}` : '',
    ]
      .filter(Boolean)
      .join(' | ')

    const printContacts = [labTelefone, labEmail, labSite, labInstagram].filter(Boolean).join(' | ')

    const footerHtml = `
      <div class="footer">
        ${printCompanyInfo ? `<div>${printCompanyInfo}</div>` : ''}
        ${labEndereco ? `<div>${labEndereco}</div>` : ''}
        ${printContacts ? `<div>${printContacts}</div>` : ''}
        ${labPix ? `<div class="pix">CHAVE PIX: ${labPix}</div>` : ''}
      </div>
    `

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prévia de Faturamento - ${dentistName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            @page { margin: 0; }
            .print-body { font-family: 'Inter', sans-serif; padding: 0; color: #0f172a; margin: 0; background: #fff; box-sizing: border-box; }
            .container { max-width: 800px; margin: 0 auto; position: relative; padding: 0 40px 40px; }
            .header-wrapper { padding-top: 2cm; text-align: center; }
            .logo { width: 80%; height: auto; max-width: 320px; object-fit: contain; margin-bottom: 1cm; }
            .title { font-size: 22px; font-weight: 500; margin: 0 0 8px 0; letter-spacing: 0.02em; text-transform: uppercase; color: #0f172a; }
            .subtitle { font-size: 13px; font-weight: 500; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; }
            .separator { height: 1px; background-color: #e2e8f0; margin: 32px 0; width: 100%; }

            .info-card { display: flex; gap: 40px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px 32px; margin-bottom: 40px; }
            .info-col { flex: 1; }
            .info-label { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; display: block; }
            .info-val { font-size: 16px; font-weight: 500; text-transform: uppercase; color: #0f172a; }

            .table-container { position: relative; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.03; z-index: -1; width: 60%; max-width: 500px; filter: grayscale(100%); pointer-events: none; }
            .print-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 13px; }
            .print-th { text-align: left; padding: 16px 8px; border-bottom: 1px solid #e2e8f0; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; font-size: 10px; }
            .print-th.right { text-align: right; }
            .print-td { padding: 16px 8px; border-bottom: 1px dashed #f1f5f9; font-weight: 400; text-transform: uppercase; color: #1e293b; }
            .print-td.right { text-align: right; }
            
            .total-box { border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-top: 24px; }
            .total-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
            .total-value { font-size: 24px; font-weight: 600; color: #0f172a; }
            
            .footer { margin-top: 60px; padding-top: 32px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6; }
            .footer div { margin-bottom: 6px; }
            .footer .pix { margin-top: 16px; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; background: #f8fafc; display: inline-block; padding: 12px 24px; border-radius: 8px; letter-spacing: 0.05em; border: 2px solid #e2e8f0; }
            @media print {
              .print-body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="print-body">
          <div class="container">
            <div class="header-wrapper">
              <img src="${absoluteLogoUrl}" class="logo" />
              <h1 class="title">RECIBO DE PRESTAÇÃO DE SERVIÇOS</h1>
              <div class="subtitle">Prévia para Conferência</div>
            </div>
            
            <div class="separator"></div>

            <div class="info-card">
              <div class="info-col">
                <span class="info-label">Cliente</span>
                <span class="info-val">${dentistName}</span>
              </div>
              <div class="info-col">
                <span class="info-label">Clínica</span>
                <span class="info-val">${clinicName || 'NÃO INFORMADA'}</span>
              </div>
            </div>

            <div class="table-container">
              <img src="${absoluteLogoUrl}" class="watermark" />
              <table class="print-table">
                <thead>
                  <tr>
                    <th class="print-th">Data</th>
                    <th class="print-th">Pedido</th>
                    <th class="print-th">Paciente</th>
                    <th class="print-th">Serviço</th>
                    <th class="print-th right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderRows || `<tr><td class="print-td" colspan="5" style="text-align:center; padding: 40px 0; color: #64748b;">Nenhum pedido selecionado.</td></tr>`}
                </tbody>
              </table>
            </div>
            
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

  const reactCompanyInfo = [
    labRazao ? `<strong class="text-slate-700">${labRazao}</strong>` : '',
    labCnpj ? `CNPJ: ${labCnpj}` : '',
  ]
    .filter(Boolean)
    .join(' | ')

  const reactContacts = [labTelefone, labEmail, labSite, labInstagram].filter(Boolean).join(' | ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-100/60 border-none shadow-2xl backdrop-blur-sm">
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
            <div className="relative w-full max-w-[800px] bg-white shadow-sm border border-slate-200 px-8 md:px-12 pb-12 pt-[2cm] flex flex-col font-sans text-slate-900">
              <div className="text-center">
                <img
                  src={logoUrl}
                  alt="Vitali Lab"
                  className="w-[80%] max-w-[320px] h-auto object-contain mx-auto mb-[1cm]"
                />
                <h1 className="text-[22px] font-medium tracking-[0.02em] uppercase text-slate-900 mb-2">
                  RECIBO DE PRESTAÇÃO DE SERVIÇOS
                </h1>
                <p className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.1em]">
                  Prévia para Conferência
                </p>
              </div>

              <div className="h-px bg-slate-200 w-full my-8"></div>

              <div className="border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row gap-8 mb-10">
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                    Cliente
                  </p>
                  <p className="text-base font-medium text-slate-900 uppercase">{dentistName}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                    Clínica
                  </p>
                  <p className="text-base font-medium text-slate-900 uppercase">
                    {clinicName || 'NÃO INFORMADA'}
                  </p>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 select-none">
                  <img
                    src={logoUrl}
                    alt="Vitali Lab Watermark"
                    className="w-[60%] max-w-[500px] object-contain grayscale"
                  />
                </div>

                <table className="w-full text-[13px] text-left border-collapse relative z-10">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-4 px-2 font-semibold text-slate-500 uppercase tracking-widest text-[10px]">
                        Data
                      </th>
                      <th className="py-4 px-2 font-semibold text-slate-500 uppercase tracking-widest text-[10px]">
                        Pedido
                      </th>
                      <th className="py-4 px-2 font-semibold text-slate-500 uppercase tracking-widest text-[10px]">
                        Paciente
                      </th>
                      <th className="py-4 px-2 font-semibold text-slate-500 uppercase tracking-widest text-[10px]">
                        Serviço
                      </th>
                      <th className="py-4 px-2 font-semibold text-slate-500 uppercase tracking-widest text-[10px] text-right">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-slate-100">
                    {orders.map((order, i) => (
                      <tr
                        key={order.id || i}
                        className="hover:bg-slate-50/50 transition-colors border-b border-dashed border-slate-100"
                      >
                        <td className="py-4 px-2 whitespace-nowrap">
                          {order.created_at || order.createdAt
                            ? format(new Date(order.created_at || order.createdAt), 'dd/MM/yyyy')
                            : '-'}
                        </td>
                        <td className="py-4 px-2 whitespace-nowrap">
                          {order.friendly_id ||
                            order.friendlyId ||
                            order.id?.substring(0, 8) ||
                            '-'}
                        </td>
                        <td className="py-4 px-2 uppercase">
                          {order.patient_name || order.patientName || '-'}
                        </td>
                        <td className="py-4 px-2 uppercase">
                          {order.work_type || order.workType || order.service || '-'}
                        </td>
                        <td className="py-4 px-2 text-right whitespace-nowrap">
                          {formatCurrency(order.base_price ?? order.basePrice ?? order.price ?? 0)}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          Nenhum pedido selecionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-200 flex flex-col items-end pt-6 mt-6 space-y-2 relative z-10">
                <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">
                  Total Selecionado
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              <div className="mt-16 text-center text-[11px] text-slate-500 space-y-1.5 leading-relaxed relative z-10">
                {reactCompanyInfo && <p dangerouslySetInnerHTML={{ __html: reactCompanyInfo }}></p>}
                {labEndereco && <p>{labEndereco}</p>}
                {reactContacts && <p>{reactContacts}</p>}
                {labPix && (
                  <div className="mt-4">
                    <div className="inline-block bg-slate-50 border-2 border-slate-200 py-3 px-6 rounded-xl shadow-sm">
                      <p className="text-slate-900 font-bold text-[14px] tracking-widest uppercase">
                        CHAVE PIX: {labPix}
                      </p>
                    </div>
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
