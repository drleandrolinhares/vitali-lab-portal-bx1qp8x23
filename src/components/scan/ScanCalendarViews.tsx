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

interface Props {
  view: ViewType
  currentDate: Date
  bookings: Booking[]
  blocks: ScanBlock[]
  settings: ScanSetting[]
  filters: ScanFilters
  isStaff: boolean
  currentUserId?: string
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
      <div className="text-[10px] p-2 rounded-md shadow-sm bg-slate-100 text-slate-500 border border-slate-300 border-dashed flex items-center justify-center text-center font-bold uppercase leading-tight cursor-not-allowed opacity-90">
        Bloqueado
        <br />
        Neste Horário
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
      <div
        onClick={() => canViewDetails && onBookingClick(overlappingBooking)}
        className={cn(
          'text-xs p-2 rounded-md border shadow-sm select-none transition-colors relative group',
          canViewDetails
            ? 'bg-primary/10 text-primary-foreground border-primary/20 cursor-pointer hover:bg-primary/20'
            : 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-80',
        )}
      >
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-1 rounded-l-md',
            canViewDetails ? 'bg-primary' : 'bg-slate-400',
          )}
        />
        <div className="pl-1.5">
          <p className="font-bold text-foreground flex items-center gap-1 mb-0.5">
            <Clock className="w-3 h-3 opacity-70" /> {slot.start} - {slot.end}
          </p>
          <p className="font-semibold text-slate-800 truncate">
            {canViewDetails ? overlappingBooking.patient_name : 'OCUPADO'}
          </p>
          {canViewDetails && isStaff && (
            <p className="truncate text-slate-500 text-[10px] mt-0.5 font-medium uppercase">
              {overlappingBooking.profiles?.name}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (overlappingBooking && !filters.showBookings) return null
  if (overlappingBlock && !filters.showBlocks) return null

  return (
    <div
      onClick={() => onSlotClick(dateStr, slot.start, slot.end)}
      className="text-xs p-2 rounded-md border border-dashed border-border bg-transparent text-muted-foreground hover:bg-primary/5 hover:border-primary/30 hover:text-primary cursor-pointer transition-colors text-center font-medium"
    >
      {slot.start} - {slot.end}
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
  onSlotClick,
  onBookingClick,
  setCurrentDate,
  setView,
}: Props) {
  if (view === 'month') {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
    const days = []
    let day = start
    while (day <= end) {
      days.push(day)
      day = addDays(day, 1)
    }

    return (
      <div className="grid grid-cols-7 h-full border-l border-t border-border/50 bg-background min-w-[600px] lg:min-w-0">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
          <div
            key={d}
            className="p-3 text-center text-xs font-bold text-muted-foreground uppercase border-r border-b border-border/50 bg-muted/20"
          >
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          const dateStr = format(d, 'yyyy-MM-dd')
          const dayBookings = bookings.filter((b) => b.booking_date === dateStr)
          const isCurrentMonth = isSameMonth(d, currentDate)
          return (
            <div
              key={i}
              onClick={() => {
                setCurrentDate(d)
                setView('day')
              }}
              className={cn(
                'min-h-[120px] p-2 border-r border-b border-border/50 hover:bg-muted/10 cursor-pointer transition-colors flex flex-col gap-1',
                !isCurrentMonth && 'opacity-40 bg-muted/5',
              )}
            >
              <div
                className={cn(
                  'text-sm font-bold mb-1 w-8 h-8 flex items-center justify-center rounded-full ml-auto',
                  isSameDay(d, new Date()) && 'bg-primary text-primary-foreground',
                )}
              >
                {format(d, 'd')}
              </div>
              {filters.showBookings && dayBookings.length > 0 && (
                <div className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold truncate border border-primary/10">
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

  return (
    <div
      className={cn(
        'flex flex-1 min-h-0 min-w-[800px] lg:min-w-0 bg-background border border-border/50 rounded-lg overflow-hidden',
        view === 'week' && 'divide-x divide-border/50',
      )}
    >
      {days.map((d, i) => {
        const dateStr = format(d, 'yyyy-MM-dd')
        const dayBookings = bookings.filter((b) => b.booking_date === dateStr)
        const setting = settings.find((s) => s.day_of_week === getDay(d))
        const slots = generateTimeSlots(setting)
        const isToday = isSameDay(d, new Date())

        return (
          <div key={i} className="flex-1 flex flex-col min-w-0">
            <div
              className={cn(
                'p-3 text-center border-b border-border/50',
                isToday ? 'bg-primary/10 border-primary/20' : 'bg-muted/20',
              )}
            >
              <p
                className={cn(
                  'text-xs font-bold uppercase',
                  isToday ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {format(d, 'EEEE', { locale: ptBR })}
              </p>
              <p
                className={cn(
                  'text-xl font-black mt-0.5',
                  isToday ? 'text-primary' : 'text-foreground',
                )}
              >
                {format(d, 'dd')}
              </p>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {!setting?.is_available ? (
                <div className="h-full flex flex-col items-center justify-center text-xs text-muted-foreground uppercase text-center opacity-50 p-4 font-bold border-2 border-dashed border-border rounded-lg bg-muted/10 min-h-[100px]">
                  Fechado
                </div>
              ) : slots.length === 0 ? null : (
                slots.map((slot, sIdx) => (
                  <SlotItem
                    key={sIdx}
                    slot={slot}
                    dateStr={dateStr}
                    bookings={dayBookings}
                    blocks={blocks}
                    filters={filters}
                    isStaff={isStaff}
                    currentUserId={currentUserId}
                    onSlotClick={onSlotClick}
                    onBookingClick={onBookingClick}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
