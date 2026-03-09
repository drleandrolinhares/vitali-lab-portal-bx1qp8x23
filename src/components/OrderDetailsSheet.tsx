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
} from 'lucide-react'
import { Order, OrderHistory } from '@/lib/types'
import { useAppStore } from '@/stores/main'
import { cn, processOrderHistory } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
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
    } else {
      setHistoryItems([])
      setIsDeleteDialogOpen(false)
    }
  }, [isOpen, order?.id, order?.history])

  const handleDelete = async () => {
    if (!order) return
    await deleteOrder(order.id, 'Excluído via Kanban')
    setIsDeleteDialogOpen(false)
    onClose()
  }

  if (!order) return null

  const actualHistory = historyItems.length > 0 ? historyItems : order.history
  const processedHistory = processOrderHistory(actualHistory, kanbanStages, order.kanbanStage)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:w-[540px] flex flex-col h-full bg-white dark:bg-background z-[100] border-l">
          <SheetHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 pr-4">
                <SheetTitle className="text-xl text-slate-900 dark:text-slate-100">
                  Pedido {order.friendlyId}
                </SheetTitle>
                <SheetDescription className="text-sm text-slate-500">
                  {order.patientName} - {order.dentistName}
                </SheetDescription>
              </div>
              {currentUser?.role === 'admin' && (
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
                          : 'bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {item.direction === 'backward' ? (
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
                        <div className="flex items-center gap-1.5 text-xs font-medium bg-muted/40 px-2 py-1 rounded-md text-muted-foreground whitespace-nowrap border border-border/50">
                          <Clock className="w-3 h-3" />
                          {item.durationStr}
                        </div>
                      </div>
                      {item.note && !item.note.startsWith('Movido para') && (
                        <p className="text-xs text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md border border-border/40">
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
              Tem certeza que deseja excluir o pedido <strong>{order.friendlyId}</strong> do
              paciente <strong>{order.patientName}</strong>? Esta ação removerá permanentemente o
              registro, seu histórico e todos os lançamentos financeiros associados.
              <strong> Esta ação não pode ser desfeita.</strong>
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
