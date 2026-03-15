import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatCurrency, cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Loader2, Search, CheckCircle, Activity, FileText, UserCircle, Receipt } from 'lucide-react'
import { InvoicePreviewDialog } from '@/components/financial/InvoicePreviewDialog'
import { CreateInstallmentDialog } from '@/components/financial/CreateInstallmentDialog'

interface Order {
  id: string
  friendly_id: string
  patient_name: string
  work_type: string
  base_price: number
  status: string
  kanban_stage: string
  created_at: string
}

interface DentistData {
  id: string
  name: string
  clinic: string
  completed: Order[]
  pipeline: Order[]
  unbilledTotal: number
  pipelineTotal: number
}

export default function AdminFinancial() {
  const [loading, setLoading] = useState(true)
  const [dentistsData, setDentistsData] = useState<Map<string, DentistData>>(new Map())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [installmentOpen, setInstallmentOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, clinic')
        .eq('role', 'dentist')

      const { data: orders } = await supabase
        .from('orders')
        .select(
          'id, friendly_id, patient_name, work_type, base_price, status, kanban_stage, created_at, dentist_id',
        )
        .is('settlement_id', null)

      const map = new Map<string, DentistData>()

      profiles?.forEach((p) => {
        map.set(p.id, {
          id: p.id,
          name: p.name,
          clinic: p.clinic || 'Sem clínica vinculada',
          completed: [],
          pipeline: [],
          unbilledTotal: 0,
          pipelineTotal: 0,
        })
      })

      orders?.forEach((o) => {
        if (!o.dentist_id) return
        const d = map.get(o.dentist_id)
        if (!d) return

        const price = o.base_price || 0

        if (o.status === 'completed' || o.status === 'delivered') {
          d.completed.push(o)
          d.unbilledTotal += price
        } else if (o.status !== 'cancelled') {
          d.pipeline.push(o)
          d.pipelineTotal += price
        }
      })

      // Keep only dentists with active or completed works
      const activeMap = new Map<string, DentistData>()
      for (const [id, data] of map.entries()) {
        if (data.completed.length > 0 || data.pipeline.length > 0) {
          activeMap.set(id, data)
        }
      }

      setDentistsData(activeMap)
    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredDentists = useMemo(() => {
    return Array.from(dentistsData.values())
      .filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.clinic.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => b.unbilledTotal - a.unbilledTotal)
  }, [dentistsData, search])

  const selected = selectedId ? dentistsData.get(selectedId) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[1600px] flex flex-col gap-6 animate-in fade-in duration-500 lg:h-[calc(100vh-6rem)]">
      <div className="flex-none">
        <h1 className="text-3xl font-bold tracking-tight">Painel Financeiro</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie o faturamento pendente e acompanhe o pipeline de produção por dentista.
        </p>
      </div>

      <Tabs defaultValue="receber" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit flex-none">
          <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
        </TabsList>

        <TabsContent
          value="receber"
          className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden mt-4"
        >
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Sidebar: Dentist Selection */}
            <Card className="w-full lg:w-[350px] flex flex-col flex-none shadow-sm border-slate-200 overflow-hidden lg:max-h-full">
              <div className="p-4 border-b bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar dentista ou clínica..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1 bg-white">
                <div className="p-2 space-y-1">
                  {filteredDentists.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Nenhum dentista encontrado.
                    </div>
                  ) : (
                    filteredDentists.map((dentist) => (
                      <button
                        key={dentist.id}
                        onClick={() => setSelectedId(dentist.id)}
                        className={cn(
                          'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group',
                          selectedId === dentist.id
                            ? 'bg-primary/5 border border-primary/20 shadow-sm'
                            : 'hover:bg-slate-50 border border-transparent',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                'font-semibold truncate text-sm',
                                selectedId === dentist.id ? 'text-primary' : 'text-slate-900',
                              )}
                            >
                              {dentist.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {dentist.clinic}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {dentist.unbilledTotal > 0 && (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-200">
                                {formatCurrency(dentist.unbilledTotal)}
                              </span>
                            )}
                            {dentist.pipeline.length > 0 && (
                              <span className="text-[10px] font-medium text-slate-500">
                                {dentist.pipeline.length} em prod.
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* Main Content: Dashboards */}
            <div className="flex-1 flex flex-col min-h-0">
              {selected ? (
                <div className="flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* Header Actions */}
                  <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white flex-none">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <UserCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                        <p className="text-sm text-slate-500 font-medium">{selected.clinic}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        className="bg-white shadow-sm"
                        onClick={() => setPreviewOpen(true)}
                        disabled={selected.completed.length === 0}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Prévia
                      </Button>
                      <Button
                        onClick={() => setInstallmentOpen(true)}
                        disabled={selected.completed.length === 0}
                        className="shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Faturar Selecionado
                      </Button>
                    </div>
                  </div>

                  {/* Side-by-Side Boards */}
                  <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
                    {/* Completed Works */}
                    <Card className="flex flex-col min-h-0 shadow-sm border-emerald-100 overflow-hidden">
                      <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50 flex-none">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Receipt className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-emerald-900">Trabalhos Concluídos</h3>
                            <p className="text-xs text-emerald-700 font-medium">
                              Prontos para faturamento
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-emerald-700 text-lg block leading-tight">
                            {formatCurrency(selected.unbilledTotal)}
                          </span>
                          <span className="text-xs text-emerald-600 font-medium">
                            {selected.completed.length} pedidos
                          </span>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 bg-white">
                        {selected.completed.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                            Nenhum trabalho aguardando faturamento.
                          </div>
                        ) : (
                          <Table>
                            <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                              <TableRow className="hover:bg-transparent border-emerald-100">
                                <TableHead className="w-[100px] text-emerald-800">Data</TableHead>
                                <TableHead className="text-emerald-800">Pedido</TableHead>
                                <TableHead className="text-emerald-800">Serviço</TableHead>
                                <TableHead className="text-right text-emerald-800">Valor</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selected.completed.map((order) => (
                                <TableRow key={order.id} className="text-sm hover:bg-emerald-50/30">
                                  <TableCell className="text-muted-foreground">
                                    {format(new Date(order.created_at), 'dd/MM')}
                                  </TableCell>
                                  <TableCell className="font-medium text-slate-900">
                                    {order.friendly_id}
                                  </TableCell>
                                  <TableCell className="truncate max-w-[120px] text-slate-600">
                                    {order.work_type}
                                  </TableCell>
                                  <TableCell className="text-right font-medium text-slate-900">
                                    {formatCurrency(order.base_price)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </ScrollArea>
                    </Card>

                    {/* Pipeline */}
                    <Card className="flex flex-col min-h-0 shadow-sm border-blue-100 overflow-hidden">
                      <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/50 flex-none">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-blue-900">Pipeline de Produção</h3>
                            <p className="text-xs text-blue-700 font-medium">
                              Em andamento no laboratório
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-blue-700 text-lg block leading-tight">
                            {formatCurrency(selected.pipelineTotal)}
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            {selected.pipeline.length} pedidos
                          </span>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 bg-white">
                        {selected.pipeline.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                            Nenhum trabalho em produção no momento.
                          </div>
                        ) : (
                          <Table>
                            <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                              <TableRow className="hover:bg-transparent border-blue-100">
                                <TableHead className="text-blue-800">Pedido</TableHead>
                                <TableHead className="text-blue-800">Paciente</TableHead>
                                <TableHead className="text-blue-800">Fase Atual</TableHead>
                                <TableHead className="text-right text-blue-800">
                                  Estimativa
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selected.pipeline.map((order) => (
                                <TableRow key={order.id} className="text-sm hover:bg-blue-50/30">
                                  <TableCell className="font-medium text-slate-900">
                                    {order.friendly_id}
                                  </TableCell>
                                  <TableCell className="truncate max-w-[100px] uppercase text-xs text-slate-600">
                                    {order.patient_name}
                                  </TableCell>
                                  <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap">
                                      {order.kanban_stage}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right text-muted-foreground font-medium">
                                    {formatCurrency(order.base_price)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </ScrollArea>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8 bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <Search className="h-10 w-10 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Nenhum dentista selecionado
                    </h3>
                    <p className="text-slate-500 max-w-sm mt-1">
                      Selecione um dentista na lista ao lado para visualizar os trabalhos concluídos
                      e o pipeline em andamento.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faturamento" className="flex-1 m-0 data-[state=inactive]:hidden mt-4">
          <Card className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground border-dashed">
            Módulo de Faturamento
          </Card>
        </TabsContent>

        <TabsContent value="pagar" className="flex-1 m-0 data-[state=inactive]:hidden mt-4">
          <Card className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground border-dashed">
            Módulo de Contas a Pagar
          </Card>
        </TabsContent>
      </Tabs>

      {selected && (
        <>
          <InvoicePreviewDialog
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            dentistName={selected.name}
            clinicName={selected.clinic}
            orders={selected.completed}
            totalAmount={selected.unbilledTotal}
          />
          <CreateInstallmentDialog
            open={installmentOpen}
            onOpenChange={setInstallmentOpen}
            dentistId={selected.id}
            orders={selected.completed}
            totalAmount={selected.unbilledTotal}
            onSuccess={() => {
              setInstallmentOpen(false)
              fetchData()
            }}
          />
        </>
      )}
    </div>
  )
}
