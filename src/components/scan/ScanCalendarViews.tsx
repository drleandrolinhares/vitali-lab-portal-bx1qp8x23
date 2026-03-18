import { Booking, ScanBlock, ScanSetting, ScanFilters, ViewType } from './types'
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  getDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { generateTimeSlots, checkBlockOverlap } from './utils'
import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Props {
  view: ViewType
  currentDate: Date
  bookings: Booking[]
  blocks: ScanBlock[]
  settings: ScanSetting[]
  filters: ScanFilters
  isStaff: boolean
  currentUserId?: string
  activeTab: string
  onSlotClick: (date: string, start: string, end: string) => void
  onBookingClick: (booking: Booking) => void
  setCurrentDate: (date: Date) => void
  setView: (v: ViewType) => void
}

function SlotItem({
  slot,
  dateStr,
  bookings,
  blocks,
  filters,
  isStaff,
  currentUserId,
  onSlotClick,
  onBookingClick,
}: any) {
  const overlappingBlock = checkBlockOverlap(slot.start, slot.end, dateStr, blocks)

  if (overlappingBlock && filters.showBlocks) {
    return (
      <div className="h-[72px] border-b border-slate-100 p-1.5 group">
        <div className="w-full h-full rounded-md bg-slate-50 text-slate-400 border border-slate-200 border-dashed flex items-center justify-center text-[10px] font-bold uppercase cursor-not-allowed">
          Bloqueado
        </div>
      </div>
    )
  }

  const overlappingBooking = bookings.find(
    (b: any) => b.start_time.substring(0, 5) < slot.end && b.end_time.substring(0, 5) > slot.start,
  )

  if (overlappingBooking && filters.showBookings) {
    const isMine = overlappingBooking.dentist_id === currentUserId
    const canViewDetails = isStaff || isMine

    return (
      <div className="h-[72px] border-b border-slate-100 p-1.5">
        <div
          onClick={() => canViewDetails && onBookingClick(overlappingBooking)}
          className={cn(
            'w-full h-full rounded-md border shadow-sm select-none transition-colors relative flex flex-col justify-center px-3',
            canViewDetails
              ? 'bg-[#1A233A] text-white border-[#1A233A] cursor-pointer hover:bg-[#2A344A]'
              : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed opacity-80',
          )}
        >
          <div className="flex items-center gap-1.5 mb-0.5 opacity-80">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-bold tracking-wider">
              {slot.start} - {slot.end}
            </span>
          </div>
          <p className="font-bold text-xs truncate">
            {canViewDetails ? overlappingBooking.patient_name : 'OCUPADO'}
          </p>
        </div>
      </div>
    )
  }

  if (overlappingBooking && !filters.showBookings) return null
  if (overlappingBlock && !filters.showBlocks) return null

  return (
    <div
      onClick={() => onSlotClick(dateStr, slot.start, slot.end)}
      className="h-[72px] border-b border-slate-100 p-1 group cursor-pointer"
    >
      <div className="w-full h-full rounded-md border border-transparent group-hover:border-dashed group-hover:border-slate-300 group-hover:bg-slate-50 flex items-center justify-center transition-all">
        <span className="text-[10px] font-bold text-transparent group-hover:text-slate-400 tracking-wider">
          {slot.start} - {slot.end}
        </span>
      </div>
    </div>
  )
}

