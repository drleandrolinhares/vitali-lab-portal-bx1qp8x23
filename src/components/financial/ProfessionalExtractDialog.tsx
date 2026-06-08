import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Wallet, FileText, CheckCircle2 } from 'lucide-react'

export function ProfessionalExtractDialog({
  dentistId,
  dentistName,
  open,
  onOpenChange,
}: {
  dentistId: string | null
  dentistName: string
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    pendingSettlements: any[]
    unbilledOrders: any[]
    paidSettlements: any[]
    recebimentos: any[]
  }>({
    pendingSettlements: [],
    unbilledOrders: [],
    paidSettlements: [],
    recebimentos: [],
  })

  useEffect(() => {
    if (open && dentistId) {
      fetchExtract()
    }
  }, [open, dentistId])

  const fetchExtract = async () => {
    setLoading(true)
    try {
      const [{ data: pendingSettlements }, { data: unbilledOrders }, { data: paidSettlements }] =
        await Promise.all([
          supabase
            .from('settlements')
            .select('*')
            .eq('dentist_id', dentistId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false }),
          supabase
            .from('orders')
            .select(
              'id, friendly_id, patient_name, base_price, created_at, completed_at, status, is_repetition, work_type',
            )
            .eq('dentist_id', dentistId)
            .in('status', ['completed', 'delivered'])
            .is('settlement_id', null)
            .order('completed_at', { ascending: false }),
          supabase
            .from('settlements')
            .select('*')
            .eq('dentist_id', dentistId)
            .eq('status', 'paid')
            .order('paid_at', { ascending: false }),
        ])

      setData({
        pendingSettlements: pendingSettlements || [],
        unbilledOrders: unbilledOrders || [],
        paidSettlements: paidSettlements || [],
        recebimentos: [],
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalOwed =
    data.pendingSettlements.reduce((sum, s) => sum + Number(s.amount || 0), 0) +
    data.unbilledOrders.reduce((sum, o) => sum + Number(o.base_price || 0), 0)

  const totalPaid = data.paidSettlements.reduce((sum, s) => sum + Number(s.amount || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50">
        <DialogHeader className="px-6 py-4 border-b bg-white">
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Extrato do Profissional
          </DialogTitle>
          <DialogDescription>Histórico financeiro consolidado de {dentistName}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 gap-4 p-6 bg-white shrink-0 shadow-sm z-10">
              <div className="border border-slate-200 rounded-xl p-4 bg-emerald-50/50 flex flex-col justify-center">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Total Recebido All-Time
                </span>
                <span className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 bg-red-50/50 flex flex-col justify-center">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" /> Total em Aberto (Devido)
                </span>
                <span className="text-2xl font-bold text-red-700">{formatCurrency(totalOwed)}</span>
              </div>
            </div>

            <Tabs defaultValue="pendencias" className="flex-1 flex flex-col min-h-0">
              <TabsList className="px-6 pt-2 bg-white border-b rounded-none justify-start h-auto w-full shrink-0">
                <TabsTrigger
                  value="pendencias"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 font-medium"
                >
                  Pendências (Em Aberto)
                </TabsTrigger>
                <TabsTrigger
                  value="historico"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 font-medium"
                >
                  Histórico (Pagos)
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 p-6">
                <TabsContent value="pendencias" className="m-0 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      Faturas Pendentes ({data.pendingSettlements.length})
                    </h3>
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Fatura ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.pendingSettlements.length === 0 && (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center text-muted-foreground py-4"
                              >
                                Nenhuma fatura pendente.
                              </TableCell>
                            </TableRow>
                          )}
                          {data.pendingSettlements.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell>
                                {new Date(s.created_at).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {s.id.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-600 border-amber-200"
                                >
                                  Pendente
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold text-slate-900">
                                {formatCurrency(s.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      Trabalhos Prontos a Faturar ({data.unbilledOrders.length})
                    </h3>
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead>Data Conclusão</TableHead>
                            <TableHead>Pedido</TableHead>
                            <TableHead>Paciente / Trabalho</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.unbilledOrders.length === 0 && (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center text-muted-foreground py-4"
                              >
                                Nenhum pedido aguardando faturamento.
                              </TableCell>
                            </TableRow>
                          )}
                          {data.unbilledOrders.map((o) => (
                            <TableRow key={o.id}>
                              <TableCell>
                                {new Date(o.completed_at || o.created_at).toLocaleDateString(
                                  'pt-BR',
                                )}
                              </TableCell>
                              <TableCell className="font-medium text-blue-600">
                                {o.friendly_id || o.id.substring(0, 8)}
                                {o.is_repetition && (
                                  <Badge
                                    variant="destructive"
                                    className="ml-2 text-[9px] px-1 py-0"
                                  >
                                    Repetição
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <p className="font-medium">{o.patient_name}</p>
                                <p className="text-xs text-muted-foreground">{o.work_type}</p>
                              </TableCell>
                              <TableCell className="text-right font-bold text-slate-900">
                                {formatCurrency(o.base_price)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="historico" className="m-0 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      Faturas Pagas ({data.paidSettlements.length})
                    </h3>
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead>Data Pagamento</TableHead>
                            <TableHead>Fatura ID / Obs</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.paidSettlements.length === 0 && (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center text-muted-foreground py-4"
                              >
                                Nenhuma fatura paga no histórico.
                              </TableCell>
                            </TableRow>
                          )}
                          {data.paidSettlements.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell>
                                {s.paid_at
                                  ? new Date(s.paid_at).toLocaleDateString('pt-BR')
                                  : new Date(s.created_at).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell>
                                <p className="font-mono text-xs">{s.id.substring(0, 8)}...</p>
                                {s.note && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{s.note}</p>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-50 text-emerald-600 border-emerald-200"
                                >
                                  Pago
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold text-emerald-700">
                                {formatCurrency(s.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
