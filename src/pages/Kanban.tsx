import { useState, useMemo } from 'react'
import { useAppStore } from '@/stores/main'
import { KanbanStage } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/StatusBadge'
import { Users } from 'lucide-react'

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
  const { orders, currentUser, updateOrderKanbanStage } = useAppStore()
  const isAdmin = currentUser?.role === 'admin'
  const [dentist, setDentist] = useState('all')

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
    if (o && o.sector === sector && o.kanbanStage !== stage) {
      updateOrderKanbanStage(id, stage)
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
                          className={`bg-white dark:bg-background p-3.5 rounded-lg border border-slate-200 dark:border-border shadow-sm transition-all relative overflow-hidden ${isAdmin ? 'cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md' : ''}`}
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
    </div>
  )
}
