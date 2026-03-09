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
import { FileText, Activity, Clock, ArrowLeft, ArrowRight, Circle, Calendar } from 'lucide-react'
import { Order, OrderHistory } from '@/lib/types'
import { useAppStore } from '@/stores/main'
import { cn, processOrderHistory } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'

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
  const { kanbanStages } = useAppStore()
  const [historyItems, setHistoryItems] = useState<OrderHistory[]>([])

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
    }
  }, [isOpen, order?.id, order?.history])

  if (!order) return null

  const actualHistory = historyItems.length > 0 ? historyItems : order.history
  const processedHistory = processOrderHistory(actualHistory, kanbanStages, order.kanbanStage)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:w-[540px] flex flex-col h-full bg-white dark:bg-background z-[100] border-l">
        <SheetHeader>
          <SheetTitle className="text-xl text-slate-900 dark:text-slate-100">
            Pedido {order.friendlyId}
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-500">
            {order.patientName} - {order.dentistName}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto mt-6 space-y-8 pr-2 pb-6">
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
  )
}
