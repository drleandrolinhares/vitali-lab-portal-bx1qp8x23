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
import { Printer } from 'lucide-react'
import { useAppStore } from '@/stores/main'

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
  const { currentUser } = useAppStore()

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 print:max-w-none print:h-auto print:max-h-none print:shadow-none print:border-none print:bg-white print:w-full print:block">
        <DialogHeader className="px-6 py-4 border-b print:hidden">
          <DialogTitle>Prévia da Fatura</DialogTitle>
        </DialogHeader>
        <div className="p-6 overflow-auto flex-1 print:overflow-visible print:p-0">
          <div className="hidden print:block mb-8 text-center border-b border-slate-200 pb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
              Fatura de Serviços
            </h1>
            <p className="text-slate-500 mt-1">Soluções Cerâmicas</p>
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
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalAmount)}</p>
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
                  if (o.teeth && o.teeth.length > 0) teethInfo = `Dentes: ${o.teeth.join(', ')}`
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
                        {formatCurrency(o.clearedAmount ?? o.basePrice ?? o.base_price ?? 0)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:flex-row print:mt-10 print:items-start">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 w-full max-w-sm print:bg-white print:border-2 print:border-slate-300 print:break-inside-avoid">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
                Dados para Pagamento (PIX)
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Chave PIX:</span>{' '}
                {currentUser?.pix_key || 'Não cadastrada'}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Tipo:</span>{' '}
                {currentUser?.pix_type || 'Não cadastrado'}
              </p>
              {currentUser?.bank_name && (
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Banco:</span> {currentUser.bank_name}
                </p>
              )}
            </div>

            <div className="text-right bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[250px] print:hidden">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                Total da Fatura
              </p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2 print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            onClick={handlePrint}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
