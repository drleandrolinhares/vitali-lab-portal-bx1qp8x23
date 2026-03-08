import { useState, useEffect, useMemo } from 'react'
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
import { DollarSign, AlertCircle, CheckCircle2, Clock, Activity } from 'lucide-react'

type PriceStage = { id: string; name: string; price: number; kanban_stage: string }
type PriceItem = { id: string; work_type: string; price_stages?: PriceStage[] }

export default function FinancialPage() {
  const { orders, kanbanStages, currentUser } = useAppStore()
  const [priceList, setPriceList] = useState<PriceItem[]>([])

  useEffect(() => {
    supabase
      .from('price_list' as any)
      .select('id, work_type, price_stages(*)')
      .then(({ data }) => {
        if (data) setPriceList(data)
      })
  }, [])

  const kanbanIndexMap = useMemo(() => {
    const map: Record<string, number> = {}
    kanbanStages.forEach((s) => (map[s.name] = s.orderIndex))
    return map
  }, [kanbanStages])

  if (currentUser?.role !== 'dentist') return <div className="p-8">Acesso restrito</div>

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'completed')

  const displayOrders = activeOrders.map((order) => {
    const priceItem = priceList.find((p) => p.work_type === order.workType)
    const stages = priceItem?.price_stages || []

    const currentOrderIndex = kanbanIndexMap[order.kanbanStage] || 0

    let completedCost = 0
    let pendingCost = 0

    const mappedStages = stages.map((st) => {
      const stIndex = kanbanIndexMap[st.kanban_stage] || 0
      // Valido apenas quando o card SAI do bloco mapeado (entrou em um bloco com index maior)
      const isCompleted = currentOrderIndex > stIndex
      if (isCompleted) completedCost += st.price
      else pendingCost += st.price
      return { ...st, isCompleted }
    })

    return {
      ...order,
      mappedStages,
      completedCost,
      pendingCost,
      totalCost: completedCost + pendingCost,
    }
  })

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const totalAccumulated = displayOrders.reduce((acc, o) => acc + o.completedCost, 0)
  const totalPending = displayOrders.reduce((acc, o) => acc + o.pendingCost, 0)

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Gestão Financeira</h2>
          <p className="text-muted-foreground text-sm">
            Acompanhe os custos acumulados dos seus pedidos em andamento.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 mb-8">
        <Card className="shadow-subtle border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Acumulado (Em Andamento)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatBRL(totalAccumulated)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total a Realizar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatBRL(totalPending)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-muted-foreground" /> Procedimentos em Andamento
        </h3>

        {displayOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
              <DollarSign className="w-12 h-12 mb-4 opacity-20" />
              Nenhum pedido em andamento com custo mapeado.
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
                        <span className="font-semibold text-foreground">{order.patientName}</span>
                        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {order.friendlyId}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{order.workType}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {formatBRL(order.completedCost)}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        de {formatBRL(order.totalCost)}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="space-y-5 mt-2">
                    <div className="flex items-center gap-2 text-sm bg-muted/40 p-3 rounded-lg border border-border/50">
                      <span className="font-medium text-muted-foreground">
                        Fase Atual no Laboratório:
                      </span>
                      <Badge variant="secondary" className="font-semibold tracking-wide">
                        {order.kanbanStage}
                      </Badge>
                    </div>

                    {order.mappedStages.length > 0 ? (
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 pl-2">
                        {order.mappedStages.map((st, i) => (
                          <div key={i} className="relative flex items-center gap-4 ml-8">
                            <div
                              className={`absolute -left-10 w-4 h-4 rounded-full border-2 bg-background z-10 flex items-center justify-center ${st.isCompleted ? 'border-blue-500' : 'border-slate-300 dark:border-slate-700'}`}
                            >
                              {st.isCompleted && (
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <div
                              className={`flex-1 flex justify-between items-center p-3.5 rounded-lg border transition-colors ${st.isCompleted ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30 shadow-sm' : 'bg-muted/30 border-transparent opacity-70'}`}
                            >
                              <div>
                                <p
                                  className={`font-semibold text-sm ${st.isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}
                                >
                                  {st.name}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
                                  {st.isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5" />
                                  )}
                                  {st.kanban_stage}
                                </p>
                              </div>
                              <span
                                className={`font-bold text-sm ${st.isCompleted ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`}
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
    </div>
  )
}
