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
import { FileText, Activity, Clock } from 'lucide-react'
import { Order } from '@/lib/types'
import { getStatusLabel } from '@/components/StatusBadge'

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
  if (!order) return null
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
              <Activity className="w-4 h-4 text-primary" /> Histórico de Atividades
            </h4>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {order.history.map((ev) => (
                <div key={ev.id} className="relative flex items-start gap-4">
                  <div className="absolute left-0 mt-1.5 w-2 h-2 ml-2 rounded-full bg-primary z-10" />
                  <div className="ml-8 space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {getStatusLabel(ev.status)}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(ev.date), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    {ev.note && (
                      <div className="text-sm text-slate-700 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        {ev.note}
                      </div>
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
