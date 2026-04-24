import { useState, useEffect, useMemo } from 'react'
import { useAppStore } from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Activity,
  FileDown,
  History,
  CalendarDays,
  Loader2,
} from 'lucide-react'
import {
  getOrderFinancials,
  formatBRL,
  generateMonthOptions,
  filterOrdersForFinancials,
} from '@/lib/financial'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Navigate } from 'react-router-dom'

export default function FinancialPage() {
  const {
    orders,
    kanbanStages,
    currentUser,
    priceList,
    loading,
    effectiveRole,
    Visualizando_Como_ID,
  } = useAppStore()
  const [settlements, setSettlements] = useState<any[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)

  const monthOptions = useMemo(() => generateMonthOptions(), [])
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'))

  const safeOrders = Array.isArray(orders) ? orders : []
  const safePriceList = Array.isArray(priceList) ? priceList : []
  const safeKanbanStages = Array.isArray(kanbanStages) ? kanbanStages : []

  const monthFilteredOrders = useMemo(
    () => filterOrdersForFinancials(safeOrders, selectedMonth),
    [safeOrders, selectedMonth],
  )

  const displayOrders = useMemo(
    () => monthFilteredOrders.map((o) => getOrderFinancials(o, safePriceList, safeKanbanStages)),
    [monthFilteredOrders, safePriceList, safeKanbanStages],
  )

  const verifiedDisplayOrders = useMemo(() => {
    return displayOrders.map((order) => {
      const discount = order.dentistDiscount || 0
      const expectedTotal = order.unitPrice * order.quantity * (1 - discount / 100)

      const isCorrect = Math.abs((order.basePrice || 0) - expectedTotal) < 0.01

      if (!isCorrect) {
        console.warn(
          `[QA Validation] Order ${order.friendlyId} base price mismatch. Expected ${expectedTotal}, got ${order.basePrice}. Recalculating for display integrity.`,
        )
      }

      const finalBasePrice = isCorrect ? order.basePrice : expectedTotal

      const outstandingCost =
        order.status === 'completed' || order.status === 'delivered'
          ? Math.max(0, finalBasePrice - (order.clearedBalance || 0))
          : 0

      const pipelineCost =
        order.status !== 'completed' && order.status !== 'delivered' && order.status !== 'cancelled'
          ? finalBasePrice
          : 0

      return {
        ...order,
        basePrice: finalBasePrice,
        outstandingCost,
        pipelineCost,
        pendingCost: pipelineCost,
        totalCost: finalBasePrice,
      }
    })
  }, [displayOrders])

  useEffect(() => {
    let isMounted = true

    const fetchSettlements = async () => {
      const targetId = Visualizando_Como_ID || currentUser?.id
      if (!targetId) return

      try {
        setFetchError(null)

        let query = supabase
          .from('settlements')
          .select('*')
          .order('created_at', { ascending: false })

        if (effectiveRole === 'dentist' || effectiveRole === 'laboratory') {
          query = query.eq('dentist_id', targetId)
        }

        const { data, error } = await query

        if (!isMounted) return

        if (error) {
          console.error('Database error fetching settlements:', error)
          setFetchError('Não foi possível carregar o histórico no momento.')
          return
        }

        if (data) {
          setSettlements(data)
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Network or unexpected error fetching settlements:', err)
        setFetchError('Problema de conexão ao tentar carregar os dados.')
      }
    }

    fetchSettlements()

    return () => {
      isMounted = false
    }
  }, [currentUser?.id, effectiveRole, Visualizando_Como_ID])

  if (effectiveRole !== 'dentist' && effectiveRole !== 'laboratory') {
    if (['admin', 'master', 'receptionist'].includes(currentUser?.role || '')) {
      return <Navigate to="/admin-financial" replace />
    }
    return <Navigate to="/app" replace />
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in duration-500">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">
          Sincronizando seus dados financeiros...
        </p>
      </div>
    )
  }

  const concludedOrders = verifiedDisplayOrders.filter(
    (o) => o.status === 'completed' || o.status === 'delivered',
  )
  const pipelineOrders = verifiedDisplayOrders.filter(
    (o) => o.status === 'pending' || o.status === 'in_production',
  )

  const totalConcluded = concludedOrders.reduce((acc, o) => acc + (o.basePrice || 0), 0)
  const totalPipeline = pipelineOrders.reduce((acc, o) => acc + (o.basePrice || 0), 0)

  const handleExportCSV = (settlement: any) => {
    try {
      const snapshot = settlement.orders_snapshot || []
      let csv = 'Data da Liquidação,Paciente,Trabalho,Valor Cobrado\n'
      const date = new Date(settlement.created_at).toLocaleDateString('pt-BR')
      snapshot.forEach((s: any) => {
        csv += `"${date}","${s.patientName || ''}","${s.workType || ''}",${s.clearedAmount || 0}\n`
      })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Historico_Pagamento_${date}.csv`
      a.click()
    } catch (err) {
      console.error('Error exporting CSV:', err)
    }
  }

  const handlePrintPDF = () => {
    try {
      window.print()
    } catch (err) {
      console.error('Error printing PDF:', err)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in print:max-w-none print:m-0 print:p-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Dash Financeiro</h2>
            <p className="text-muted-foreground text-sm">
              Acompanhe seus custos pendentes, pipeline de produção e histórico de pagamentos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm">
          <CalendarDays className="w-4 h-4 text-muted-foreground ml-2" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] border-0 bg-transparent shadow-none focus:ring-0">
              <SelectValue placeholder="Selecione o Mês" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 print:hidden">
          <TabsTrigger value="overview">Visão Geral do Mês</TabsTrigger>
          <TabsTrigger value="history">Histórico de Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 print:hidden">
          <div className="grid gap-5 md:grid-cols-2 mb-8">
            <Card className="shadow-subtle border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Trabalhos Finalizados (
                  {monthOptions.find((m) => m.value === selectedMonth)?.label})
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {formatBRL(totalConcluded)}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-subtle border-l-4 border-l-amber-500">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Trabalhos em Produção (Pipeline)
                </CardTitle>
                <Activity className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{formatBRL(totalPipeline)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="concluded" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="concluded" className="gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Finalizados (
                {concludedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="gap-2">
                <Activity className="w-4 h-4 text-amber-500" /> Em Produção ({pipelineOrders.length}
                )
              </TabsTrigger>
            </TabsList>

            <TabsContent value="concluded">
              <Card className="shadow-subtle">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Pedido</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Trabalho</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead className="text-right pr-6">Valor Faturado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {concludedOrders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-12 text-muted-foreground"
                          >
                            Nenhum pedido finalizado neste período.
                          </TableCell>
                        </TableRow>
                      ) : (
                        concludedOrders.map((o) => (
                          <TableRow key={o.id} className="hover:bg-muted/30">
                            <TableCell className="pl-6 font-medium text-primary">
                              <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-2">
                                  <span>{o.friendlyId}</span>
                                  {o.isRepetition && (
                                    <Badge
                                      variant="destructive"
                                      className="text-[10px] uppercase px-1.5 py-0 h-4"
                                    >
                                      Repetição
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">{o.patientName}</TableCell>
                            <TableCell className="text-muted-foreground">{o.workType}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {format(new Date(o.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                            </TableCell>
                            <TableCell className="text-right pr-6 font-bold text-emerald-600">
                              {formatBRL(o.basePrice)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pipeline">
              <Card className="shadow-subtle">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Pedido</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Status (Laboratório)</TableHead>
                        <TableHead>Trabalho</TableHead>
                        <TableHead className="text-right pr-6">Valor Estimado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pipelineOrders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-12 text-muted-foreground"
                          >
                            Nenhum pedido em produção neste período.
                          </TableCell>
                        </TableRow>
                      ) : (
                        pipelineOrders.map((o) => (
                          <TableRow key={o.id} className="hover:bg-muted/30">
                            <TableCell className="pl-6 font-medium text-primary">
                              <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-2">
                                  <span>{o.friendlyId}</span>
                                  {o.isRepetition && (
                                    <Badge
                                      variant="destructive"
                                      className="text-[10px] uppercase px-1.5 py-0 h-4"
                                    >
                                      Repetição
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">{o.patientName}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-medium bg-muted">
                                {o.kanbanStage}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{o.workType}</TableCell>
                            <TableCell className="text-right pr-6 font-bold text-amber-600">
                              {formatBRL(o.basePrice)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
              Clínica: {currentUser?.clinic || currentUser?.name}
            </p>
            <p className="text-muted-foreground">
              Data da emissão: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {fetchError && (
            <Card className="border-destructive/50 bg-destructive/5 mb-4 print:hidden">
              <CardContent className="py-4 flex items-center gap-3 text-destructive">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{fetchError}</p>
              </CardContent>
            </Card>
          )}

          {!fetchError && settlements.length === 0 ? (
            <Card className="print:hidden border-dashed bg-muted/20">
              <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <History className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium text-lg">Nenhuma liquidação no histórico</p>
                <p className="text-sm mt-1 text-center">
                  Os pagamentos concluídos junto ao laboratório aparecerão arquivados nesta seção.
                </p>
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
                        {formatBRL(settlement.amount || 0)}
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
                    <Table>
                      <TableHeader className="bg-muted/10 print:bg-transparent">
                        <TableRow className="border-b print:border-gray-300">
                          <TableHead className="py-3 px-4 font-medium text-muted-foreground print:text-black print:px-0">
                            Paciente / OS
                          </TableHead>
                          <TableHead className="py-3 px-4 font-medium text-muted-foreground print:text-black print:px-0">
                            Trabalho
                          </TableHead>
                          <TableHead className="py-3 px-4 text-right font-medium text-muted-foreground print:text-black print:px-0">
                            Valor Cobrado
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(settlement.orders_snapshot || []).map((s: any, idx: number) => (
                          <TableRow
                            key={idx}
                            className="border-b last:border-0 hover:bg-muted/5 print:border-b print:border-gray-200"
                          >
                            <TableCell className="py-3 px-4 print:px-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground block">
                                  {s.patientName || 'N/A'}
                                </span>
                                {s.isRepetition && (
                                  <Badge
                                    variant="destructive"
                                    className="text-[10px] uppercase px-1.5 py-0 h-4 print:border print:border-red-500 print:text-red-500 print:bg-transparent"
                                  >
                                    Repetição
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {s.friendlyId || '-'}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-muted-foreground print:px-0">
                              {s.workType || 'N/A'}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-right font-medium print:px-0">
                              {formatBRL(s.clearedAmount || 0)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
