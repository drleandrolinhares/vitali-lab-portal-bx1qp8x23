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
  const [isGenerating, setIsGenerating] = useState(false)
  const pdfContainerRef = useRef<HTMLDivElement>(null)

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

  const handleDownloadPDF = async () => {
    if (!pdfContainerRef.current) return
    setIsGenerating(true)

    try {
      const originalTitle = document.title

      const pName = (
        orders[0]?.patientName ||
        orders[0]?.patient_name ||
        dentist?.name ||
        'Cliente'
      )
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '')

      const dateStr = new Date().toISOString().split('T')[0]
      const filename = `Fatura_VitaliLab_${pName}_${dateStr}.pdf`

      document.title = filename

      const opt = {
        margin: [0, 0, 0, 0],
        filename: filename,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      await html2pdf().set(opt).from(pdfContainerRef.current).save()

      setTimeout(() => {
        document.title = originalTitle
      }, 500)
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    const originalTitle = document.title
    const dateStr = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
    const pName = (orders[0]?.patientName || dentist?.name || 'Cliente').split(' ').join('')
    document.title = `Fatura_VitaliLab_${pName}_${dateStr}`

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
          <DialogTitle>Detalhes da Fatura #{settlement.id.substring(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-auto flex-1 print:overflow-visible print:p-0 bg-slate-100 print:bg-white flex justify-center">
          <div className="bg-white w-full max-w-[210mm] shadow-md border border-slate-200 print:border-none print:shadow-none min-h-[297mm] flex flex-col p-8 print:p-0">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-6 mb-8 shrink-0">
              <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
                Detalhes da Fatura
              </h1>
              <p className="text-slate-500 mt-1">{labProfile.name}</p>
              <p className="text-sm font-medium mt-2">
                Fatura #{settlement.id.substring(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Client Info & Status */}
            <div className="flex justify-between items-start mb-8 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {dentist?.name || 'Desconhecido'}
                </h3>
                {dentist?.clinic && <p className="text-muted-foreground">{dentist.clinic}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Status
                </p>
                <p
                  className={`font-bold uppercase text-sm ${settlement.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}
                >
                  {settlement.status === 'paid' ? 'Recebido' : 'Aguardando Pagamento'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200 shrink-0">
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
                <p className="font-bold text-primary text-lg leading-none">
                  {formatCurrency(settlement.amount)}
                </p>
              </div>
            </div>

            {/* Orders Table */}
            <div className="mb-8 flex-1">
              <h4 className="font-bold text-slate-700 mb-3">Pedidos Inclusos</h4>
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="font-semibold">Pedido</TableHead>
                    <TableHead className="font-semibold">Paciente</TableHead>
                    <TableHead className="font-semibold">Descrição dos casos</TableHead>
                    <TableHead className="text-right font-semibold">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o: any) => (
                    <TableRow key={o.id}>
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

            {/* Persistent Footer */}
            <div className="pt-8 border-t-2 border-slate-200 flex justify-between text-sm shrink-0">
              <div className="w-[48%]">
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
              <div className="w-[48%]">
                <p className="font-bold uppercase tracking-wider text-slate-900 mb-2">Chave PIX</p>
                <p className="text-slate-800">
                  <span className="font-semibold">Chave:</span>{' '}
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
        </div>

        {/* HIDDEN CONTAINER FOR PDF EXPORT ONLY */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1000,
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          <div
            ref={pdfContainerRef}
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              color: '#000',
              fontFamily: 'sans-serif',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '1.5rem',
                marginBottom: '2rem',
                flexShrink: 0,
              }}
            >
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Detalhes da Fatura
              </h1>
              <p
                style={{
                  color: '#475569',
                  marginTop: '8px',
                  fontSize: '14px',
                  margin: '4px 0 0 0',
                }}
              >
                {labProfile.name}
              </p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '8px 0 0 0' }}>
                Fatura #{settlement.id.substring(0, 8).toUpperCase()}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexShrink: 0,
              }}
            >
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>
                  Cliente: {dentist?.name || 'Desconhecido'}
                </h3>
                {dentist?.clinic && (
                  <p style={{ color: '#475569', fontSize: '14px', margin: '4px 0 0 0' }}>
                    {dentist.clinic}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#475569',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0',
                  }}
                >
                  Status
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                    textTransform: 'uppercase',
                    color: settlement.status === 'paid' ? '#059669' : '#d97706',
                  }}
                >
                  {settlement.status === 'paid' ? 'Recebido' : 'Aguardando Pagamento'}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                flexShrink: 0,
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: '10px',
                    color: '#64748b',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0',
                  }}
                >
                  Data Fechamento
                </p>
                <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                  {new Date(settlement.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: '10px',
                    color: '#64748b',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0',
                  }}
                >
                  Data Pagamento
                </p>
                <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                  {settlement.paid_at
                    ? new Date(settlement.paid_at).toLocaleDateString('pt-BR')
                    : '-'}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: '10px',
                    color: '#64748b',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    margin: '0 0 4px 0',
                  }}
                >
                  Valor Total
                </p>
                <p style={{ fontSize: '16px', margin: 0, fontWeight: 'bold' }}>
                  {formatCurrency(settlement.amount)}
                </p>
              </div>
            </div>

            <div style={{ flex: '1 0 auto', marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>
                Pedidos Inclusos
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>
                      Pedido
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>
                      Paciente
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>
                      Descrição dos casos
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>
                        {o.friendlyId || o.id?.substring(0, 8)}
                      </td>
                      <td style={{ padding: '12px 8px' }}>{o.patientName}</td>
                      <td style={{ padding: '12px 8px' }}>{o.workType || '-'}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatCurrency(o.clearedAmount || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Push footer to bottom */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '2rem',
                borderTop: '2px solid #cbd5e1',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                flexShrink: 0,
              }}
            >
              <div style={{ width: '48%' }}>
                <p
                  style={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    margin: 0,
                  }}
                >
                  Dados do Laboratório
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Razão Social:</strong> {labProfile.name || 'Não cadastrada'}
                </p>
                {labProfile.cnpj && (
                  <p style={{ margin: '4px 0' }}>
                    <strong>CNPJ:</strong> {labProfile.cnpj}
                  </p>
                )}
                {fullAddress && (
                  <p style={{ margin: '4px 0' }}>
                    <strong>Endereço:</strong> {fullAddress}
                  </p>
                )}
              </div>
              <div style={{ width: '48%' }}>
                <p
                  style={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    margin: 0,
                  }}
                >
                  Chave PIX
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Chave:</strong> {labProfile.pix_key || 'Não cadastrada'}
                </p>
                {labProfile.pix_type && (
                  <p style={{ margin: '4px 0' }}>
                    <strong>Tipo:</strong> {labProfile.pix_type}
                  </p>
                )}
                {labProfile.bank_name && (
                  <p style={{ margin: '4px 0' }}>
                    <strong>Banco:</strong> {labProfile.bank_name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2 print:hidden shrink-0 bg-white">
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
