import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatBRL } from '@/lib/financial'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { CreateInstallmentDialog } from './CreateInstallmentDialog'
import { format } from 'date-fns'

export function DentistBillingDetails({
  open,
  onOpenChange,
  dentistData,
  selectedMonthLabel,
  onRefresh,
}: any) {
  const [parcelarOpen, setParcelarOpen] = useState(false)
  const [settling, setSettling] = useState(false)
  const [totalPaid, setTotalPaid] = useState(0)

  useEffect(() => {
    if (open && dentistData) {
      supabase
        .from('settlements')
        .select('amount')
        .eq('dentist_id', dentistData.id)
        .then(({ data }) => {
          if (data) setTotalPaid(data.reduce((acc, s) => acc + Number(s.amount), 0))
        })
    }
  }, [open, dentistData])

  const handleSettle = async () => {
    setSettling(true)
    try {
      const { currentMonthTotal, outstandingOrders, activePlans, id } = dentistData
      if (currentMonthTotal <= 0) {
        toast({ title: 'Nenhum valor pendente para liquidar' })
        setSettling(false)
        return
      }

      if (outstandingOrders.length > 0) {
        const updates = outstandingOrders.map((o: any) =>
          supabase.from('orders').update({ cleared_balance: o.completedCost }).eq('id', o.id),
        )
        await Promise.all(updates)
      }

      if (activePlans.length > 0) {
        const planUpdates = activePlans.map((p: any) => {
          const newRemaining = p.remaining_installments - 1
          return supabase
            .from('billing_installments')
            .update({
              remaining_installments: newRemaining,
              status: newRemaining === 0 ? 'completed' : 'active',
            })
            .eq('id', p.id)
        })
        await Promise.all(planUpdates)
      }

      const snapshot = [
        ...outstandingOrders.map((o: any) => ({
          orderId: o.id,
          friendlyId: o.friendlyId,
          patientName: o.patientName,
          workType: o.workType,
          clearedAmount: o.outstandingCost,
        })),
        ...activePlans.map((p: any) => ({
          planId: p.id,
          description: `Parcela ${p.total_installments - p.remaining_installments + 1}/${p.total_installments}`,
          clearedAmount: p.installment_value,
        })),
      ]

      await supabase
        .from('settlements')
        .insert({ dentist_id: id, amount: currentMonthTotal, orders_snapshot: snapshot })
      toast({ title: 'Fatura liquidada com sucesso!' })
      onRefresh()
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setSettling(false)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Faturamento - ${dentistData.name}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; font-size: 13px; }
            th { background-color: #f9fafb; font-weight: 600; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Faturamento Mensal: ${dentistData.name}</h2>
          <p><strong>Mês de Referência:</strong> ${selectedMonthLabel}</p>
          <p><strong>Período Apurado:</strong> ${format(dentistData.cycle.start, 'dd/MM/yyyy')} a ${format(dentistData.cycle.end, 'dd/MM/yyyy')}</p>
          
          <h3>Trabalhos Realizados (Mês Atual)</h3>
          <table>
             <thead>
               <tr>
                 <th>Pedido</th>
                 <th>Paciente</th>
                 <th>Trabalho</th>
                 <th class="text-right">Valor</th>
               </tr>
             </thead>
             <tbody>
               ${dentistData.outstandingOrders.length === 0 ? '<tr><td colspan="4" class="text-center">Nenhum pedido pendente neste ciclo</td></tr>' : ''}
               ${dentistData.outstandingOrders
                 .map(
                   (o: any) =>
                     `<tr><td>${o.friendlyId}</td><td>${o.patientName}</td><td>${o.workType}</td><td class="text-right">${formatBRL(o.outstandingCost)}</td></tr>`,
                 )
                 .join('')}
             </tbody>
          </table>

          <h3>Parcelamentos (Planos Ativos)</h3>
          <table>
             <thead>
               <tr>
                 <th>Descrição do Parcelamento</th>
                 <th class="text-right">Valor da Parcela</th>
               </tr>
             </thead>
             <tbody>
               ${dentistData.activePlans.length === 0 ? '<tr><td colspan="2" class="text-center">Nenhum parcelamento ativo</td></tr>' : ''}
               ${dentistData.activePlans
                 .map(
                   (p: any) =>
                     `<tr><td>Parcela ${p.total_installments - p.remaining_installments + 1} de ${p.total_installments} (Ref. Total: ${formatBRL(p.total_amount)})</td><td class="text-right">${formatBRL(p.installment_value)}</td></tr>`,
                 )
                 .join('')}
             </tbody>
          </table>

          <h3 class="text-right" style="margin-top: 30px;">Total da Fatura: ${formatBRL(dentistData.currentMonthTotal)}</h3>
          
          <div style="margin-top: 50px; text-align: center; font-size: 11px; color: #6b7280;">
            <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pr-6 gap-4">
          <DialogTitle>Faturamento: {dentistData?.name}</DialogTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setParcelarOpen(true)}
              disabled={dentistData?.ordersTotal <= 0}
            >
              Parcelar Fatura
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={dentistData?.currentMonthTotal <= 0}
            >
              Gerar Relatório
            </Button>
            <Button
              onClick={handleSettle}
              disabled={settling || dentistData?.currentMonthTotal <= 0}
            >
              Liquidar Mês
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-red-600 uppercase">Fatura Atual (Mês)</p>
              <p className="text-2xl font-bold text-red-700">
                {formatBRL(dentistData?.currentMonthTotal || 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase">
                Total Histórico Pago
              </p>
              <p className="text-2xl font-bold text-emerald-700">{formatBRL(totalPaid)}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-blue-600 uppercase">Planos Ativos</p>
              <p className="text-2xl font-bold text-blue-700">
                {dentistData?.activePlans?.length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase">
              Trabalhos do Mês ({dentistData?.outstandingOrders?.length})
            </h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Trabalho</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dentistData?.outstandingOrders.map((o: any) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">
                        {o.friendlyId}{' '}
                        <span className="text-xs font-normal text-muted-foreground block">
                          {o.patientName}
                        </span>
                      </TableCell>
                      <TableCell>{o.workType}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatBRL(o.outstandingCost)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {dentistData?.outstandingOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                        Nenhum pedido pendente apurado neste mês.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {dentistData?.activePlans?.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase">
                Parcelamentos em Andamento
              </h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição do Plano</TableHead>
                      <TableHead className="text-right">Valor da Parcela</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dentistData?.activePlans.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          Parcela {p.total_installments - p.remaining_installments + 1}/
                          {p.total_installments}
                          <span className="text-xs text-muted-foreground block">
                            De um total consolidado de {formatBRL(p.total_amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-amber-600">
                          {formatBRL(p.installment_value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      {parcelarOpen && (
        <CreateInstallmentDialog
          open={parcelarOpen}
          onOpenChange={setParcelarOpen}
          dentistData={dentistData}
          onSuccess={() => {
            onRefresh()
            onOpenChange(false)
          }}
        />
      )}
    </Dialog>
  )
}
