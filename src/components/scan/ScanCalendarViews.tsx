import { Booking, ScanBlock, ScanSetting, ScanFilters, ViewType } from './types'
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  getDay,
  parseISO,
  isBefore,
  startOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { generateTimeSlots, checkBlockOverlap } from './utils'
import { Clock, CalendarX2 } from 'lucide-react'
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
}: Props) {
  const visibleBookings = bookings.filter((b) => {
    if (!isStaff && b.dentist_id !== currentUserId) return false
    if (isStaff && filters.dentistId && filters.dentistId !== 'all') {
      if (b.dentist_id !== filters.dentistId) return false
    }
    return true
  })

  if (activeTab === 'AGENDAMENTOS MARCADOS') {
    const today = startOfDay(new Date())
    const futureBookings = visibleBookings
      .filter((b) => {
        const bDate = parseISO(b.booking_date + 'T00:00:00')
        return !isBefore(bDate, today)
      })
      .sort(
        (a, b) =>
          a.booking_date.localeCompare(b.booking_date) || a.start_time.localeCompare(b.start_time),
      )

    if (futureBookings.length === 0) {
      return (
        <Card className="h-full w-full min-h-[400px] flex flex-col items-center justify-center border border-slate-200 shadow-sm bg-white rounded-xl text-slate-400 gap-3">
          <CalendarX2 className="w-10 h-10 opacity-50" />
          <p className="text-sm font-black uppercase tracking-widest text-center px-4">
            NENHUM AGENDAMENTO ENCONTRADO.
          </p>
        </Card>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {futureBookings.map((b) => (
          <div
            key={b.id}
            onClick={() => onBookingClick(b)}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-pink-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/20 w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-[#E11D48] group-hover:text-white transition-colors">
                <span className="text-[10px] font-black uppercase">
                  {format(parseISO(b.booking_date), 'MMM', { locale: ptBR })}
                </span>
                <span className="text-lg font-black leading-none">
                  {format(parseISO(b.booking_date), 'dd')}
                </span>
              </div>
              <div>
                <p className="font-black text-[#1A233A] text-lg leading-tight">{b.patient_name}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1">
                  <Clock className="w-3.5 h-3.5" /> {b.start_time.substring(0, 5)} -{' '}
                  {b.end_time.substring(0, 5)}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Dentista Solicitante
              </span>
              <span className="font-bold text-sm text-[#1A233A]">
                {b.profiles?.name || 'Não informado'}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const days = []
  if (view === 'day') {
    days.push(currentDate)
  } else if (view === 'week') {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 })
    for (let i = 0; i < 7; i++) days.push(addDays(start, i))
  } else {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
    let day = start
    while (day <= end) {
      days.push(day)
      day = addDays(day, 1)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {days.map((d) => {
        const dateStr = format(d, 'yyyy-MM-dd')
        const dayBookings = visibleBookings.filter((b) => b.booking_date === dateStr)
        const setting = settings.find((s) => s.day_of_week === getDay(d))
        const slots = generateTimeSlots(setting)

        if (view === 'month' && slots.length > 0) {
          const hasEvents = slots.some(
            (slot) =>
              checkBlockOverlap(slot.start, slot.end, dateStr, blocks) ||
              dayBookings.find(
                (b) =>
                  b.start_time.substring(0, 5) < slot.end &&
                  b.end_time.substring(0, 5) > slot.start,
              ),
          )
          if (!hasEvents && !isSameDay(d, currentDate)) return null
        }

        return (
          <div
            key={dateStr}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col"
          >
            <div
              className={cn(
                'bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center',
                isSameDay(d, new Date()) && 'bg-pink-50 border-pink-100',
              )}
            >
              <h3
                className={cn(
                  'font-black uppercase tracking-wider text-sm',
                  isSameDay(d, new Date()) ? 'text-[#E11D48]' : 'text-[#1A233A]',
                )}
              >
                {format(d, "EEEE, dd 'de' MMMM", { locale: ptBR })}{' '}
                {isSameDay(d, new Date()) && '(Hoje)'}
              </h3>
            </div>
            <div className="flex flex-col divide-y divide-slate-100">
              {!setting?.is_available ? (
                <div className="p-4 text-center text-slate-400 font-bold uppercase text-xs tracking-widest bg-slate-50/50">
                  Dia Fechado
                </div>
              ) : slots.length === 0 ? (
                <div className="p-4 text-center text-slate-400 font-bold uppercase text-xs tracking-widest bg-slate-50/50">
                  Sem horários configurados
                </div>
              ) : (
                slots.map((slot) => {
                  const overlapBlock = checkBlockOverlap(slot.start, slot.end, dateStr, blocks)
                  const overlapBooking = dayBookings.find(
                    (b) =>
                      b.start_time.substring(0, 5) < slot.end &&
                      b.end_time.substring(0, 5) > slot.start,
                  )

                  if (overlapBlock && !filters.showBlocks) return null
                  if (overlapBooking && !filters.showBookings) return null

                  const isMine = overlapBooking?.dentist_id === currentUserId
                  const canViewDetails = isStaff || isMine

                  return (
                    <div
                      key={slot.start}
                      className="flex flex-col sm:flex-row sm:items-center p-2.5 hover:bg-slate-50 transition-colors gap-3 min-h-[64px]"
                    >
                      <div className="w-full sm:w-36 shrink-0 flex items-center gap-2 text-xs font-black text-slate-500 tracking-wider">
                        <Clock className="w-4 h-4 text-slate-400" /> {slot.start} - {slot.end}
                      </div>
                      <div className="flex-1">
                        {overlapBlock ? (
                          <div className="bg-slate-100 border border-slate-200 text-slate-500 h-10 px-4 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                            Bloqueio Administrativo
                          </div>
                        ) : overlapBooking ? (
                          <div
                            onClick={() => canViewDetails && onBookingClick(overlapBooking)}
                            className={cn(
                              'h-auto min-h-[40px] py-2 px-4 rounded-lg border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 transition-colors',
                              canViewDetails
                                ? 'bg-[#E11D48]/5 border-[#E11D48]/20 cursor-pointer hover:bg-[#E11D48]/10'
                                : 'bg-slate-100 border-slate-200 opacity-80 cursor-not-allowed',
                            )}
                          >
                            <span
                              className={cn(
                                'font-bold text-sm truncate',
                                canViewDetails ? 'text-[#E11D48]' : 'text-slate-600',
                              )}
                            >
                              {canViewDetails ? overlapBooking.patient_name : 'Horário Ocupado'}
                            </span>
                            {canViewDetails && (
                              <span className="text-xs text-[#E11D48]/70 font-bold truncate">
                                {overlapBooking.profiles?.name}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div
                            onClick={() => onSlotClick(dateStr, slot.start, slot.end)}
                            className="h-10 border border-dashed border-slate-200 bg-white rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 hover:border-[#E11D48]/50 hover:bg-[#E11D48]/5 hover:text-[#E11D48] cursor-pointer uppercase tracking-widest transition-all"
                          >
                            + Novo Agendamento
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
