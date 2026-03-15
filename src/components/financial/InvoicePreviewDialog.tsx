import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { formatBRL } from '@/lib/financial'
import { Printer } from 'lucide-react'

export function InvoicePreviewDialog({ open, onOpenChange, data }: any) {
  if (!data) return null

  const { dentist, aFaturarOrders, aFaturarTotal, appSettings } = data
  const {
    lab_razao_social = 'VITALI LAB',
    lab_cnpj = '',
    lab_address = '',
    lab_phone = '',
    lab_email = '',
    lab_logo_url = '',
  } = appSettings || {}

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Prévia - ${dentist.name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { max-width: 150px; max-height: 80px; object-fit: contain; }
            .lab-info { text-align: right; font-size: 12px; color: #4b5563; }
            .lab-info h1 { margin: 0 0 5px 0; color: #111827; font-size: 18px; text-transform: uppercase; }
            .invoice-title { font-size: 20px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; text-align: center; letter-spacing: 1px; }
            .client-info { margin-bottom: 30px; padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
            th, td { border-bottom: 1px solid #e5e7eb; padding: 10px 12px; text-align: left; font-size: 13px; }
            th { background-color: #f9fafb; font-weight: 600; text-transform: uppercase; font-size: 11px; color: #4b5563; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-row { font-size: 16px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              ${lab_logo_url ? `<img src="${lab_logo_url}" class="logo" alt="Logo" />` : `<h2>${lab_razao_social}</h2>`}
            </div>
            <div class="lab-info">
              <h1>${lab_razao_social}</h1>
              ${lab_cnpj ? `<p>CNPJ: ${lab_cnpj}</p>` : ''}
              ${lab_address ? `<p>${lab_address}</p>` : ''}
              ${lab_phone ? `<p>Tel: ${lab_phone}</p>` : ''}
              ${lab_email ? `<p>${lab_email}</p>` : ''}
            </div>
          </div>
          
          <div class="invoice-title">Prévia de Faturamento</div>
          
          <div class="client-info">
            <strong>Cliente:</strong> ${dentist.name || 'Desconhecido'}<br/>
            ${dentist.clinic ? `<strong>Clínica:</strong> ${dentist.clinic}<br/>` : ''}
            ${dentist.cpf ? `<strong>CPF/CNPJ:</strong> ${dentist.cpf}<br/>` : ''}
          </div>

          <table>
             <thead>
               <tr>
                 <th>Data</th>
                 <th>Pedido</th>
                 <th>Paciente</th>
                 <th>Serviço</th>
                 <th class="text-right">Valor</th>
               </tr>
             </thead>
             <tbody>
               ${
                 aFaturarOrders.length === 0
                   ? '<tr><td colspan="5" class="text-center">Nenhum trabalho a faturar</td></tr>'
                   : ''
               }
               ${aFaturarOrders
                 .map(
                   (o: any) => `
                 <tr>
                   <td>${format(new Date(o.createdAt), 'dd/MM/yyyy')}</td>
                   <td>${o.friendlyId || '-'}</td>
                   <td>${o.patientName || '-'}</td>
                   <td>${o.workType || '-'}</td>
                   <td class="text-right">${formatBRL(o.outstandingCost || 0)}</td>
                 </tr>
               `,
                 )
                 .join('')}
             </tbody>
             <tfoot>
               <tr class="total-row">
                 <td colspan="4" class="text-right" style="padding-top: 20px;">Total a Faturar</td>
                 <td class="text-right" style="padding-top: 20px;">${formatBRL(aFaturarTotal)}</td>
               </tr>
             </tfoot>
          </table>

          <div class="footer">
            Prévia para Conferência
          </div>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-[#f8fafc] border-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogTitle className="sr-only">Prévia de Faturamento - {dentist.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Visualização da fatura do cliente com os pedidos a faturar e o valor total.
        </DialogDescription>

        {/* Toolbar */}
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white sticky top-0 z-10 shadow-md">
          <div className="font-semibold text-sm tracking-wide">VISUALIZADOR DE FATURA</div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="h-8 bg-slate-800 text-white hover:bg-slate-700 border-0"
            >
              <Printer className="w-4 h-4 mr-2" /> Imprimir Prévia
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 bg-transparent text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              Fechar
            </Button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div className="bg-white w-full max-w-3xl shadow-xl border border-slate-200 p-8 sm:p-12 relative print-content">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-200 pb-6 mb-8 gap-4">
              <div className="flex-shrink-0">
                {lab_logo_url ? (
                  <img
                    src={lab_logo_url}
                    className="h-16 max-w-[200px] object-contain"
                    alt="Logo"
                  />
                ) : (
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                    {lab_razao_social}
                  </h2>
                )}
              </div>
              <div className="text-left sm:text-right text-sm text-slate-600 space-y-0.5">
                <p className="font-bold text-slate-900 text-base uppercase mb-1">
                  {lab_razao_social}
                </p>
                {lab_cnpj && <p>CNPJ: {lab_cnpj}</p>}
                {lab_address && <p>{lab_address}</p>}
                {lab_phone && <p>Tel: {lab_phone}</p>}
                {lab_email && <p>{lab_email}</p>}
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-widest">
                Prévia de Faturamento
              </h3>
            </div>

            {/* Client Info */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-8 text-sm text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
                <div>
                  <span className="text-slate-500 text-xs uppercase font-semibold block mb-0.5">
                    Cliente
                  </span>
                  <strong className="text-slate-900 text-base">{dentist.name}</strong>
                </div>
                {dentist.clinic && (
                  <div>
                    <span className="text-slate-500 text-xs uppercase font-semibold block mb-0.5">
                      Clínica
                    </span>
                    <strong className="text-slate-900">{dentist.clinic}</strong>
                  </div>
                )}
                {dentist.cpf && (
                  <div>
                    <span className="text-slate-500 text-xs uppercase font-semibold block mb-0.5">
                      CPF / CNPJ
                    </span>
                    <strong className="text-slate-900">{dentist.cpf}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="mb-8">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-600 uppercase text-xs tracking-wider">
                    <th className="py-3 font-semibold">Data</th>
                    <th className="py-3 font-semibold">Pedido</th>
                    <th className="py-3 font-semibold">Paciente</th>
                    <th className="py-3 font-semibold">Serviço</th>
                    <th className="py-3 font-semibold text-right pr-2">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {aFaturarOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                        Nenhum trabalho a faturar
                      </td>
                    </tr>
                  ) : (
                    aFaturarOrders.map((o: any) => (
                      <tr key={o.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 text-slate-600 whitespace-nowrap">
                          {format(new Date(o.createdAt), 'dd/MM/yyyy')}
                        </td>
                        <td className="py-3 font-medium text-slate-800">{o.friendlyId}</td>
                        <td className="py-3 text-slate-700">{o.patientName}</td>
                        <td
                          className="py-3 text-slate-600 max-w-[200px] truncate"
                          title={o.workType}
                        >
                          {o.workType}
                        </td>
                        <td className="py-3 text-right font-medium text-slate-900 pr-2">
                          {formatBRL(o.outstandingCost)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end pt-4 border-t-2 border-slate-800 mb-16">
              <div className="text-right">
                <p className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-1">
                  Total a Faturar
                </p>
                <p className="text-3xl font-black text-slate-900">{formatBRL(aFaturarTotal)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-t border-slate-200 pt-6 mt-auto">
              Prévia para Conferência
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
