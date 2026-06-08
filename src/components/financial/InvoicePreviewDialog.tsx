import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Printer } from 'lucide-react'

interface OrderSnapshot {
  id: string
  friendlyId?: string
  patientName?: string
  workType?: string
  clearedAmount?: number
  basePrice?: number
  completedAt?: string
  createdAt?: string
  isRepetition?: boolean
}

interface InvoicePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dentistName: string
  clinicName?: string
  orders: OrderSnapshot[]
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
  const [labData, setLabData] = useState<{
    razao_social: string
    cnpj: string
    pix_key: string
    banco: string
  } | null>(null)

  const [loading, setLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    if (open) {
      fetchLabData()
    } else {
      // Reset state when closed
      setLabData(null)
      setLoading(true)
      setIsPrinting(false)
    }
  }, [open])

  const fetchLabData = async () => {
    setLoading(true)
    try {
      // Fetch both settings and master profile in parallel for fallback
      const [settingsRes, adminRes] = await Promise.all([
        supabase.from('app_settings').select('*'),
        supabase.from('profiles').select('*').in('role', ['master', 'admin']).limit(1).single(),
      ])

      const settings = settingsRes.data || []
      const admin = adminRes.data

      const getSetting = (key: string) => settings.find((s) => s.key === key)?.value

      setLabData({
        razao_social: getSetting('lab_name') || admin?.name || 'Laboratório Não Informado',
        cnpj: getSetting('lab_cnpj') || admin?.cpf || admin?.rg || 'CNPJ Não Informado',
        pix_key: getSetting('lab_pix_key') || admin?.pix_key || 'Chave PIX Não Informada',
        banco: getSetting('lab_bank_name') || admin?.bank_name || 'Banco Não Informado',
      })
    } catch (error) {
      console.error('Error fetching lab data:', error)
      setLabData({
        razao_social: 'Laboratório Não Informado',
        cnpj: 'CNPJ Não Informado',
        pix_key: 'Chave PIX Não Informada',
        banco: 'Banco Não Informado',
      })
    } finally {
      // Debounce to ensure fonts and assets are fully loaded before enabling print
      setTimeout(() => {
        setLoading(false)
      }, 600)
    }
  }

  const handlePrint = () => {
    setIsPrinting(true)
    // Small delay to allow the state to update the UI (e.g. spinner on button)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 150)
  }

  const referenceId = settlementId?.startsWith('AGRUPADO')
    ? 'FATURA AGRUPADA'
    : settlementId?.split('-')[0].toUpperCase() || 'NOVA FATURA'

  const invoiceDate = date
    ? new Date(date).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden print:max-w-none print:h-auto print:overflow-visible print:border-none print:shadow-none print:m-0 print:p-0">
        <DialogHeader className="px-6 py-4 border-b print:hidden">
          <DialogTitle>Prévia da Fatura</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 bg-slate-50 print:p-0 print:bg-white pdf-scroll-area">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm text-slate-500 font-medium">
                Sincronizando dados institucionais...
              </p>
            </div>
          ) : (
            <div
              id="invoice-capture-area"
              className="bg-white p-8 rounded-xl shadow-sm border print:shadow-none print:border-none print:p-0 print:m-0"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8 border-b pb-6 print:border-slate-200">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">FATURA DE SERVIÇOS</h1>
                  <p className="text-slate-500 font-medium">Ref: {referenceId}</p>
                  <p className="text-sm text-slate-500 mt-2">Data de Emissão: {invoiceDate}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-slate-800">{labData?.razao_social}</h2>
                  <p className="text-sm text-slate-600 mt-1">CNPJ / CPF: {labData?.cnpj}</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="mb-8 p-5 bg-slate-50 rounded-lg border border-slate-100 print:bg-transparent print:border-slate-200 print:rounded-none">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Faturado para:
                </h3>
                <p className="text-lg font-bold text-slate-900">{dentistName}</p>
                {clinicName && <p className="text-slate-600 mt-1">{clinicName}</p>}
              </div>

              {/* Items Table */}
              <div className="mb-8 border rounded-lg overflow-hidden print:border-slate-200 print:rounded-none">
                <Table>
                  <TableHeader className="bg-slate-100/50 print:bg-transparent hidden print:table-header-group">
                    <TableRow className="print:border-b-2 print:border-slate-800">
                      <TableHead className="font-bold text-slate-900">Pedido</TableHead>
                      <TableHead className="font-bold text-slate-900">Paciente</TableHead>
                      <TableHead className="font-bold text-slate-900">Trabalho</TableHead>
                      <TableHead className="font-bold text-slate-900 text-center">Data</TableHead>
                      <TableHead className="font-bold text-slate-900 text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableHeader className="bg-slate-100/50 print:hidden">
                    <TableRow>
                      <TableHead className="font-bold text-slate-900">Pedido</TableHead>
                      <TableHead className="font-bold text-slate-900">Paciente</TableHead>
                      <TableHead className="font-bold text-slate-900">Trabalho</TableHead>
                      <TableHead className="font-bold text-slate-900 text-center">Data</TableHead>
                      <TableHead className="font-bold text-slate-900 text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o, idx) => (
                      <TableRow
                        key={o.id || idx}
                        className="print:border-b-slate-200 print:break-inside-avoid hover:bg-transparent"
                      >
                        <TableCell className="font-medium text-slate-700">
                          {o.friendlyId || o.id?.substring(0, 8) || '-'}
                          {o.isRepetition && (
                            <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase font-bold print:border print:border-red-200">
                              Rep
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700">{o.patientName || '-'}</TableCell>
                        <TableCell className="text-slate-600">{o.workType || '-'}</TableCell>
                        <TableCell className="text-center text-slate-500 text-sm">
                          {o.completedAt
                            ? new Date(o.completedAt).toLocaleDateString('pt-BR')
                            : o.createdAt
                              ? new Date(o.createdAt).toLocaleDateString('pt-BR')
                              : '-'}
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-900">
                          {formatCurrency(o.clearedAmount ?? o.basePrice ?? 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                          Nenhum pedido encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="flex justify-end mb-12 print:break-inside-avoid">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 min-w-[300px] text-right print:bg-transparent print:rounded-none print:border-slate-800 print:border-2">
                  <p className="text-sm font-bold text-slate-500 uppercase mb-2 tracking-wider print:text-slate-700">
                    Total da Fatura
                  </p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalAmount)}</p>
                </div>
              </div>

              {/* Dynamic Footer / Payment Info */}
              <div className="mt-8 pt-8 border-t-2 border-slate-800 invoice-footer print:mt-12">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">
                  Dados para Pagamento
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-500">
                      Razão Social / Nome do Laboratório
                    </p>
                    <p className="font-semibold text-slate-900 text-base">
                      {labData?.razao_social}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-500">
                      CNPJ / CPF
                    </p>
                    <p className="font-semibold text-slate-900 text-base">{labData?.cnpj}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-500">
                      Chave PIX
                    </p>
                    <p className="font-semibold text-slate-900 text-base break-all">
                      {labData?.pix_key}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-500">
                      Instituição Bancária
                    </p>
                    <p className="font-semibold text-slate-900 text-base">{labData?.banco}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-slate-50 print:hidden shrink-0 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPrinting || loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePrint}
            disabled={loading || isPrinting}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white min-w-[200px]"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparando PDF...
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                Baixar PDF / Imprimir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
