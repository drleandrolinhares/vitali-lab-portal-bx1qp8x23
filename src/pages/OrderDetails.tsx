import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/StatusBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Calendar,
  FileText,
  Activity,
  Clock,
  ArrowRight,
  Circle,
  DollarSign,
  Users,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn, processOrderHistory } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { OrderHistory } from '@/lib/types'
import { formatBRL } from '@/lib/financial'
import { toast } from '@/hooks/use-toast'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, kanbanStages, currentUser } = useAppStore()

  const order = orders.find((o) => o.id === id)

  const [historyItems, setHistoryItems] = useState<(OrderHistory & { createdByName?: string })[]>(
    [],
  )
  const [cadistaId, setCadistaId] = useState<string>('none')
  const [maquiagemId, setMaquiagemId] = useState<string>('none')
  const [acabamentoId, setAcabamentoId] = useState<string>('none')
  const [cadistas, setCadistas] = useState<any[]>([])
  const [colaboradores, setColaboradores] = useState<any[]>([])
  const [isLoadingProduction, setIsLoadingProduction] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [additionalCostDesc, setAdditionalCostDesc] = useState('')
  const [additionalCostValue, setAdditionalCostValue] = useState('')
  const [isSavingCost, setIsSavingCost] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (order && !isDirty) {
      setAdditionalCostDesc(order.custo_adicional_descricao || '')
      setAdditionalCostValue(order.custo_adicional_valor?.toString() || '')
    }
  }, [order?.custo_adicional_descricao, order?.custo_adicional_valor, isDirty])

  const fetchHistory = async () => {
    if (!order?.id) return
    const { data, error } = await supabase
      .from('order_history')
      .select('*, created_by_profile:profiles(name)')
      .eq('order_id', order.id)
      .order('created_at', { ascending: true })

    if (data && !error) {
      setHistoryItems(
        data.map((h: any) => ({
          id: h.id,
          status: h.status,
          date: h.created_at,
          note: h.note,
          createdByName:
            h.created_by_profile?.name ||
            (Array.isArray(h.created_by_profile) ? h.created_by_profile[0]?.name : undefined),
        })),
      )
    } else {
      setHistoryItems(order.history || [])
    }
  }

  useEffect(() => {
    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id, order?.history])

  useEffect(() => {
    const fetchProductionData = async () => {
      if (!order?.id) return
      setIsLoadingProduction(true)
      const { data } = await supabase
        .from('orders')
        .select('cadista_id, maquiagem_id, acabamento_id')
        .eq('id', order.id)
        .single()
      if (data) {
        setCadistaId(data.cadista_id || 'none')
        setMaquiagemId(data.maquiagem_id || 'none')
        setAcabamentoId(data.acabamento_id || 'none')
      }

      const { data: cadData } = await supabase.from('cadistas').select('*').eq('is_active', true)
      if (cadData) setCadistas(cadData)

      const { data: colabData } = await supabase
        .from('profiles')
        .select('id, name, role, permissions')
        .in('role', [
          'admin',
          'master',
          'receptionist',
          'technical_assistant',
          'financial',
          'relationship_manager',
        ])
        .eq('is_active', true)
      if (colabData) setColaboradores(colabData)
      setIsLoadingProduction(false)
    }
    fetchProductionData()
  }, [order?.id])

  const handleUpdateProduction = async (field: string, value: string) => {
    if (!order?.id) return
    const val = value === 'none' ? null : value
    const { error } = await supabase
      .from('orders')
      .update({ [field]: val })
      .eq('id', order.id)
    if (error) {
      toast({ title: 'Erro ao atualizar produção', variant: 'destructive' })
    } else {
      toast({ title: 'Produção atualizada!' })
      if (field === 'cadista_id') setCadistaId(value)
      if (field === 'maquiagem_id') setMaquiagemId(value)
      if (field === 'acabamento_id') setAcabamentoId(value)
    }
  }

  const isInternalUser = currentUser?.role !== 'dentist'

  const handleAddNote = async () => {
    if (!newNote.trim() || !order) return
    setIsAddingNote(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { error } = await supabase.from('order_history').insert({
        order_id: order.id,
        status: 'NOTA_MANUAL',
        note: newNote.trim(),
        created_by: user?.id,
      } as any)

      if (error) throw error

      toast({ title: 'Anotação adicionada com sucesso!' })
      setNewNote('')
      fetchHistory()
    } catch (error) {
      toast({ title: 'Erro ao adicionar anotação', variant: 'destructive' })
    } finally {
      setIsAddingNote(false)
    }
  }

  const actualHistory = historyItems.length > 0 ? historyItems : order?.history || []
  const systemHistory = actualHistory.filter((h) => h.status !== 'NOTA_MANUAL')
  const processedSystemHistory = order
    ? processOrderHistory(systemHistory, kanbanStages, order.kanbanStage)
    : []

  const manualNotes = actualHistory
    .filter((h) => h.status === 'NOTA_MANUAL')
    .map((h) => ({
      id: h.id,
      stageName: `Anotação de ${h.createdByName || 'Usuário'}`,
      date: h.date,
      durationStr: '-',
      note: h.note,
      isCurrent: false,
      direction: 'none' as const,
      isManual: true,
    }))

  const combinedHistory = [...processedSystemHistory, ...manualNotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const additionalCostNum = parseFloat(additionalCostValue) || 0

  const handleSaveAdditionalCost = async () => {
    if (!order) return
    setIsSavingCost(true)
    const val = additionalCostNum
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          custo_adicional_descricao: additionalCostDesc,
          custo_adicional_valor: val,
        })
        .eq('id', order.id)

      if (error) throw error

      order.custo_adicional_descricao = additionalCostDesc
      order.custo_adicional_valor = val
      setIsDirty(false)
      toast({ title: 'Custo adicional salvo com sucesso!' })
    } catch (error) {
      toast({ title: 'Erro ao salvar custo adicional', variant: 'destructive' })
    } finally {
      setIsSavingCost(false)
    }
  }

  useEffect(() => {
    if (!order || !isDirty) return

    const timer = setTimeout(() => {
      handleSaveAdditionalCost()
    }, 2000)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [additionalCostDesc, additionalCostValue, isDirty])

  if (!order) return <div className="p-8 text-center">Pedido não encontrado.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pedido {order.friendlyId}</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            Criado em {format(new Date(order.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={order.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-subtle h-fit overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Detalhes Clínicos
              </CardTitle>
              <div
                className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 shrink-0 select-none"
                title="Código de Barras do Pedido"
              >
                <img
                  src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${order.friendlyId}&scale=2&height=10&includetext=false`}
                  alt={`Barcode ${order.friendlyId}`}
                  className="h-9 object-contain dark:invert mix-blend-multiply"
                  draggable={false}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p className="font-medium text-lg">{order.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dentista Responsável</p>
                  <p className="font-medium">{order.dentistName}</p>
                </div>

                {order.patientCpf && (
                  <div>
                    <p className="text-sm text-muted-foreground">CPF do Paciente</p>
                    <p className="font-medium">{order.patientCpf}</p>
                  </div>
                )}
                {order.patientBirthDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">
                      {format(new Date(order.patientBirthDate + 'T00:00:00'), 'dd/MM/yyyy')}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Trabalho</p>
                  <p className="font-medium">{order.workType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Material</p>
                  <p className="font-medium">{order.material}</p>
                </div>

                {order.implantBrand && (
                  <div>
                    <p className="text-sm text-muted-foreground text-blue-600 dark:text-blue-400 font-semibold">
                      Marca do Implante
                    </p>
                    <p className="font-medium">{order.implantBrand}</p>
                  </div>
                )}
                {order.implantType && (
                  <div>
                    <p className="text-sm text-muted-foreground text-blue-600 dark:text-blue-400 font-semibold">
                      Tipo do Componente
                    </p>
                    <p className="font-medium">{order.implantType}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Cor</p>
                  <p className="font-medium">{order.shade || 'Não especificada'}</p>
                </div>
                {order.shadeScale && (
                  <div>
                    <p className="text-sm text-muted-foreground">Escala</p>
                    <p className="font-medium">{order.shadeScale}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Origem do Pedido</p>
                  <p className="font-medium">
                    {order.createdBy &&
                    ['admin', 'master', 'receptionist'].includes(order.createdBy.role)
                      ? `Registrado por: ${order.createdBy.name}`
                      : `Enviado por: ${order.createdBy?.name || order.dentistName}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Logística de Envio</p>
                  <p className="font-medium">
                    {order.shippingMethod === 'lab_pickup'
                      ? 'Motoboy Laboratório'
                      : 'Responsabilidade do Dentista'}
                  </p>
                </div>

                {order.stlDeliveryMethod && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Detalhes do Envio</p>
                    <p className="font-medium">{order.stlDeliveryMethod}</p>
                  </div>
                )}
              </div>
              {(order.teeth.length > 0 || (order.arches && order.arches.length > 0)) && (
                <div className="bg-muted/30 p-4 rounded-md border">
                  <p className="text-sm text-muted-foreground mb-2">Elementos Envolvidos</p>
                  <div className="flex flex-wrap gap-2">
                    {order.arches?.map((a: string) => (
                      <span
                        key={a}
                        className="bg-primary/10 text-primary px-2 py-1 rounded font-semibold text-sm border border-primary/20"
                      >
                        {a}
                      </span>
                    ))}
                    {order.teeth.map((t: string) => (
                      <span
                        key={t}
                        className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm border border-primary/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {order.observations && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md italic border-l-4 border-l-primary whitespace-pre-wrap">
                    {order.observations}
                  </p>
                </div>
              )}

              <div className="pt-4 mt-6 border-t border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Custo Adicional</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="add-cost-desc" className="text-xs">
                      Descrição do Custo
                    </Label>
                    <input
                      id="add-cost-desc"
                      type="text"
                      placeholder="Ex: Material extra"
                      value={additionalCostDesc}
                      onChange={(e) => {
                        setAdditionalCostDesc(e.target.value)
                        setIsDirty(true)
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="add-cost-val" className="text-xs">
                      Valor
                    </Label>
                    <input
                      id="add-cost-val"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={additionalCostValue}
                      onChange={(e) => {
                        setAdditionalCostValue(e.target.value)
                        setIsDirty(true)
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveAdditionalCost}
                    disabled={isSavingCost || !isDirty}
                    className="h-8 text-xs"
                  >
                    {isSavingCost ? 'Salvando...' : 'Salvar Custo Adicional'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isInternalUser && (
            <Card className="shadow-subtle h-fit overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Produção Interna
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cadista</Label>
                    <Select
                      value={cadistaId}
                      onValueChange={(val) => handleUpdateProduction('cadista_id', val)}
                      disabled={isLoadingProduction}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Não atribuído</SelectItem>
                        {cadistas.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Maquiagem</Label>
                    <Select
                      value={maquiagemId}
                      onValueChange={(val) => handleUpdateProduction('maquiagem_id', val)}
                      disabled={isLoadingProduction}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Não atribuído</SelectItem>
                        {colaboradores
                          .filter((c) => c.permissions?.can_do_maquiagem || c.id === maquiagemId)
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Acabamento</Label>
                    <Select
                      value={acabamentoId}
                      onValueChange={(val) => handleUpdateProduction('acabamento_id', val)}
                      disabled={isLoadingProduction}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Não atribuído</SelectItem>
                        {colaboradores
                          .filter((c) => c.permissions?.can_do_acabamento || c.id === acabamentoId)
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-subtle h-fit border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Valor Unitário</span>
                <span className="font-medium">{formatBRL(order.unitPrice || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Quantidade (Elementos)</span>
                <span className="font-medium">{order.quantity || 1}</span>
              </div>
              {(order.dentistDiscount || 0) > 0 && (
                <div className="flex justify-between items-center text-sm text-emerald-600">
                  <span>Desconto Acordo Comercial</span>
                  <span className="font-medium">-{order.dentistDiscount}%</span>
                </div>
              )}
              {additionalCostNum > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Custo Adicional</span>
                  <span className="font-medium">{formatBRL(additionalCostNum)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t font-semibold">
                <span>Total do Pedido</span>
                <span className="text-primary">
                  {formatBRL(order.basePrice + additionalCostNum)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-subtle h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Histórico de Etapas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="new-note" className="text-xs font-medium">
                  Adicionar Anotação
                </Label>
                <textarea
                  id="new-note"
                  placeholder="Ex: Liguei para o dentista para informar que..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={isAddingNote || !newNote.trim()}
                  >
                    {isAddingNote ? 'Adicionando...' : 'Adicionar Evento'}
                  </Button>
                </div>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-px before:bg-border">
                {combinedHistory.map((item) => (
                  <div key={item.id} className="relative flex items-start gap-4">
                    <div
                      className={cn(
                        'absolute left-0 mt-0.5 w-6 h-6 rounded-full ring-4 ring-background z-10 flex items-center justify-center border',
                        item.isCurrent
                          ? 'bg-primary text-primary-foreground border-primary'
                          : (item as any).isManual
                            ? 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                            : 'bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {(item as any).isManual ? (
                        <FileText className="w-3 h-3" />
                      ) : item.direction === 'backward' ? (
                        <ArrowLeft className="w-3.5 h-3.5" />
                      ) : item.direction === 'forward' ? (
                        <ArrowRight className="w-3.5 h-3.5" />
                      ) : (
                        <Circle className="w-2.5 h-2.5 fill-current" />
                      )}
                    </div>
                    <div className="ml-10 w-full space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium leading-none">{item.stageName}</p>
                          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(item.date), "dd/MM 'às' HH:mm")}
                          </p>
                        </div>
                        {!(item as any).isManual && (
                          <div className="flex items-center gap-1.5 text-xs font-medium bg-muted/40 px-2 py-1 rounded-md text-muted-foreground whitespace-nowrap border border-border/50">
                            <Clock className="w-3 h-3" />
                            {item.durationStr}
                          </div>
                        )}
                      </div>
                      {item.note && !item.note.startsWith('Movido para') && (
                        <p
                          className={cn(
                            'text-xs mt-2 p-2 rounded-md border',
                            (item as any).isManual
                              ? 'bg-amber-50/50 text-amber-900 border-amber-100 dark:bg-amber-900/10 dark:text-amber-200 dark:border-amber-900/30'
                              : 'text-muted-foreground bg-muted/30 border-border/40',
                          )}
                        >
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
