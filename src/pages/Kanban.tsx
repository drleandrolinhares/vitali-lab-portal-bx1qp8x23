import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '@/stores/main'
import { KanbanStage } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge, getStatusLabel } from '@/components/StatusBadge'
import { Users, FileText, Activity, Clock } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STAGES: KanbanStage[] = [
  'TRIAGEM',
  'PENDÊNCIAS',
  'CAD DESIGN',
  'VALIDAÇÃO DENTISTA CAD',
  'CAD FRESAGEM',
  'SINTERIZAÇÃO ZIRCÔNIA',
  'ACABAMENTO MAQUIAGEM',
  'PRONTO PARA ENVIO',
]
const SECTORS = ['SOLUÇÕES CERÂMICAS', 'STÚDIO ACRÍLICO']

export default function KanbanPage() {
  const { orders, currentUser, updateOrderKanbanStage, updateOrderObservations } = useAppStore()
  const isAdmin = currentUser?.role === 'admin'
  const [dentist, setDentist] = useState('all')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId),
    [orders, selectedOrderId],
  )
  const [obsText, setObsText] = useState('')

  useEffect(() => {
    if (selectedOrder) setObsText(selectedOrder.observations || '')
  }, [selectedOrder])

  const dentists = Array.from(new Set(orders.map((o) => o.dentistName))).sort()
  const visibleOrders = useMemo(() => {
    if (!isAdmin || dentist === 'all') return orders
    return orders.filter((o) => o.dentistName === dentist)
  }, [orders, isAdmin, dentist])

  const handleDrop = (e: React.DragEvent, stage: KanbanStage, sector: string) => {
    e.preventDefault()
    if (!isAdmin) return
    const id = e.dataTransfer.getData('text/plain')
    const o = orders.find((x) => x.id === id)
    if (o && o.sector === sector && o.kanbanStage !== stage) updateOrderKanbanStage(id, stage)
  }

  const handleSaveObs = () => {
    if (selectedOrder) updateOrderObservations(selectedOrder.id, obsText)
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
        {isAdmin && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Users className="w-4 h-4 text-slate-400 dark:text-muted-foreground hidden sm:block" />
            <Select value={dentist} onValueChange={setDentist}>
              <SelectTrigger className="w-full sm:w-64 bg-white border-slate-200 dark:border-border dark:bg-background">
                <SelectValue placeholder="Filtrar por Dentista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Dentistas</SelectItem>
                {dentists.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-10 pb-6 pr-2">
        {SECTORS.map((sector) => (
          <div key={sector} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-foreground flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full" /> {sector}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {STAGES.map((stage) => {
                const cols = visibleOrders.filter(
                  (o) => o.sector === sector && o.kanbanStage === stage,
                )
                return (
                  <div
                    key={stage}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, stage, sector)}
                    className="w-[300px] shrink-0 bg-slate-50/60 dark:bg-muted/40 rounded-xl p-3 flex flex-col gap-3 border border-slate-200 dark:border-border/50 snap-start"
                  >
                    <div className="flex items-center justify-between px-1">
                      <h4 className="font-semibold text-xs tracking-wide uppercase text-slate-600 dark:text-muted-foreground">
                        {stage}
                      </h4>
                      <span className="bg-white dark:bg-background px-2 py-0.5 rounded text-xs font-bold border border-slate-200 dark:border-border text-primary">
                        {cols.length}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2 min-h-[150px]">
                      {cols.map((o) => (
                        <div
                          key={o.id}
                          draggable={isAdmin}
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', o.id)}
                          onClick={() => isAdmin && setSelectedOrderId(o.id)}
                          className={`bg-white dark:bg-background p-3.5 rounded-lg border border-slate-200 dark:border-border shadow-sm transition-all relative overflow-hidden ${isAdmin ? 'cursor-pointer active:cursor-grabbing hover:border-primary/50 hover:shadow-md' : ''}`}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 dark:bg-primary/40" />
                          <div className="flex justify-between items-start mb-2 pl-1">
                            <span className="text-xs font-bold text-slate-500 dark:text-muted-foreground">
                              {o.friendlyId}
                            </span>
                            <StatusBadge
                              status={o.status}
                              className="scale-[0.8] origin-top-right -mt-1.5 -mr-1.5"
                            />
                          </div>
                          <p
                            className="font-medium text-sm truncate pl-1 text-slate-900 dark:text-foreground"
                            title={o.patientName}
                          >
                            {o.patientName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1 truncate pl-1">
                            {o.workType}
                          </p>
                          {isAdmin && (
                            <p className="text-[10px] font-medium text-slate-400 dark:text-muted-foreground mt-3 pt-2 border-t border-slate-100 dark:border-border truncate pl-1">
                              {o.dentistName}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
        <SheetContent className="w-full sm:w-[540px] flex flex-col h-full bg-white dark:bg-background z-[100] border-l">
          <SheetHeader>
            <SheetTitle className="text-xl text-slate-900 dark:text-slate-100">
              Pedido {selectedOrder?.friendlyId}
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-500">
              {selectedOrder?.patientName} - {selectedOrder?.dentistName}
            </SheetDescription>
          </SheetHeader>
          {selectedOrder && (
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
                <Button onClick={handleSaveObs} size="sm" className="w-full sm:w-auto">
                  Salvar Observações
                </Button>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Activity className="w-4 h-4 text-primary" /> Histórico de Atividades
                </h4>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {selectedOrder.history.map((ev) => (
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
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
