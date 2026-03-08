import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity,
  FileDown,
  History,
} from 'lucide-react'
import { getOrderFinancials, formatBRL } from '@/lib/financial'
import { Button } from '@/components/ui/button'

export default function FinancialPage() {
  const { orders, kanbanStages, currentUser, priceList } = useAppStore()
  const [settlements, setSettlements] = useState<any[]>([])

  useEffect(() => {
    if (currentUser?.id) {
      supabase
        .from('settlements' as any)
        .select('*')
        .eq('dentist_id', currentUser.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setSettlements(data)
        })
    }
  }, [currentUser?.id])

  if (currentUser?.role !== 'dentist') return <div className="p-8">Acesso restrito</div>

  const displayOrders = orders
    .map((o) => getOrderFinancials(o, priceList, kanbanStages))
    .filter((o) => o.outstandingCost > 0 || o.pendingCost > 0)

  const totalAccumulated = displayOrders.reduce((acc, o) => acc + o.outstandingCost, 0)
  const totalPending = displayOrders.reduce((acc, o) => acc + o.pendingCost, 0)

  const handleExportCSV = (settlement: any) => {
    const snapshot = settlement.orders_snapshot || []
    let csv = 'Data da Liquidação,Paciente,Trabalho,Valor Cobrado\n'
    const date = new Date(settlement.created_at).toLocaleDateString('pt-BR')
    snapshot.forEach((s: any) => {
      csv += `"${date}","${s.patientName}","${s.workType}",${s.clearedAmount}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Historico_Pagamento_${date}.csv`
    a.click()
  }

  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in print:max-w-none print:m-0 print:p-0">
      <div className="flex items-center gap-3 mb-6 print:hidden">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Gestão Financeira</h2>
          <p className="text-muted-foreground text-sm">
            Acompanhe os custos pendentes e seu histórico de pagamentos.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 print:hidden">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="history">Histórico de Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 print:hidden">
          <div className="grid gap-5 md:grid-cols-2 mb-8">
            <Card className="shadow-subtle border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Saldo Devedor Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {formatBRL(totalAccumulated)}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-subtle border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Trabalhos em Pipeline (A Faturar)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{formatBRL(totalPending)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" /> Procedimentos Pendentes de
              Faturamento
            </h3>

            {displayOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <DollarSign className="w-12 h-12 mb-4 opacity-20" />
                  Nenhum pedido com saldo pendente.
                </CardContent>
              </Card>
            ) : (
              <Accordion type="multiple" className="space-y-4">
                {displayOrders.map((order) => (
                  <AccordionItem
                    key={order.id}
                    value={order.id}
                    className="border rounded-xl bg-card px-4 shadow-subtle overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex flex-1 items-center justify-between pr-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {order.patientName}
                            </span>
                            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                              {order.friendlyId}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">{order.workType}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-bold text-emerald-600 text-lg">
                            {formatBRL(order.outstandingCost)}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            de {formatBRL(order.totalCost)} (Total)
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-5 mt-2">
                        <div className="flex items-center justify-between text-sm bg-muted/40 p-3 rounded-lg border border-border/50">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-muted-foreground">
                              Fase Atual no Laboratório:
                            </span>
                            <Badge variant="secondary" className="font-semibold tracking-wide">
                              {order.kanbanStage}
                            </Badge>
                          </div>
                          {order.clearedBalance > 0 && (
                            <div className="text-amber-600 font-medium text-xs">
                              Já Liquidado: {formatBRL(order.clearedBalance)}
                            </div>
                          )}
                        </div>

                        {order.mappedStages.length > 0 ? (
                          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 pl-2">
                            {order.mappedStages.map((st: any, i: number) => (
                              <div key={i} className="relative flex items-center gap-4 ml-8">
                                <div
                                  className={`absolute -left-10 w-4 h-4 rounded-full border-2 bg-background z-10 flex items-center justify-center ${st.isCompleted ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-700'}`}
                                >
                                  {st.isCompleted && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  )}
                                </div>
                                <div
                                  className={`flex-1 flex justify-between items-center p-3.5 rounded-lg border transition-colors ${st.isCompleted ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 shadow-sm' : 'bg-muted/30 border-transparent opacity-70'}`}
                                >
                                  <div>
                                    <p
                                      className={`font-semibold text-sm ${st.isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}
                                    >
                                      {st.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
                                      {st.isCompleted ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5" />
                                      )}
                                      {st.kanban_stage}
                                    </p>
                                  </div>
                                  <span
                                    className={`font-bold text-sm ${st.isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
                                  >
                                    {formatBRL(st.price)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              Nenhuma etapa de cobrança detalhada foi configurada para este tipo de
                              trabalho. O valor será cobrado integralmente ao final do processo.
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <History className="w-5 h-5 text-muted-foreground" /> Arquivo de Liquidações
            </h3>
            <Button variant="outline" size="sm" onClick={handlePrintPDF} className="gap-2">
              <FileDown className="w-4 h-4" /> Imprimir Relatório
            </Button>
          </div>

          <div className="hidden print:block mb-6">
            <h2 className="text-2xl font-bold">Relatório de Histórico de Pagamentos</h2>
            <p className="text-muted-foreground">
              Clínica: {currentUser.clinic || currentUser.name}
            </p>
            <p className="text-muted-foreground">
              Data da emissão: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {settlements.length === 0 ? (
            <Card className="print:hidden">
              <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <History className="w-12 h-12 mb-4 opacity-20" />
                Nenhum pagamento liquidado no histórico.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {settlements.map((settlement) => (
                <Card
                  key={settlement.id}
                  className="overflow-hidden print:border-none print:shadow-none print:mb-8 print:break-inside-avoid"
                >
                  <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between print:bg-transparent print:border-b-2 print:border-black print:px-0">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Liquidação de {new Date(settlement.created_at).toLocaleDateString('pt-BR')}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ref: {settlement.id.split('-')[0]}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-emerald-600 print:text-black">
                        {formatBRL(settlement.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportCSV(settlement)}
                        className="print:hidden h-8 px-2 text-primary hover:bg-primary/10"
                      >
                        CSV
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 print:pt-4">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/10 print:bg-transparent">
                        <tr className="border-b print:border-gray-300">
                          <th className="py-3 px-4 text-left font-medium text-muted-foreground print:text-black print:px-0">
                            Paciente / OS
                          </th>
                          <th className="py-3 px-4 text-left font-medium text-muted-foreground print:text-black print:px-0">
                            Trabalho
                          </th>
                          <th className="py-3 px-4 text-right font-medium text-muted-foreground print:text-black print:px-0">
                            Valor Cobrado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(settlement.orders_snapshot || []).map((s: any, idx: number) => (
                          <tr
                            key={idx}
                            className="border-b last:border-0 hover:bg-muted/5 print:border-b print:border-gray-200"
                          >
                            <td className="py-3 px-4 print:px-0">
                              <span className="font-medium text-foreground block">
                                {s.patientName}
                              </span>
                              <span className="text-xs text-muted-foreground">{s.friendlyId}</span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground print:px-0">
                              {s.workType}
                            </td>
                            <td className="py-3 px-4 text-right font-medium print:px-0">
                              {formatBRL(s.clearedAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
