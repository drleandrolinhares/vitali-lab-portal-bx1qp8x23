import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Stage, Order } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/StatusBadge'
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  GripHorizontal,
  Info,
  CheckCircle2,
  Paperclip,
  ExternalLink,
  QrCode,
  RefreshCw,
  Tags,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { OrderDetailsSheet } from '@/components/OrderDetailsSheet'
import { KanbanCardTimer } from '@/components/KanbanCardTimer'
import { MiniGuideDialog } from '@/components/MiniGuideDialog'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { formatBRL } from '@/lib/financial'

export default function KanbanPage() {
  const {
    orders,
    currentUser,
    effectiveRole,
    updateOrderKanbanStage,
    updateOrderSector,
    updateOrderObservations,
    kanbanStages,
    addKanbanStage,
    updateKanbanStage,
    updateKanbanStageDescription,
    deleteKanbanStage,
    reorderKanbanStages,
    checkPermission,
    fetchError: storeFetchError,
    selectedLab,
    setSelectedLab,
  } = useAppStore()

  const navigate = useNavigate()
  const isAdmin = effectiveRole === 'admin' || effectiveRole === 'master'
  const isMaster = effectiveRole === 'master'
  const isDentist = effectiveRole === 'dentist' || effectiveRole === 'laboratory'

  const availableSectors =
    currentUser?.allowed_sectors && currentUser.allowed_sectors.length > 0
      ? currentUser.allowed_sectors
      : ['SOLUÇÕES CERÂMICAS', 'STÚDIO ACRÍLICO']

  useEffect(() => {
    if (
      selectedLab !== 'TODOS' &&
      selectedLab !== 'Todos' &&
      !availableSectors.includes((selectedLab || '').toUpperCase())
    ) {
      setSelectedLab(availableSectors[0])
    }
  }, [availableSectors, selectedLab, setSelectedLab])

  const activeLab = availableSectors.includes((selectedLab || '').toUpperCase())
    ? (selectedLab || '').toUpperCase()
    : availableSectors[0]

  const activeStages = useMemo(() => {
    const filtered = kanbanStages
      .filter((s) => (s.sector || 'SOLUÇÕES CERÂMICAS').toUpperCase() === activeLab)
      .sort((a, b) => a.orderIndex - b.orderIndex)

    const finalizados = filtered.filter(
      (s) =>
        s.name.toUpperCase().includes('FINALIZADO') || s.name.toUpperCase().includes('ENTREGUE'),
    )
    const prontos = filtered.filter(
      (s) => s.name.toUpperCase().includes('PRONTO') && s.name.toUpperCase().includes('ENVIO'),
    )
    const others = filtered.filter((s) => !finalizados.includes(s) && !prontos.includes(s))

    return [...others, ...prontos, ...finalizados]
  }, [kanbanStages, activeLab])

  const canDragCards =
    !isDentist &&
    ([
      'admin',
      'master',
      'receptionist',
      'technical_assistant',
      'financial',
      'relationship_manager',
    ].includes(effectiveRole || '') ||
      checkPermission('kanban', 'move_cards'))

  const canFilterDentist = checkPermission('kanban', 'filter_dentist')
  const showDentistFilter = !isDentist && canFilterDentist
  const canCreateOrder = checkPermission('inbox', 'create_order') || isDentist

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedDentistId = searchParams.get('dentist') || 'all'
  const selectedWorkType = searchParams.get('workType') || 'all'
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

  const debouncedSearchTerm = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!debouncedSearchTerm) {
        if (searchParams.get('q')) {
          searchParams.delete('q')
          setSearchParams(searchParams, { replace: true })
        }
      } else {
        if (searchParams.get('q') !== debouncedSearchTerm) {
          searchParams.set('q', debouncedSearchTerm)
          setSearchParams(searchParams, { replace: true })
        }
      }
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [debouncedSearchTerm, searchParams, setSearchParams])

  const setSelectedDentistId = (val: string) => {
    if (val === 'all') {
      searchParams.delete('dentist')
    } else {
      searchParams.set('dentist', val)
    }
    setSearchParams(searchParams, { replace: true })
  }

  const setSelectedWorkType = (val: string) => {
    if (val === 'all') {
      searchParams.delete('workType')
    } else {
      searchParams.set('workType', val)
    }
    setSearchParams(searchParams, { replace: true })
  }

  const availableWorkTypes = useMemo(() => {
    const types = new Set<string>()
    orders.forEach((o) => {
      if ((o.sector || 'SOLUÇÕES CERÂMICAS').toUpperCase() === activeLab) {
        if (o.workType) types.add(o.workType)
      }
    })
    return Array.from(types).sort()
  }, [orders, activeLab])

  useEffect(() => {
    if (selectedWorkType !== 'all' && !availableWorkTypes.includes(selectedWorkType)) {
      if (searchParams.get('workType')) {
        searchParams.delete('workType')
        setSearchParams(searchParams, { replace: true })
      }
    }
  }, [availableWorkTypes, selectedWorkType, searchParams, setSearchParams])

  const [dentistsList, setDentistsList] = useState<{ id: string; name: string }[]>([])
  const [isLoadingDentists, setIsLoadingDentists] = useState(false)
  const [dentistFetchError, setDentistFetchError] = useState<string | null>(null)

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId],
  )
  const [obsText, setObsText] = useState('')

  const [editingStageId, setEditingStageId] = useState<string | null>(null)
  const [editStageName, setEditStageName] = useState('')

  const [editingDescStage, setEditingDescStage] = useState<Stage | null>(null)
  const [editDescText, setEditDescText] = useState('')

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')
  const [deleteStageData, setDeleteStageData] = useState<Stage | null>(null)
  const [fallbackStageName, setFallbackStageName] = useState<string>('')

  const [draggedStageId, setDraggedStageId] = useState<string | null>(null)
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null)

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)
  const [draggedCardSector, setDraggedCardSector] = useState<string | null>(null)

  const [finishingOrderId, setFinishingOrderId] = useState<string | null>(null)
  const [expandedCols, setExpandedCols] = useState<Set<string>>(new Set())

  const [selectedPrintQrOrder, setSelectedPrintQrOrder] = useState<Order | null>(null)
  const [selectedFullQrOrder, setSelectedFullQrOrder] = useState<Order | null>(null)

  const [cadistas, setCadistas] = useState<any[]>([])
  const [cadistaServices, setCadistaServices] = useState<any[]>([])
  const [cadistaAssignments, setCadistaAssignments] = useState<Record<string, any>>({})

  const savingRef = useRef(false)

  const fetchDentists = async () => {
    setIsLoadingDentists(true)
    setDentistFetchError(null)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .in('role', ['dentist', 'laboratory'])
        .eq('is_active', true)
        .eq('is_approved', true)
        .order('name')

      if (error) throw error
      if (data) {
        setDentistsList(data)
      }
    } catch (err: any) {
      console.error('Error fetching dentists:', err)
      setDentistFetchError('Erro ao carregar dentistas.')
    } finally {
      setIsLoadingDentists(false)
    }
  }

  useEffect(() => {
    if (showDentistFilter && currentUser) {
      fetchDentists()
    }
  }, [showDentistFilter, currentUser])

  useEffect(() => {
    if (selectedOrder) setObsText(selectedOrder.observations || '')
  }, [selectedOrder])

  useEffect(() => {
    if (!isDentist) {
      supabase
        .from('cadistas' as any)
        .select('*')
        .eq('is_active', true)
        .then(({ data }) => data && setCadistas(data))
      supabase
        .from('cadista_services' as any)
        .select('*')
        .eq('is_active', true)
        .then(({ data }) => data && setCadistaServices(data))
    }
  }, [isDentist])

  const orderIdsString = orders
    .map((o) => o.id)
    .sort()
    .join(',')
  useEffect(() => {
    if (!isDentist && orderIdsString) {
      supabase
        .from('orders' as any)
        .select('id, cadista_id, cadista_service_id, cadista_price')
        .in('id', orderIdsString.split(','))
        .then(({ data }) => {
          if (data) {
            setCadistaAssignments((prev) => {
              const map = { ...prev }
              data.forEach((row: any) => (map[row.id] = row))
              return map
            })
          }
        })
    }
  }, [orderIdsString, isDentist])

  const handleUpdateCadista = async (orderId: string, cadistaId: string | null) => {
    setCadistaAssignments((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        cadista_id: cadistaId,
        cadista_service_id: null,
        cadista_price: null,
      },
    }))
    await supabase
      .from('orders' as any)
      .update({
        cadista_id: cadistaId,
        cadista_service_id: null,
        cadista_price: null,
      })
      .eq('id', orderId)
  }

  const handleUpdateCadistaService = async (
    orderId: string,
    cadistaId: string,
    serviceId: string | null,
  ) => {
    const service = cadistaServices.find((s) => s.id === serviceId)
    const price = service ? service.price : null

    setCadistaAssignments((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], cadista_service_id: serviceId, cadista_price: price },
    }))
    await supabase
      .from('orders' as any)
      .update({
        cadista_service_id: serviceId,
        cadista_price: price,
      })
      .eq('id', orderId)
  }

  const visibleOrders = useMemo(() => {
    let filtered = orders
    if (!isDentist && canFilterDentist && selectedDentistId !== 'all') {
      filtered = filtered.filter((o) => o.dentistId === selectedDentistId)
    }
    if (selectedWorkType !== 'all') {
      filtered = filtered.filter((o) => o.workType === selectedWorkType)
    }
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.patientName?.toLowerCase().includes(debouncedSearchTerm) ||
          o.dentistName?.toLowerCase().includes(debouncedSearchTerm) ||
          o.friendlyId?.toLowerCase().includes(debouncedSearchTerm),
      )
    }
    return filtered
  }, [
    orders,
    isDentist,
    selectedDentistId,
    canFilterDentist,
    selectedWorkType,
    debouncedSearchTerm,
  ])

  const hasOrders = useMemo(
    () =>
      deleteStageData
        ? orders.some(
            (o) =>
              (o.sector || '').toUpperCase() === activeLab &&
              o.kanbanStage === deleteStageData.name,
          )
        : false,
    [deleteStageData, orders, activeLab],
  )

  const handleColumnDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isMaster) return
    const dragId = e.dataTransfer.getData('column-id')
    if (dragId && dragId !== targetStageId) {
      const oldIndex = activeStages.findIndex((s) => s.id === dragId)
      const newIndex = activeStages.findIndex((s) => s.id === targetStageId)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newStages = [...activeStages]
        const [moved] = newStages.splice(oldIndex, 1)
        newStages.splice(newIndex, 0, moved)
        reorderKanbanStages(
          newStages.map((s, idx) => ({ ...s, orderIndex: idx + 1 })),
          activeLab,
        )
      }
    }
  }

  const handleDrop = (e: React.DragEvent, stage: string, sector: string) => {
    e.preventDefault()
    if (!canDragCards) return
    const cardId = e.dataTransfer.getData('card-id') || e.dataTransfer.getData('text/plain')
    if (cardId) {
      const o = orders.find((x) => x.id === cardId)
      if (o && (o.sector || '').toUpperCase() === sector.toUpperCase() && o.kanbanStage !== stage) {
        updateOrderKanbanStage(cardId, stage)
      }
    }
    setDraggedCardId(null)
    setDraggedCardSector(null)
    setDragOverStageId(null)
  }

  const handleSaveStageName = async (id: string, oldName: string) => {
    if (savingRef.current) return
    const trimmed = editStageName.trim()
    if (!trimmed || trimmed.toUpperCase() === oldName.toUpperCase()) return setEditingStageId(null)

    savingRef.current = true
    try {
      await updateKanbanStage(id, oldName, trimmed, activeLab)
    } catch (e) {
      console.error(e)
    } finally {
      setEditingStageId(null)
      savingRef.current = false
    }
  }

  const handleSaveDesc = async () => {
    if (editingDescStage) {
      await updateKanbanStageDescription(editingDescStage.id, editDescText.trim())
      setEditingDescStage(null)
    }
  }

  const handleSaveObs = () => {
    if (selectedOrder) updateOrderObservations(selectedOrder.id, obsText)
  }

  const handleQuickFinish = async (orderId: string) => {
    setFinishingOrderId(orderId)
    try {
      let targetStageName = 'FINALIZADOS E ENTREGUES'
      const existingExact = activeStages.find((s) => s.name.toUpperCase() === targetStageName)

      if (!existingExact) {
        const fallback = activeStages.find(
          (s) =>
            s.name.toUpperCase().includes('FINALIZADO') ||
            s.name.toUpperCase().includes('ENTREGUE'),
        )
        if (fallback) {
          targetStageName = fallback.name
        } else {
          await addKanbanStage(targetStageName, activeLab)
        }
      }

      await updateOrderKanbanStage(orderId, targetStageName)
      toast({ title: 'Pedido Finalizado!', description: `Trabalho movido para ${targetStageName}` })
    } finally {
      setFinishingOrderId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden flex flex-col h-[calc(100vh-6rem)] bg-white dark:bg-background">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between shrink-0 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-pink-600 uppercase">
            Evolução dos Trabalhos
          </h2>
          <p className="text-slate-500 dark:text-muted-foreground">
            Acompanhe o progresso do fluxo de produção.
          </p>
        </div>
        <div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto items-end">
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <div className="flex flex-col gap-2 w-full sm:w-[280px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-muted-foreground" />
                <Input
                  placeholder="Buscar paciente ou dentista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs uppercase font-bold focus:ring-primary/30"
                />
              </div>
              <Button
                variant="secondary"
                className={cn(
                  'w-full text-xs font-bold uppercase h-8 transition-colors',
                  searchTerm
                    ? 'bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:hover:bg-pink-900/50 border border-pink-100 dark:border-pink-900/30'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-800',
                )}
                onClick={() => setSearchTerm('')}
              >
                LIMPAR BUSCA
              </Button>
            </div>

            {showDentistFilter && (
              <div className="flex flex-col gap-2 w-full sm:w-[280px]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 dark:text-muted-foreground hidden sm:block shrink-0" />
                  <Select
                    value={selectedDentistId === 'all' ? undefined : selectedDentistId}
                    onValueChange={(val) => setSelectedDentistId(val || 'all')}
                    disabled={isLoadingDentists}
                  >
                    <SelectTrigger className="w-full bg-white border-slate-200 dark:border-border dark:bg-background uppercase text-xs font-bold h-9 focus:ring-primary/30">
                      <SelectValue
                        placeholder={
                          isLoadingDentists
                            ? 'CARREGANDO...'
                            : dentistFetchError
                              ? 'ERRO AO CARREGAR'
                              : 'SELECIONE O CLIENTE'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {dentistsList.map((d) => (
                        <SelectItem key={d.id} value={d.id} className="uppercase text-xs font-bold">
                          {d.name}
                        </SelectItem>
                      ))}
                      {dentistFetchError && (
                        <div className="p-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              fetchDentists()
                            }}
                            className="h-8 text-xs"
                          >
                            Tentar Novamente
                          </Button>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="secondary"
                  className={cn(
                    'w-full sm:ml-6 sm:w-[calc(100%-24px)] text-xs font-bold uppercase h-8 transition-colors',
                    selectedDentistId === 'all'
                      ? 'bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:hover:bg-pink-900/50 border border-pink-100 dark:border-pink-900/30'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-800',
                  )}
                  onClick={() => setSelectedDentistId('all')}
                >
                  TODOS OS CLIENTES
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2 w-full sm:w-[280px]">
              <div className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-slate-400 dark:text-muted-foreground hidden sm:block shrink-0" />
                <Select
                  value={selectedWorkType === 'all' ? undefined : selectedWorkType}
                  onValueChange={(val) => setSelectedWorkType(val || 'all')}
                >
                  <SelectTrigger className="w-full bg-white border-slate-200 dark:border-border dark:bg-background uppercase text-xs font-bold h-9 focus:ring-primary/30">
                    <SelectValue placeholder="TIPO DE TRABALHO" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWorkTypes.map((t) => (
                      <SelectItem key={t} value={t} className="uppercase text-xs font-bold">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="secondary"
                className={cn(
                  'w-full sm:ml-6 sm:w-[calc(100%-24px)] text-xs font-bold uppercase h-8 transition-colors',
                  selectedWorkType === 'all'
                    ? 'bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:hover:bg-pink-900/50 border border-pink-100 dark:border-pink-900/30'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-800',
                )}
                onClick={() => setSelectedWorkType('all')}
              >
                TODOS OS TRABALHOS
              </Button>
            </div>
          </div>
          {canCreateOrder && (
            <div className="flex gap-2 w-full sm:w-auto h-9">
              <Button
                asChild
                variant="outline"
                className="flex-1 sm:flex-none h-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600/50 dark:text-yellow-500 dark:hover:bg-yellow-950/30 gap-2"
              >
                <Link to="/new-request?type=adjustment">
                  <RefreshCw className="w-4 h-4" />
                  Retorno <span className="hidden sm:inline">para Ajustes</span>
                </Link>
              </Button>
              <Button asChild className="flex-1 sm:flex-none h-full gap-2">
                <Link to="/new-request">
                  <Plus className="w-4 h-4 hidden sm:block" /> Novo Pedido
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-muted/30 p-4 rounded-xl border border-slate-200 dark:border-border/50 shrink-0">
        <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block tracking-wider uppercase">
          ESCOLHA O LABORATÓRIO
        </Label>
        <div className="flex flex-wrap gap-3">
          {availableSectors.map((s) => (
            <Button
              key={s}
              variant={activeLab === s ? 'default' : 'outline'}
              onClick={() => setSelectedLab(s)}
              className={cn(
                'h-10 px-6 text-xs font-bold transition-all uppercase tracking-wide',
                activeLab === s
                  ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-md border-pink-600'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 dark:bg-background dark:text-muted-foreground dark:hover:bg-muted',
              )}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {storeFetchError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center justify-between text-sm shrink-0">
          <span className="font-medium">
            Ocorreu um erro ao carregar todos os dados. Algumas informações podem estar
            desatualizadas.
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-10 pb-6 pr-2">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-foreground flex items-center gap-2">
            <div className="w-2 h-6 bg-pink-600 rounded-full" /> {activeLab}
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x items-start">
            {activeStages.map((stage, index) => {
              const cols = visibleOrders.filter(
                (o) => (o.sector || '').toUpperCase() === activeLab && o.kanbanStage === stage.name,
              )
              const isExpanded = expandedCols.has(`${activeLab}-${stage.id}`)
              const displayCols = isExpanded ? cols : cols.slice(0, 4)
              const hasMore = cols.length > 4
              const isPendingCard =
                stage.name.trim().toUpperCase() === 'PENDÊNCIAS' ||
                stage.name.trim().toUpperCase() === 'PENDENCIAS'
              const isFirstStage = index === 0

              return (
                <div
                  key={stage.id}
                  onDragOver={(e) => {
                    if (draggedCardId && draggedCardSector?.toUpperCase() === activeLab) {
                      e.preventDefault()
                      setDragOverStageId(`${activeLab}-${stage.id}`)
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverStageId === `${activeLab}-${stage.id}`) setDragOverStageId(null)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOverStageId(null)
                    const columnId = e.dataTransfer.getData('column-id')
                    if (!columnId) {
                      handleDrop(e, stage.name, activeLab)
                    }
                  }}
                  className={cn(
                    'w-[300px] shrink-0 rounded-xl p-3 flex flex-col gap-3 border snap-start transition-all duration-200',
                    'bg-slate-50/60 dark:bg-muted/40 border-slate-200 dark:border-border/50',
                    dragOverStageId === `${activeLab}-${stage.id}` &&
                      draggedCardId &&
                      'border-primary shadow-sm bg-primary/5 ring-1 ring-primary scale-[1.02]',
                  )}
                >
                  <div className="flex items-center justify-between px-1 mb-1 group">
                    {editingStageId === stage.id ? (
                      <Input
                        autoFocus
                        value={editStageName}
                        onChange={(e) => setEditStageName(e.target.value)}
                        onBlur={() => handleSaveStageName(stage.id, stage.name)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleSaveStageName(stage.id, stage.name)
                          }
                          if (e.key === 'Escape') setEditingStageId(null)
                        }}
                        className="h-7 text-xs font-semibold uppercase px-2 py-1 flex-1 min-w-0 bg-white dark:bg-background shadow-sm border-primary/50 focus-visible:ring-primary/30"
                      />
                    ) : (
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                        <h4
                          onClick={() => {
                            if (isMaster) {
                              setEditingStageId(stage.id)
                              setEditStageName(stage.name)
                            }
                          }}
                          className={cn(
                            'font-semibold text-xs tracking-wide uppercase truncate flex items-center gap-1.5',
                            'text-slate-600 dark:text-muted-foreground',
                            isMaster && 'cursor-pointer',
                            isMaster && 'hover:text-primary transition-colors',
                          )}
                          title={isMaster ? 'Clique para renomear' : ''}
                        >
                          {stage.name}
                          {isMaster && (
                            <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </h4>
                        {(stage.description || isMaster) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  'h-5 w-5 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-800',
                                  !stage.description && 'opacity-30 hover:opacity-100',
                                )}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (isMaster) {
                                    setEditingDescStage(stage)
                                    setEditDescText(stage.description || '')
                                  }
                                }}
                              >
                                <Info className="w-3.5 h-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-primary text-primary-foreground border-primary shadow-xl max-w-xs text-center z-50"
                            >
                              {stage.description ? (
                                <p className="text-sm font-medium leading-relaxed">
                                  {stage.description}
                                </p>
                              ) : (
                                <p className="text-sm italic opacity-80">
                                  Sem descrição. Clique para adicionar.
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {isMaster && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive shrink-0 ml-auto"
                            onClick={() => {
                              setDeleteStageData(stage)
                              setFallbackStageName(
                                activeStages.find((s) => s.id !== stage.id)?.name || '',
                              )
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-bold border shrink-0',
                        'bg-white dark:bg-background border-slate-200 dark:border-border text-primary',
                      )}
                    >
                      {cols.length}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 min-h-[150px]">
                    {displayCols.map((o) => (
                      <Tooltip key={o.id} delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div
                            draggable={canDragCards}
                            onDragStart={(e) => {
                              if (!canDragCards) return
                              e.stopPropagation()
                              e.dataTransfer.setData('card-id', o.id)
                              e.dataTransfer.setData('card-sector', o.sector)
                              e.dataTransfer.setData('text/plain', o.id)
                              setTimeout(() => {
                                setDraggedCardId(o.id)
                                setDraggedCardSector(o.sector)
                              }, 0)
                            }}
                            onDragEnd={() => {
                              setDraggedCardId(null)
                              setDraggedCardSector(null)
                              setDragOverStageId(null)
                            }}
                            onClick={() => setSelectedOrderId(o.id)}
                            className={cn(
                              'p-3 rounded-lg border shadow-sm transition-all relative overflow-hidden cursor-pointer',
                              o.isRepetition
                                ? 'bg-red-600 border-red-700 hover:border-red-800 shadow-md dark:bg-red-700 dark:border-red-800 text-white'
                                : o.isAdjustmentReturn
                                  ? 'bg-yellow-400 border-yellow-500 hover:border-yellow-600 shadow-md dark:bg-yellow-500/90 dark:border-yellow-600'
                                  : 'bg-white dark:bg-background border-slate-200 dark:border-border',
                              canDragCards &&
                                !o.isAdjustmentReturn &&
                                !o.isRepetition &&
                                'active:cursor-grabbing hover:border-primary/50 hover:shadow-md',
                              canDragCards &&
                                (o.isAdjustmentReturn || o.isRepetition) &&
                                'active:cursor-grabbing',
                              draggedCardId === o.id &&
                                'opacity-50 scale-[0.98] border-dashed shadow-none',
                            )}
                          >
                            <div
                              className={cn(
                                'absolute left-0 top-0 bottom-0 w-1',
                                isPendingCard
                                  ? 'bg-red-500/80 dark:bg-red-600/80'
                                  : o.isRepetition
                                    ? 'bg-white/30'
                                    : o.isAdjustmentReturn
                                      ? 'bg-yellow-600/50'
                                      : 'bg-primary/20 dark:bg-primary/40',
                              )}
                            />
                            <div className="flex flex-col gap-1.5 relative pl-1">
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-2">
                                  <p
                                    className={cn(
                                      'font-bold text-sm truncate leading-tight',
                                      o.isRepetition
                                        ? 'text-white'
                                        : o.isAdjustmentReturn
                                          ? 'text-yellow-950'
                                          : 'text-slate-800 dark:text-slate-200',
                                    )}
                                    title={o.patientName}
                                  >
                                    {o.patientName}
                                  </p>
                                  {!isDentist && (
                                    <p
                                      className={cn(
                                        'text-[10px] truncate font-medium',
                                        o.isRepetition
                                          ? 'text-red-100'
                                          : o.isAdjustmentReturn
                                            ? 'text-yellow-800'
                                            : 'text-slate-500 dark:text-slate-400',
                                      )}
                                      title={o.dentistName}
                                    >
                                      Dr(a). {o.dentistName}
                                    </p>
                                  )}
                                </div>
                                <div
                                  className={cn(
                                    'shrink-0 flex flex-col items-end gap-1',
                                    o.isRepetition ? 'text-white' : '',
                                  )}
                                >
                                  <div className="flex items-center gap-1.5">
                                    {o.isRepetition && (
                                      <span
                                        className="text-[9px] font-black bg-white/20 px-1.5 py-0.5 rounded text-white tracking-wider"
                                        title="Repetição"
                                      >
                                        REPETIÇÃO
                                      </span>
                                    )}
                                    {o.isAdjustmentReturn && (
                                      <span
                                        className="w-2 h-2 rounded-full bg-yellow-500"
                                        title="Retorno para Ajuste"
                                      />
                                    )}
                                  </div>
                                  <div
                                    className={cn(
                                      'text-[10px] font-medium',
                                      o.isRepetition ? 'opacity-90' : '',
                                    )}
                                  >
                                    <KanbanCardTimer order={o} currentStage={stage.name} />
                                  </div>
                                </div>
                              </div>

                              {isPendingCard && (
                                <div className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-1 rounded text-center uppercase shadow-sm">
                                  Aguardando Dentista
                                </div>
                              )}

                              <div
                                className="flex items-center gap-1.5 mt-1"
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                              >
                                {canDragCards && (
                                  <Select
                                    value={stage.name}
                                    onValueChange={(val) => {
                                      if (val && val !== stage.name) {
                                        updateOrderKanbanStage(o.id, val)
                                      }
                                    }}
                                  >
                                    <SelectTrigger
                                      className={cn(
                                        'h-7 text-[9px] font-bold uppercase flex-1 px-2',
                                        o.isRepetition
                                          ? 'bg-red-700/50 border-red-500/50 text-white focus:ring-red-400'
                                          : o.isAdjustmentReturn
                                            ? 'bg-yellow-500/20 border-yellow-600/30 text-yellow-900 focus:ring-yellow-500'
                                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-primary/30',
                                      )}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="z-[110]">
                                      {activeStages.map((s) => (
                                        <SelectItem
                                          key={s.id}
                                          value={s.name}
                                          className="text-[10px] uppercase font-bold"
                                        >
                                          {s.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}

                                {!isDentist &&
                                  !stage.name.toUpperCase().includes('FINALIZADO') &&
                                  !stage.name.toUpperCase().includes('ENTREGUE') && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={finishingOrderId === o.id}
                                      className={cn(
                                        'h-7 px-2 text-[9px] font-bold shrink-0',
                                        o.isRepetition
                                          ? 'border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10'
                                          : o.isAdjustmentReturn
                                            ? 'border-yellow-600 text-yellow-800 hover:bg-yellow-500 hover:text-yellow-950 bg-yellow-500/20'
                                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-500 dark:hover:bg-emerald-900/50',
                                      )}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleQuickFinish(o.id)
                                      }}
                                    >
                                      {finishingOrderId === o.id ? (
                                        <div
                                          className={cn(
                                            'w-3 h-3 border-[1.5px] border-t-transparent rounded-full animate-spin mr-1',
                                            o.isAdjustmentReturn
                                              ? 'border-yellow-900'
                                              : 'border-emerald-600',
                                          )}
                                        />
                                      ) : (
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                      )}
                                      Finalizar
                                    </Button>
                                  )}
                              </div>

                              <Button
                                variant="secondary"
                                size="sm"
                                className={cn(
                                  'w-full text-[10px] font-bold uppercase h-7 mt-1',
                                  o.isRepetition
                                    ? 'bg-red-800/80 text-white hover:bg-red-900 border border-red-900/50'
                                    : o.isAdjustmentReturn
                                      ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-600 border border-yellow-600'
                                      : 'bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10',
                                )}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/order/${o.id}`)
                                }}
                              >
                                <ExternalLink className="w-3 h-3 mr-1 shrink-0" />
                                <span className="truncate">ABRIR REQUISIÇÃO</span>
                              </Button>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={8}
                          className={cn(
                            'text-primary-foreground border-primary shadow-xl z-[100] w-64 p-3 animate-in fade-in-0 zoom-in-95',
                            o.isRepetition
                              ? 'bg-red-600 text-white border-red-700'
                              : o.isAdjustmentReturn
                                ? 'bg-yellow-500 text-yellow-950 border-yellow-600'
                                : 'bg-primary',
                          )}
                        >
                          <div className="space-y-2">
                            <div>
                              <p className="font-bold text-sm leading-tight">{o.patientName}</p>
                              <p className="text-[11px] font-medium opacity-80 uppercase tracking-wider mt-0.5">
                                {o.friendlyId}{' '}
                                {o.isRepetition
                                  ? ' (REPETIÇÃO)'
                                  : o.isAdjustmentReturn
                                    ? ' (AJUSTE)'
                                    : ''}
                              </p>
                            </div>
                            <div className="text-xs space-y-1 opacity-90">
                              {!isDentist && (
                                <p>
                                  <span className="font-semibold opacity-100">Dr(a):</span>{' '}
                                  {o.dentistName}
                                </p>
                              )}
                              <p>
                                <span className="font-semibold opacity-100">Trabalho:</span>{' '}
                                {o.workType}
                              </p>
                              {o.material && (
                                <p>
                                  <span className="font-semibold opacity-100">Material:</span>{' '}
                                  {o.material}
                                </p>
                              )}
                              {o.fileUrls && o.fileUrls.length > 0 && (
                                <p className="flex items-center gap-1 mt-1 text-inherit">
                                  <Paperclip className="w-3 h-3" /> {o.fileUrls.length} arquivo(s)
                                  anexo(s)
                                </p>
                              )}
                            </div>
                            {o.observations && (
                              <div
                                className={cn(
                                  'mt-2 pt-2 border-t text-xs',
                                  o.isRepetition
                                    ? 'border-white/20'
                                    : o.isAdjustmentReturn
                                      ? 'border-yellow-700/30'
                                      : 'border-primary-foreground/20',
                                )}
                              >
                                <p className="font-semibold mb-1">Observações:</p>
                                <p className="opacity-90 line-clamp-4 leading-relaxed">
                                  {o.observations}
                                </p>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {hasMore && (
                      <Button
                        variant="ghost"
                        className="w-full text-xs font-bold mt-1 text-pink-600 hover:text-pink-700 hover:bg-pink-50 border border-transparent hover:border-pink-200 uppercase tracking-wide transition-colors dark:hover:bg-pink-950/30"
                        onClick={() => {
                          const newSet = new Set(expandedCols)
                          if (isExpanded) newSet.delete(`${activeLab}-${stage.id}`)
                          else newSet.add(`${activeLab}-${stage.id}`)
                          setExpandedCols(newSet)
                        }}
                      >
                        {isExpanded ? 'Ver Menos' : `Ver Mais (+${cols.length - 4})`}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
            {isMaster && (
              <Button
                variant="outline"
                className="w-[300px] shrink-0 h-[100px] border-dashed border-2 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors bg-slate-50/30"
                onClick={() => setIsAddColumnOpen(true)}
              >
                <Plus className="w-6 h-6 mb-2" />
                <span className="font-medium text-sm">Adicionar Coluna</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        obsText={obsText}
        setObsText={setObsText}
        onSaveObs={handleSaveObs}
      />

      <Dialog open={!!editingDescStage} onOpenChange={(open) => !open && setEditingDescStage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descrição da Coluna</DialogTitle>
            <DialogDescription>
              Explique o propósito ou requisitos para a etapa{' '}
              <strong className="text-foreground">{editingDescStage?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editDescText}
            onChange={(e) => setEditDescText(e.target.value)}
            placeholder="Ex: Todos os pedidos nesta coluna devem ter modelos validados."
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingDescStage(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveDesc}>Salvar Descrição</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddColumnOpen}
        onOpenChange={(open) => {
          setIsAddColumnOpen(open)
          if (!open) setNewColumnName('')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Coluna</DialogTitle>
          </DialogHeader>
          <Input
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && newColumnName.trim()) {
                e.preventDefault()
                const success = await addKanbanStage(newColumnName.trim(), activeLab)
                if (success) {
                  setNewColumnName('')
                  setIsAddColumnOpen(false)
                }
              }
            }}
            placeholder="Ex: CONTROLE DE QUALIDADE"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setNewColumnName('')
                setIsAddColumnOpen(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (newColumnName.trim()) {
                  const success = await addKanbanStage(newColumnName.trim(), activeLab)
                  if (success) {
                    setNewColumnName('')
                    setIsAddColumnOpen(false)
                  }
                }
              }}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteStageData} onOpenChange={(o) => !o && setDeleteStageData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir {deleteStageData?.name}</DialogTitle>
            <DialogDescription>
              Confirma a exclusão desta coluna?
              {hasOrders && ' Selecione para qual coluna deseja mover os pedidos.'}
            </DialogDescription>
          </DialogHeader>
          {hasOrders && (
            <div className="py-4">
              <Label className="mb-2 block text-sm">Mover pedidos para:</Label>
              <Select value={fallbackStageName} onValueChange={setFallbackStageName}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeStages
                    .filter((s) => s.id !== deleteStageData?.id)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteStageData(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={hasOrders && !fallbackStageName}
              onClick={() => {
                if (deleteStageData) {
                  deleteKanbanStage(
                    deleteStageData.id,
                    deleteStageData.name,
                    hasOrders ? fallbackStageName : undefined,
                    activeLab,
                  )
                  setDeleteStageData(null)
                }
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MiniGuideDialog
        order={selectedPrintQrOrder}
        isOpen={!!selectedPrintQrOrder}
        onClose={() => setSelectedPrintQrOrder(null)}
        type="print"
      />
      <MiniGuideDialog
        order={selectedFullQrOrder}
        isOpen={!!selectedFullQrOrder}
        onClose={() => setSelectedFullQrOrder(null)}
        type="full"
      />
    </div>
  )
}
