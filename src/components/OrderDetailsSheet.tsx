import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Activity,
  Clock,
  ArrowLeft,
  ArrowRight,
  Circle,
  Calendar,
  Trash2,
  Paperclip,
  Download,
  DollarSign,
  Users,
} from 'lucide-react'
import { Order, OrderHistory } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/stores/main'
import { cn, processOrderHistory } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { formatBRL } from '@/lib/financial'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Props {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  obsText: string
  setObsText: (s: string) => void
  onSaveObs: () => void
}

export function OrderDetailsSheet({
  order,
  isOpen,
  onClose,
  obsText,
  setObsText,
  onSaveObs,
}: Props) {
  const { kanbanStages, currentUser, deleteOrder } = useAppStore()
  const [historyItems, setHistoryItems] = useState<OrderHistory[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [cadistaId, setCadistaId] = useState<string>('none')
  const [maquiagemId, setMaquiagemId] = useState<string>('none')
  const [acabamentoId, setAcabamentoId] = useState<string>('none')
  const [cadistas, setCadistas] = useState<any[]>([])
  const [colaboradores, setColaboradores] = useState<any[]>([])
  const [isLoadingProduction, setIsLoadingProduction] = useState(false)

  useEffect(() => {
    if (isOpen && order?.id) {
      const fetchHistory = async () => {
        const { data, error } = await supabase
          .from('order_history')
          .select('*')
          .eq('order_id', order.id)
          .order('created_at', { ascending: true })

        if (data && !error) {
          setHistoryItems(
            data.map((h: any) => ({
              id: h.id,
              status: h.status,
              date: h.created_at,
              note: h.note,
            })),
          )
        } else {
          setHistoryItems(order.history || [])
        }
      }
      fetchHistory()

      const fetchProductionData = async () => {
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
    } else {
      setHistoryItems([])
      setIsDeleteDialogOpen(false)
      setCadistaId('none')
      setMaquiagemId('none')
      setAcabamentoId('none')
    }
  }, [isOpen, order?.id, order?.history])

  const handleUpdateProduction = async (field: string, value: string) => {
    if (!order?.id) return
    const val = value === 'none' ? null : value
    const { error } = await supabase
      .from('orders')
      .update({ [field]: val })
      .eq('id', order.id)
    if (!error) {
      if (field === 'cadista_id') setCadistaId(value)
      if (field === 'maquiagem_id') setMaquiagemId(value)
      if (field === 'acabamento_id') setAcabamentoId(value)
    }
  }

  const handleDelete = async () => {
    if (!order) return
    await deleteOrder(order.id, 'Excluído via Kanban')
    setIsDeleteDialogOpen(false)
    onClose()
  }

  if (!order) return null

  const sectorStages = kanbanStages.filter(
    (s) =>
      (s.sector || 'SOLUÇÕES CERÂMICAS').toUpperCase() ===
      (order.sector || 'SOLUÇÕES CERÂMICAS').toUpperCase(),
  )
  const actualHistory = historyItems.length > 0 ? historyItems : order.history

  const systemHistory = actualHistory.filter((h) => h.status !== 'NOTA_MANUAL')
  const processedSystemHistory = processOrderHistory(systemHistory, sectorStages, order.kanbanStage)

  const isInternalUser = currentUser?.role !== 'dentist'

  const manualNotes = actualHistory
    .filter((h) => h.status === 'NOTA_MANUAL')
    .map((h: any) => ({
      id: h.id,
      stageName: `Anotação de Usuário`,
      date: h.date || h.created_at,
      durationStr: '-',
      note: h.note,
      isCurrent: false,
      direction: 'none' as const,
      isManual: true,
    }))

  const processedHistory = [...processedSystemHistory, ...manualNotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:w-[540px] flex flex-col h-full bg-white dark:bg-background z-[100] border-l">
          <SheetHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 pr-4">
                <SheetTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Pedido {order.friendlyId}
                  {order.isRepetition && (
                    <div className="bg-destructive text-destructive-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                      Repetição
                    </div>
                  )}
                </SheetTitle>
                <SheetDescription className="text-sm text-slate-500">
                  {order.patientName} - {order.dentistName}
                </SheetDescription>
              </div>
              {(currentUser?.role === 'admin' || currentUser?.role === 'master') && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 mt-0.5"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  title="Excluir pedido"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto mt-6 space-y-8 pr-2 pb-6">
            {order.fileUrls && order.fileUrls.length > 0 && (
              <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Paperclip className="w-4 h-4 text-primary" /> Arquivos Anexados
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.fileUrls.map((url, i) => {
                    const filename = url.split('/').pop() || `Arquivo ${i + 1}`
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm p-2 rounded-md bg-background border hover:border-primary/50 transition-colors group"
                      >
                        <Download className="w-4 h-4 text-primary group-hover:scale-110 transition-transform shrink-0" />
                        <span className="truncate text-foreground group-hover:text-primary transition-colors">
                          {filename}
                        </span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <DollarSign className="w-4 h-4 text-primary" /> Financeiro
              </h4>
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-2">
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
                <div className="flex justify-between items-center pt-2 border-t font-semibold">
                  <span>Total do Pedido</span>
                  <span className="text-primary">{formatBRL(order.basePrice)}</span>
                </div>
              </div>
            </div>

            {isInternalUser && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Users className="w-4 h-4 text-primary" /> Produção Interna
                </h4>
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cadista</Label>
                    <Select
                      value={cadistaId}
                      onValueChange={(val) => handleUpdateProduction('cadista_id', val)}
                      disabled={isLoadingProduction}
                    >
                      <SelectTrigger className="h-8 text-xs bg-background">
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
                      <SelectTrigger className="h-8 text-xs bg-background">
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
                      <SelectTrigger className="h-8 text-xs bg-background">
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
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <FileText className="w-4 h-4 text-primary" /> Observações Administrativas
              </h4>
              <Textarea
                value={obsText}
                onChange={(e) => setObsText(e.target.value)}
                placeholder="Adicione notas ou comentários..."
                className="min-h-[120px] resize-none"
              />
              <Button onClick={onSaveObs} size="sm" className="w-full sm:w-auto">
                Salvar Observações
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Activity className="w-4 h-4 text-primary" /> Histórico de Etapas
              </h4>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-px before:bg-border">
                {processedHistory.map((item) => (
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
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este caso? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
