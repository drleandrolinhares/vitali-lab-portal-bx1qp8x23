import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ViewType } from './types'
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, ShieldAlert, Settings } from 'lucide-react'

interface Props {
  view: ViewType
  setView: (v: ViewType) => void
  currentDate: Date
  setCurrentDate: (d: Date) => void
  isAdmin: boolean
  onNewBooking: () => void
  onNewBlock: () => void
  onOpenSettings: () => void
}

export function ScanHeader({
  view,
  setView,
  currentDate,
  setCurrentDate,
  isAdmin,
  onNewBooking,
  onNewBlock,
  onOpenSettings,
}: Props) {
  const getPeriodLabel = () => {
    if (view === 'day') return format(currentDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
    if (view === 'week') {
      const start = new Date(currentDate)
      start.setDate(currentDate.getDate() - currentDate.getDay())
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return `${format(start, 'dd MMM', { locale: ptBR })} - ${format(end, 'dd MMM', { locale: ptBR })}`
    }
    return format(currentDate, 'MMMM yyyy', { locale: ptBR })
  }

  const navigatePrev = () => {
    if (view === 'day') setCurrentDate(subDays(currentDate, 1))
    if (view === 'week') setCurrentDate(subWeeks(currentDate, 1))
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1))
  }

  const navigateNext = () => {
    if (view === 'day') setCurrentDate(addDays(currentDate, 1))
    if (view === 'week') setCurrentDate(addWeeks(currentDate, 1))
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1))
  }

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b bg-background shrink-0">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex items-center rounded-md border border-border bg-muted/20">
          <Button
            variant="ghost"
            size="icon"
            onClick={navigatePrev}
            className="rounded-none rounded-l-md h-9 w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="w-px h-5 bg-border" />
          <Button
            variant="ghost"
            size="icon"
            onClick={navigateNext}
            className="rounded-none rounded-r-md h-9 w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(new Date())}
          className="h-9 font-semibold"
        >
          Hoje
        </Button>
        <h2 className="text-lg sm:text-xl font-bold capitalize tabular-nums text-foreground tracking-tight ml-2">
          {getPeriodLabel()}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as ViewType)}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-9 w-full sm:w-auto">
            <TabsTrigger value="day" className="text-xs uppercase font-bold tracking-wider">
              Dia
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs uppercase font-bold tracking-wider">
              Semana
            </TabsTrigger>
            <TabsTrigger value="month" className="text-xs uppercase font-bold tracking-wider">
              Mês
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            onClick={onNewBooking}
            size="sm"
            className="flex-1 sm:flex-none gap-2 h-9 font-bold"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nova</span> Reserva
          </Button>
          {isAdmin && (
            <>
              <Button
                onClick={onNewBlock}
                variant="secondary"
                size="sm"
                className="flex-1 sm:flex-none gap-2 h-9 font-bold bg-slate-800 text-white hover:bg-slate-700"
              >
                <ShieldAlert className="w-4 h-4" /> <span className="hidden sm:inline">Novo</span>{' '}
                Bloqueio
              </Button>
              <Button
                onClick={onOpenSettings}
                variant="outline"
                size="icon"
                className="h-9 w-9"
                title="Configurações"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
