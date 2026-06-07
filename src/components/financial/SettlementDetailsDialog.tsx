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

export function SettlementDetailsDialog({
  open,
  onOpenChange,
  settlement,
  dentist,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  settlement: any
  dentist: any
}) {
  const { appSettings } = useAppStore()

  if (!settlement) return null

  const orders = Array.isArray(settlement.orders_snapshot) ? settlement.orders_snapshot : []

  const labProfile = {
    name: appSettings['lab_razao_social'] || appSettings['lab_name'] || 'Laboratório',
    cnpj: appSettings['lab_cnpj'] || '',
    address: appSettings['lab_address'] || '',
    pix_key: appSettings['lab_pix_key'] || '',
    pix_type: appSettings['lab_pix_type'] || '',
    bank_name: appSettings['lab_bank_name'] || '',
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 print:max-w-none print:h-auto print:max-h-none print:shadow-none print:border-none print:bg-white print:w-full print:block">
        <DialogHeader className="px-6 py-4 border-b print:hidden">
          <DialogTitle>Detalhes da Fatura #{settlement.id.substring(0, 8)}</DialogTitle>
        </DialogHeader>
        <div className="p-6 overflow-auto flex-1 print:overflow-visible print:p-0">
          <div className="hidden print:block mb-8 text-center border-b border-slate-200 pb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
              Detalhes da Fatura
            </h1>
            <p className="text-slate-500 mt-1">{labProfile.name}</p>
            <p className="text-sm font-medium mt-2">
              Fatura #{settlement.id.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="flex justify-between items-start mb-6 print:mb-8">
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                {dentist?.name || 'Desconhecido'}
              </h3>
              {dentist?.clinic && <p className="text-muted-foreground">{dentist.clinic}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500 print:text-slate-500">Status</p>
              <p
                className={`font-bold uppercase text-sm ${settlement.status === 'paid' ? 'text-emerald-600 print:text-emerald-700' : 'text-amber-600 print:text-slate-900'}`}
              >
                {settlement.status === 'paid' ? 'Recebido' : 'Aguardando Pagamento'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100 print:bg-slate-50/50 print:border-slate-200">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Data Fechamento
              </p>
              <p className="font-medium text-slate-800">
                {new Date(settlement.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Data Pagamento
              </p>
              <p className="font-medium text-slate-800">
                {settlement.paid_at
                  ? new Date(settlement.paid_at).toLocaleDateString('pt-BR')
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Total de Pedidos
              </p>
              <p className="font-medium text-slate-800">{orders.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Valor Total
              </p>
              <p className="font-bold text-primary text-lg leading-none print:text-slate-900">
                {formatCurrency(settlement.amount)}
              </p>
            </div>
          </div>

          <h4 className="font-bold text-slate-700 mb-3 print:mb-4">Pedidos Inclusos</h4>
          <div className="border rounded-md print:border-slate-200 print:shadow-none">
            <Table>
              <TableHeader className="bg-slate-50 print:bg-slate-100/50">
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Trabalho</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o: any) => (
                  <TableRow key={o.id} className="print:border-b print:border-slate-100">
                    <TableCell className="font-medium text-xs font-mono">
                      {o.friendlyId || o.id?.substring(0, 8)}
                    </TableCell>
                    <TableCell>{o.patientName}</TableCell>
                    <TableCell>{o.workType || '-'}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(o.clearedAmount || 0)}
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum pedido atrelado a esta fatura.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:flex-col print:mt-10 print:items-start print:gap-8">
            <div className="flex flex-col gap-4 w-full max-w-xl print:w-full print:max-w-none">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 w-full print:bg-transparent print:border-t-2 print:border-b-0 print:border-x-0 print:border-slate-300 print:rounded-none print:p-0 print:pt-4 print:break-inside-avoid">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2 print:text-slate-900">
                  Dados do Laboratório
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 print:grid-cols-2">
                  <p className="text-sm text-slate-600 print:text-slate-800">
                    <span className="font-semibold">Razão Social:</span>{' '}
                    {labProfile.name || 'Não cadastrada'}
                  </p>
                  {labProfile.cnpj && (
                    <p className="text-sm text-slate-600 print:text-slate-800">
                      <span className="font-semibold">CNPJ:</span> {labProfile.cnpj}
                    </p>
                  )}
                  {labProfile.address && (
                    <p className="text-sm text-slate-600 sm:col-span-2 print:col-span-2 print:text-slate-800">
                      <span className="font-semibold">Endereço:</span> {labProfile.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 w-full print:bg-transparent print:border-t-2 print:border-b-0 print:border-x-0 print:border-slate-300 print:rounded-none print:p-0 print:pt-4 print:break-inside-avoid">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2 print:text-slate-900">
                  Dados para Pagamento (PIX)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 print:grid-cols-2">
                  <p className="text-sm text-slate-600 print:text-slate-800">
                    <span className="font-semibold">Chave PIX:</span>{' '}
                    {labProfile.pix_key || 'Não cadastrada'}
                  </p>
                  {labProfile.pix_type && (
                    <p className="text-sm text-slate-600 print:text-slate-800">
                      <span className="font-semibold">Tipo:</span> {labProfile.pix_type}
                    </p>
                  )}
                  {labProfile.bank_name && (
                    <p className="text-sm text-slate-600 sm:col-span-2 print:col-span-2 print:text-slate-800">
                      <span className="font-semibold">Banco:</span> {labProfile.bank_name}
                    </p>
                  )}
                </div>
              </div>
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
