import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ViewType, ScanFilters, ScanTab } from './types'

interface Props {
  view: ViewType
  setView: (v: ViewType) => void
  activeTab: string
  setActiveTab: (t: string) => void
  filters: ScanFilters
  setFilters: (f: ScanFilters) => void
  dentists: any[]
  isStaff: boolean
}

export function ScanHeader({
  view,
  setView,
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  dentists,
  isStaff,
}: Props) {
  const tabs: ScanTab[] = ['AGENDAMENTOS MARCADOS', 'VISÃO GERAL']

  return (
    <div className="flex flex-col bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-slate-100">
        <div className="bg-slate-100/80 p-1 rounded-lg flex items-center h-11 border border-slate-200 shrink-0">
          {['day', 'week', 'month'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as ViewType)}
              className={cn(
                'px-5 sm:px-6 h-full text-[11px] font-black uppercase rounded-md transition-all duration-200 tracking-wider',
                view === v
                  ? 'bg-white shadow-sm text-[#1A233A]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50',
              )}
            >
              {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>

        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 text-xs font-bold uppercase text-[#8A6D3B] gap-2 border-[#E5D5B5] bg-[#FDFBF7] hover:bg-[#F8F1E3] flex-1 sm:flex-none transition-colors"
              >
                <Filter className="w-4 h-4" /> Visibilidade
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={filters.showBookings}
                onCheckedChange={(c) => setFilters({ ...filters, showBookings: !!c })}
              >
                Reservas Confirmadas
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.showBlocks}
                onCheckedChange={(c) => setFilters({ ...filters, showBlocks: !!c })}
              >
                Bloqueios Administrativos
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isStaff && (
            <Select
              value={filters.dentistId || 'all'}
              onValueChange={(v) => setFilters({ ...filters, dentistId: v })}
            >
              <SelectTrigger className="flex-1 sm:flex-none sm:w-[220px] h-11 text-xs font-bold uppercase border-slate-200 bg-white">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="DENTISTAS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Dentistas</SelectItem>
                {dentists.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-6 py-2.5 text-[11px] whitespace-nowrap font-black uppercase rounded-lg transition-all duration-200 tracking-wider shadow-sm border',
              activeTab === tab
                ? 'bg-[#1A233A] border-[#1A233A] text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-[#1A233A] hover:bg-slate-50',
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
