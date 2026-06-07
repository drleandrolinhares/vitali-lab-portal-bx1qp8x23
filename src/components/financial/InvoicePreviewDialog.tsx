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
import { Printer, Download, Loader2 } from 'lucide-react'
import { useAppStore } from '@/stores/main'
import { useState, useRef } from 'react'
// @ts-expect-error
import html2pdf from 'html2pdf.js'

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
  settlementId,
  date,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dentistName: string
  clinicName: string
  orders: any[]
  totalAmount: number
  settlementId?: string
  date?: string
}) {
  const { appSettings } = useAppStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const invoiceRef = useRef<HTMLTableElement>(null)

  const labProfile = {
    name: appSettings['lab_razao_social'] || appSettings['lab_name'] || 'Laboratório',
    cnpj: appSettings['lab_cnpj'] || '',
    address: appSettings['lab_address'] || '',
    pix_key: appSettings['lab_pix_key'] || '',
    pix_type: appSettings['lab_pix_type'] || '',
    bank_name: appSettings['lab_bank_name'] || '',
  }

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return
    setIsGenerating(true)

    try {
      document.body.classList.add('pdf-generating')

      const element = invoiceRef.current

      const pName = (orders[0]?.patientName || orders[0]?.patient_name || dentistName || 'Cliente')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_')

      const dateStr = new Date().toISOString().split('T')[0]
      const timestamp = new Date().getTime()
      const filename = `Fatura_VitaliLab_${pName}_${dateStr}_${timestamp}.pdf`

      const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 900 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      await html2pdf().set(opt).from(element).save()
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      document.body.classList.remove('pdf-generating')
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    const originalTitle = document.title
    const dateStr = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
    const pName = (orders[0]?.patientName || orders[0]?.patient_name || dentistName || 'Cliente')
      .split(' ')
      .join('')
    document.title = `Fatura_VitaliLab_${pName}_${dateStr}_${new Date().getTime()}`

    setTimeout(() => {
      window.print()
      setTimeout(() => {
        document.title = originalTitle
      }, 500)
    }, 100)
  }

  const fullAddress = labProfile.address

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 print:max-w-none print:h-auto print:max-h-none print:shadow-none print:border-none print:bg-white print:w-full print:block overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b print:hidden shrink-0">
          <DialogTitle>Prévia da Fatura</DialogTitle>
        </DialogHeader>
        <div className="p-6 overflow-auto flex-1 print:overflow-visible print:p-0 pdf-scroll-area">
          <table className="w-full" ref={invoiceRef}>
            <thead className="hidden print:table-header-group">
              <tr>
                <td>
                  <div className="mb-8 text-center border-b border-slate-200 pb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
                      Fatura de Serviços
                    </h1>
                    <p className="text-slate-500 mt-1">{labProfile.name}</p>
                    {settlementId && (
                      <p className="text-sm font-medium mt-2">
                        Fatura #{settlementId.substring(0, 8).toUpperCase()}
                      </p>
                    )}
                    {date && (
                      <p className="text-sm text-slate-500">
                        Data: {new Date(date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="print:hidden mb-8 text-center border-b border-slate-200 pb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
                      Fatura de Serviços
                    </h1>
                    <p className="text-slate-500 mt-1">{labProfile.name}</p>
                    {settlementId && (
                      <p className="text-sm font-medium mt-2">
                        Fatura #{settlementId.substring(0, 8).toUpperCase()}
                      </p>
                    )}
                    {date && (
                      <p className="text-sm text-slate-500">
                        Data: {new Date(date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  <div className="mb-6 flex justify-between items-end print:mb-8">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">Cliente: {dentistName}</h3>
                      {clinicName && <p className="text-muted-foreground">{clinicName}</p>}
                    </div>
                    <div className="text-right hidden print:block">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                        Total da Fatura
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-md print:border-slate-200 print:shadow-none">
                    <Table>
                      <TableHeader className="bg-slate-50 print:bg-slate-100/50">
                        <TableRow>
                          <TableHead>Pedido</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Trabalho</TableHead>
                          <TableHead>Dentes/Arcadas</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((o) => {
                          let teethInfo = '-'
                          if (o.teeth && o.teeth.length > 0)
                            teethInfo = `Dentes: ${o.teeth.join(', ')}`
                          else if (o.arches && o.arches.length > 0)
                            teethInfo = `Arcadas: ${o.arches.join(', ')}`
                          else if (o.tooth_or_arch) {
                            const t = o.tooth_or_arch?.teeth || []
                            const a = o.tooth_or_arch?.arches || []
                            if (t.length > 0) teethInfo = `Dentes: ${t.join(', ')}`
                            else if (a.length > 0) teethInfo = `Arcadas: ${a.join(', ')}`
                          }

                          return (
                            <TableRow key={o.id} className="print:border-b print:border-slate-100">
                              <TableCell className="font-medium text-xs font-mono">
                                {o.friendlyId || o.friendly_id || o.id?.substring(0, 8)}
                              </TableCell>
                              <TableCell>{o.patientName || o.patient_name}</TableCell>
                              <TableCell>{o.workType || o.work_type || '-'}</TableCell>
                              <TableCell className="text-xs text-slate-500">{teethInfo}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(
                                  o.clearedAmount ?? o.basePrice ?? o.base_price ?? 0,
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
                    <div className="flex flex-col gap-4 w-full max-w-xl">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 w-full">
                        <p className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Dados do Laboratório
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold">Razão Social:</span>{' '}
                            {labProfile.name || 'Não cadastrada'}
                          </p>
                          {labProfile.cnpj && (
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">CNPJ:</span> {labProfile.cnpj}
                            </p>
                          )}
                          {fullAddress && (
                            <p className="text-sm text-slate-600 sm:col-span-2">
                              <span className="font-semibold">Endereço:</span> {fullAddress}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 w-full">
                        <p className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Dados para Pagamento (PIX)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold">Chave PIX:</span>{' '}
                            {labProfile.pix_key || 'Não cadastrada'}
                          </p>
                          {labProfile.pix_type && (
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Tipo:</span> {labProfile.pix_type}
                            </p>
                          )}
                          {labProfile.bank_name && (
                            <p className="text-sm text-slate-600 sm:col-span-2">
                              <span className="font-semibold">Banco:</span> {labProfile.bank_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[250px] self-end">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                        Total da Fatura
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot className="hidden print:table-footer-group pdf-footer">
              <tr>
                <td>
                  <div className="pt-8 mt-8 border-t-2 border-slate-300">
                    <div className="flex justify-between gap-8 text-sm break-inside-avoid pt-4">
                      <div className="w-1/2 text-left">
                        <p className="font-bold uppercase tracking-wider text-slate-900 mb-2">
                          Dados do Laboratório
                        </p>
                        <p className="text-slate-800">
                          <span className="font-semibold">Razão Social:</span>{' '}
                          {labProfile.name || 'Não cadastrada'}
                        </p>
                        {labProfile.cnpj && (
                          <p className="text-slate-800">
                            <span className="font-semibold">CNPJ:</span> {labProfile.cnpj}
                          </p>
                        )}
                        {fullAddress && (
                          <p className="text-slate-800 mt-1">
                            <span className="font-semibold">Endereço:</span> {fullAddress}
                          </p>
                        )}
                      </div>
                      <div className="w-1/2 text-left">
                        <p className="font-bold uppercase tracking-wider text-slate-900 mb-2">
                          Dados para Pagamento (PIX)
                        </p>
                        <p className="text-slate-800">
                          <span className="font-semibold">Chave PIX:</span>{' '}
                          {labProfile.pix_key || 'Não cadastrada'}
                        </p>
                        {labProfile.pix_type && (
                          <p className="text-slate-800">
                            <span className="font-semibold">Tipo:</span> {labProfile.pix_type}
                          </p>
                        )}
                        {labProfile.bank_name && (
                          <p className="text-slate-800 mt-1">
                            <span className="font-semibold">Banco:</span> {labProfile.bank_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2 print:hidden shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Fechar
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2" disabled={isGenerating}>
            <Printer className="w-4 h-4" />
            Imprimir Sistêmico
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isGenerating ? 'Gerando...' : 'Baixar PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