export function ScanCalendarViews({
  view,
  currentDate,
  bookings,
  blocks,
  settings,
  filters,
  isStaff,
  currentUserId,
  activeTab,
  onSlotClick,
  onBookingClick,
  setCurrentDate,
  setView,
}: Props) {
  const visibleBookings = bookings.filter((b) => {
    if (activeTab === 'PARA MIM') return b.dentist_id === currentUserId
    if (activeTab === 'AUSÊNCIAS') return false
    if (activeTab === 'COMPROMISSOS') return true
    if (activeTab === 'ALERTAS DO SISTEMA') return false
    if (activeTab === 'DELEGADOS POR MIM') return false
    return true
  })

  const visibleBlocks = blocks.filter((b) => {
    if (activeTab === 'AUSÊNCIAS') return true
    if (activeTab === 'PARA MIM') return true
    if (activeTab === 'COMPROMISSOS') return true
    return false
  })

  if (view === 'month') {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
    const mDays = []
    let day = start
    while (day <= end) {
      mDays.push(day)
      day = addDays(day, 1)
    }

    const hasMonthRecords = mDays.some((d) => {
      const dStr = format(d, 'yyyy-MM-dd')
      const dBookings = visibleBookings.filter((b) => b.booking_date === dStr)
      return filters.showBookings && dBookings.length > 0
    })

    if (!hasMonthRecords) {
      return (
        <Card className="h-full w-full min-h-[400px] flex items-center justify-center border border-slate-200 shadow-sm bg-white rounded-xl">
          <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-center px-4">
            NENHUM REGISTRO ENCONTRADO PARA OS FILTROS SELECIONADOS.
          </p>
        </Card>
      )
    }

    return (
      <div className="grid grid-cols-7 h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
          <div
            key={d}
            className="p-3 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase border-r border-b border-slate-100 bg-slate-50/50"
          >
            {d}
          </div>
        ))}
        {mDays.map((d, i) => {
          const dateStr = format(d, 'yyyy-MM-dd')
          const dayBookings = visibleBookings.filter((b) => b.booking_date === dateStr)
          const isCurrentMonth = isSameMonth(d, currentDate)
          return (
            <div
              key={i}
              onClick={() => {
                setCurrentDate(d)
                setView('day')
              }}
              className={cn(
                'min-h-[120px] p-2 border-r border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col gap-1',
                !isCurrentMonth && 'bg-slate-50/30 opacity-60',
              )}
            >
              <div
                className={cn(
                  'text-sm font-bold mb-1 w-8 h-8 flex items-center justify-center rounded-full ml-auto',
                  isSameDay(d, new Date()) && 'bg-[#1A233A] text-white',
                )}
              >
                {format(d, 'd')}
              </div>
              {filters.showBookings && dayBookings.length > 0 && (
                <div className="text-[10px] bg-[#1A233A]/10 text-[#1A233A] px-2 py-1 rounded font-bold truncate border border-[#1A233A]/10 uppercase text-center">
                  {dayBookings.length} Reserva{dayBookings.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const days =
    view === 'day'
      ? [currentDate]
      : Array.from({ length: 7 }).map((_, i) =>
          addDays(startOfWeek(currentDate, { weekStartsOn: 0 }), i),
        )

  const hasRecords = days.some((d) => {
    const dateStr = format(d, 'yyyy-MM-dd')
    const dayBookings = visibleBookings.filter((b) => b.booking_date === dateStr)
    const setting = settings.find((s) => s.day_of_week === getDay(d))
    const slots = generateTimeSlots(setting)
    const hasBlocks = slots.some((slot) =>
      checkBlockOverlap(slot.start, slot.end, dateStr, visibleBlocks),
    )
    return (filters.showBookings && dayBookings.length > 0) || (filters.showBlocks && hasBlocks)
  })

  if (!hasRecords) {
    return (
      <Card className="h-full w-full min-h-[400px] flex items-center justify-center border border-slate-200 shadow-sm bg-white rounded-xl">
        <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-center px-4">
          NENHUM REGISTRO ENCONTRADO PARA OS FILTROS SELECIONADOS.
        </p>
      </Card>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col flex-1 min-h-[500px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm',
      )}
    >
      <div
        className={cn(
          'flex border-b border-slate-200 bg-slate-50/50',
          view === 'week' && 'divide-x divide-slate-100',
        )}
      >
        {days.map((d, i) => {
          const isToday = isSameDay(d, new Date())
          return (
            <div key={i} className="flex-1 p-3 text-center min-w-[120px]">
              <p
                className={cn(
                  'text-[10px] font-black uppercase tracking-widest',
                  isToday ? 'text-[#1A233A]' : 'text-slate-400',
                )}
              >
                {format(d, 'EEEE', { locale: ptBR })}
              </p>
              <p
                className={cn(
                  'text-2xl font-black mt-0.5',
                  isToday ? 'text-[#1A233A]' : 'text-slate-800',
                )}
              >
                {format(d, 'dd')}
              </p>
            </div>
          )
        })}
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex">
        {days.map((d, i) => {
          const dateStr = format(d, 'yyyy-MM-dd')
          const dayBookings = visibleBookings.filter((b) => b.booking_date === dateStr)
          const setting = settings.find((s) => s.day_of_week === getDay(d))
          const slots = generateTimeSlots(setting)

          return (
            <div
              key={i}
              className={cn(
                'flex-1 min-w-[120px] flex flex-col',
                view === 'week' && 'border-r border-slate-100 last:border-0',
              )}
            >
              {!setting?.is_available ? (
                <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50/30">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                    Fechado
                  </div>
                </div>
              ) : slots.length === 0 ? null : (
                slots.map((slot, sIdx) => (
                  <SlotItem
                    key={sIdx}
                    slot={slot}
                    dateStr={dateStr}
                    bookings={dayBookings}
                    blocks={visibleBlocks}
                    filters={filters}
                    isStaff={isStaff}
                    currentUserId={currentUserId}
                    onSlotClick={onSlotClick}
                    onBookingClick={onBookingClick}
                  />
                ))
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
