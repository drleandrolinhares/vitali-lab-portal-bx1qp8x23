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
import { Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ViewType, ScanFilters } from './types'

interface Props {
  view: ViewType
  setView: (v: ViewType) => void
  activeTab: string
  setActiveTab: (t: string) => void
  filters: ScanFilters
  setFilters: (f: ScanFilters) => void
}

export function ScanHeader({ view, setView, activeTab, setActiveTab, filters, setFilters }: Props) {
  const tabs = ['PARA MIM', 'AUSÊNCIAS', 'COMPROMISSOS', 'ALERTAS DO SISTEMA', 'DELEGADOS POR MIM']

  return (
    <div className="flex flex-col bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-slate-100">
        <div className="bg-slate-100/80 p-1 rounded-lg flex items-center h-11 border border-slate-200">
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

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 text-xs font-bold uppercase text-[#8A6D3B] gap-2 border-[#E5D5B5] bg-[#FDFBF7] hover:bg-[#F8F1E3] flex-1 sm:flex-none"
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

          <Select defaultValue="geral">
            <SelectTrigger className="w-full sm:w-[160px] h-11 text-xs font-bold uppercase border-slate-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Geral</SelectItem>
              <SelectItem value="meus">Meus Pacientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-4 pt-2">
        <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 pb-3 pt-4 text-[11px] whitespace-nowrap font-black uppercase border-b-[3px] transition-colors tracking-wide',
                activeTab === tab
                  ? 'border-[#D6A75A] text-[#1A233A]'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
