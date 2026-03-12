import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Stage } from '@/lib/types'
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
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

const SECTORS = ['SOLUÇÕES CERÂMICAS', 'STÚDIO ACRÍLICO']

export default function KanbanPage() {
  const {
    orders,
    currentUser,
    updateOrderKanbanStage,
    updateOrderObservations,
    kanbanStages,
    addKanbanStage,
    updateKanbanStage,
    updateKanbanStageDescription,
    deleteKanbanStage,
    reorderKanbanStages,
    checkPermission,
  } = useAppStore()

  const navigate = useNavigate()
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === ('master' as any)
  const isDentist = currentUser?.role === 'dentist'

  const canDragCards = checkPermission('kanban', 'move_cards')
  const canFilterDentist = checkPermission('kanban', 'filter_dentist')
  const showDentistFilter = currentUser?.role !== 'dentist' && canFilterDentist

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedDentistId = searchParams.get('dentist') || 'all'

  const setSelectedDentistId = (val: string) => {
    if (val === 'all') {
      searchParams.delete('dentist')
    } else {
      searchParams.set('dentist', val)
    }
    setSearchParams(searchParams, { replace: true })
  }

  const [dentistsList, setDentistsList] = useState<{ id: string; name: string }[]>([])
  const [isLoadingDentists, setIsLoadingDentists] = useState(false)

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

  const savingRef = useRef(false)

  useEffect(() => {
    if (showDentistFilter && currentUser) {
      const fetchDentists = async () => {
        setIsLoadingDentists(true)
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('role', 'dentist')
          .eq('is_approved', true)
          .order('name')

        if (data && !error) {
          setDentistsList(data)
        }
        setIsLoadingDentists(false)
      }

      fetchDentists()
    }
  }, [showDentistFilter, currentUser])

  useEffect(() => {
    if (selectedOrder) setObsText(selectedOrder.observations || '')
  }, [selectedOrder])

  const visibleOrders = useMemo(() => {
    if (currentUser?.role === 'dentist') return orders
    if (canFilterDentist && selectedDentistId !== 'all')
      return orders.filter((o) => o.dentistId === selectedDentistId)
    return orders
  }, [orders, currentUser?.role, selectedDentistId, canFilterDentist])

  const hasOrders = useMemo(
    () => (deleteStageData ? orders.some((o) => o.kanbanStage === deleteStageData.name) : false),
    [deleteStageData, orders],
  )

  const handleColumnDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAdmin) return
    const dragId = e.dataTransfer.getData('column-id')
    if (dragId && dragId !== targetStageId) {
      const oldIndex = kanbanStages.findIndex((s) => s.id === dragId)
      const newIndex = kanbanStages.findIndex((s) => s.id === targetStageId)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newStages = [...kanbanStages]
        const [moved] = newStages.splice(oldIndex, 1)
        newStages.splice(newIndex, 0, moved)
        reorderKanbanStages(newStages.map((s, idx) => ({ ...s, orderIndex: idx + 1 })))
      }
    }
  }

  const handleDrop = (e: React.DragEvent, stage: string, sector: string) => {
    e.preventDefault()
    if (!canDragCards) return
    const cardId = e.dataTransfer.getData('card-id') || e.dataTransfer.getData('text/plain')
    if (cardId) {
      const o = orders.find((x) => x.id === cardId)
      if (o && o.sector === sector && o.kanbanStage !== stage) updateOrderKanbanStage(cardId, stage)
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
      await updateKanbanStage(id, oldName, trimmed)
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
      const existingExact = kanbanStages.find((s) => s.name.toUpperCase() === targetStageName)

      if (!existingExact) {
        const fallback = kanbanStages.find(
          (s) =>
            s.name.toUpperCase().includes('FINALIZADO') ||
            s.name.toUpperCase().includes('ENTREGUE'),
        )
        if (fallback) {
          targetStageName = fallback.name
        } else {
          await addKanbanStage(targetStageName)
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Evolução dos Trabalhos</h2>
          <p className="text-slate-500 dark:text-muted-foreground">
            Acompanhe o progresso do fluxo de produção.
          </p>
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
                    placeholder={isLoadingDentists ? 'CARREGANDO...' : 'SELECIONE O DENTISTA'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {dentistsList.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="uppercase text-xs font-bold">
                      {d.name}
                    </SelectItem>
                  ))}
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
              TODOS OS DENTISTAS
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-10 pb-6 pr-2">
        {SECTORS.map((sector) => (
          <div key={sector} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-foreground flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full" /> {sector}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x items-start">
              {kanbanStages.map((stage) => {
                const cols = visibleOrders.filter(
                  (o) => o.sector === sector && o.kanbanStage === stage.name,
                )
                const isExpanded = expandedCols.has(`${sector}-${stage.id}`)
                const displayCols = isExpanded ? cols : cols.slice(0, 4)
                const hasMore = cols.length > 4

                return (
                  <div
                    key={stage.id}
                    draggable={isAdmin && !editingStageId}
                    onDragStart={(e) => {
                      if (!isAdmin) return
                      e.dataTransfer.setData('column-id', stage.id)
                      setTimeout(() => setDraggedStageId(stage.id), 0)
                    }}
                    onDragEnd={() => {
                      setDraggedStageId(null)
                      setDragOverStageId(null)
                    }}
                    onDragOver={(e) => {
                      if (draggedStageId && draggedStageId !== stage.id) {
                        e.preventDefault()
                        setDragOverStageId(`${sector}-${stage.id}`)
                      } else if (draggedCardId && draggedCardSector === sector) {
                        e.preventDefault()
                        setDragOverStageId(`${sector}-${stage.id}`)
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverStageId === `${sector}-${stage.id}`) setDragOverStageId(null)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOverStageId(null)
                      const columnId = e.dataTransfer.getData('column-id')
                      if (columnId) {
                        if (isAdmin) handleColumnDrop(e, stage.id)
                      } else {
                        handleDrop(e, stage.name, sector)
                      }
                    }}
                    className={cn(
                      'w-[300px] shrink-0 bg-slate-50/60 dark:bg-muted/40 rounded-xl p-3 flex flex-col gap-3 border border-slate-200 dark:border-border/50 snap-start transition-all duration-200',
                      draggedStageId === stage.id &&
                        'opacity-40 scale-[0.98] border-dashed border-slate-400 shadow-none',
                      dragOverStageId === `${sector}-${stage.id}` &&
                        (draggedStageId || draggedCardId) &&
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
                          {isAdmin && (
                            <GripHorizontal
                              className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 cursor-grab shrink-0"
                              title="Arraste para reordenar"
                            />
                          )}
                          <h4
                            onClick={() => {
                              if (isAdmin) {
                                setEditingStageId(stage.id)
                                setEditStageName(stage.name)
                              }
                            }}
                            className={cn(
                              'font-semibold text-xs tracking-wide uppercase text-slate-600 dark:text-muted-foreground truncate flex items-center gap-1.5',
                              isAdmin && 'cursor-pointer hover:text-primary transition-colors',
                            )}
                            title={isAdmin ? 'Clique para renomear' : ''}
                          >
                            {stage.name}
                            {isAdmin && (
                              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </h4>
                          {(stage.description || isAdmin) && (
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
                                    if (isAdmin) {
                                      setEditingDescStage(stage)
                                      setEditDescText(stage.description || '')
                                    }
                                  }}
                                >
                                  <Info className="w-3.5 h-3.5 text-slate-500" />
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
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive shrink-0 ml-auto"
                              onClick={() => {
                                setDeleteStageData(stage)
                                setFallbackStageName(
                                  kanbanStages.find((s) => s.id !== stage.id)?.name || '',
                                )
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                      <span className="bg-white dark:bg-background px-2 py-0.5 rounded text-xs font-bold border border-slate-200 dark:border-border text-primary shrink-0">
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
                                'bg-white dark:bg-background p-3.5 rounded-lg border border-slate-200 dark:border-border shadow-sm transition-all relative overflow-hidden cursor-pointer',
                                canDragCards &&
                                  'active:cursor-grabbing hover:border-primary/50 hover:shadow-md',
                                draggedCardId === o.id &&
                                  'opacity-50 scale-[0.98] border-dashed shadow-none',
                              )}
                            >
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 dark:bg-primary/40" />
                              <div className="flex justify-between items-start mb-2 pl-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-500">
                                    {o.friendlyId}
                                  </span>
                                  {o.fileUrls && o.fileUrls.length > 0 && (
                                    <Paperclip className="w-3 h-3 text-primary opacity-70" />
                                  )}
                                </div>
                                <StatusBadge
                                  status={o.status}
                                  className="scale-[0.8] origin-top-right -mt-1.5 -mr-1.5"
                                />
                              </div>
                              <p className="font-medium text-sm truncate pl-1">{o.patientName}</p>
                              <p className="text-xs text-slate-500 mt-1 truncate pl-1">
                                {o.workType}
                              </p>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t gap-1">
                                <div className="text-[10px] font-medium text-slate-400 truncate flex-1 pl-1">
                                  {currentUser?.role !== 'dentist' && o.dentistName}
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {currentUser?.role !== 'dentist' &&
                                    !stage.name.toUpperCase().includes('FINALIZADO') &&
                                    !stage.name.toUpperCase().includes('ENTREGUE') && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={finishingOrderId === o.id}
                                        className="h-[22px] px-2 py-0 text-[10px] font-bold border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-500 dark:hover:bg-emerald-900/50"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleQuickFinish(o.id)
                                        }}
                                        title="Mover para Finalizados e Entregues"
                                      >
                                        {finishingOrderId === o.id ? (
                                          <div className="w-3 h-3 mr-1 border-[1.5px] border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                        )}
                                        Finalizar
                                      </Button>
                                    )}
                                  <KanbanCardTimer order={o} currentStage={stage.name} />
                                </div>
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="w-full text-[10px] font-bold mt-3 uppercase h-7 bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/order/${o.id}`)
                                }}
                              >
                                <ExternalLink className="w-3 h-3 mr-1.5" />
                                Abrir Requisição
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            sideOffset={8}
                            className="bg-primary text-primary-foreground border-primary shadow-xl z-[100] w-64 p-3 animate-in fade-in-0 zoom-in-95"
                          >
                            <div className="space-y-2">
                              <div>
                                <p className="font-bold text-sm leading-tight">{o.patientName}</p>
                                <p className="text-[11px] font-medium opacity-80 uppercase tracking-wider mt-0.5">
                                  {o.friendlyId}
                                </p>
                              </div>
                              <div className="text-xs space-y-1 opacity-90">
                                {currentUser?.role !== 'dentist' && (
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
                                  <p className="flex items-center gap-1 mt-1 text-primary-foreground/90">
                                    <Paperclip className="w-3 h-3" /> {o.fileUrls.length} arquivo(s)
                                    anexo(s)
                                  </p>
                                )}
                              </div>
                              {o.observations && (
                                <div className="mt-2 pt-2 border-t border-primary-foreground/20 text-xs">
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
                          className="w-full text-xs font-semibold mt-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border"
                          onClick={() => {
                            const newSet = new Set(expandedCols)
                            if (isExpanded) newSet.delete(`${sector}-${stage.id}`)
                            else newSet.add(`${sector}-${stage.id}`)
                            setExpandedCols(newSet)
                          }}
                        >
                          {isExpanded ? 'Ver Menos' : `Ver mais (${cols.length - 4})`}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
              {isAdmin && (
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
        ))}
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
                const success = await addKanbanStage(newColumnName.trim())
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
                  const success = await addKanbanStage(newColumnName.trim())
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
                  {kanbanStages
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
    </div>
  )
}
