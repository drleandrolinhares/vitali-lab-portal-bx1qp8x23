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
import { Clock, CalendarX2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
    if (!filters.showBookings) return false
    if (!isStaff && b.dentist_id !== currentUserId) return false
    if (isStaff && filters.dentistId && filters.dentistId !== 'all') {
      if (b.dentist_id !== filters.dentistId) return false
    }
    return true
  })

  const timelineBookings = bookings.filter((b) => {
    if (!filters.showBookings) return false
    return true
  })

  if (activeTab === 'AGENDAMENTOS MARCADOS') {
    if (isStaff) {
      const allBookings = [...visibleBookings].sort((a, b) => {
        if (a.booking_date !== b.booking_date) return a.booking_date.localeCompare(b.booking_date)
        return a.start_time.localeCompare(b.start_time)
      })

      const grouped = allBookings.reduce(
        (acc, b) => {
          const date = b.booking_date.substring(0, 10)
          if (!acc[date]) acc[date] = []
          acc[date].push(b)
          return acc
        },
        {} as Record<string, Booking[]>,
      )

      const sortedDates = Object.keys(grouped).sort()

      return (
        <div className="flex flex-col gap-6">
          {sortedDates.length === 0 ? (
            <Card className="h-full w-full min-h-[400px] flex flex-col items-center justify-center border border-slate-200 shadow-sm bg-white rounded-xl text-slate-400 gap-3">
              <CalendarX2 className="w-10 h-10 opacity-50" />
              <p className="text-sm font-black uppercase tracking-widest text-center px-4">
                NENHUM AGENDAMENTO ENCONTRADO.
              </p>
            </Card>
          ) : (
            sortedDates.map((date) => (
              <div
                key={date}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-black text-sm uppercase tracking-wider text-[#1A233A]">
                  {format(new Date(date + 'T12:00:00'), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </div>
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-500 w-[140px]">
                        Horário
                      </TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-500">
                        Dentista
                      </TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-500">
                        Paciente
                      </TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-500 text-center w-[120px]">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grouped[date].map((b) => (
                      <TableRow
                        key={b.id}
                        className="cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => onBookingClick(b)}
                      >
                        <TableCell className="font-semibold text-slate-600 whitespace-nowrap">
                          {b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {b.profiles?.name || 'Não informado'}
                        </TableCell>
                        <TableCell className="font-black text-[#1A233A]">
                          {b.patient_name}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                            CONFIRMADO
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
          )}
        </div>
      )
    }

    const selectedDateStr = format(currentDate, 'yyyy-MM-dd')
    const dayBookings = visibleBookings
      .filter((b) => b.booking_date.substring(0, 10) === selectedDateStr)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))

    if (dayBookings.length === 0) {
      return (
        <Card className="h-full w-full min-h-[400px] flex flex-col items-center justify-center border border-slate-200 shadow-sm bg-white rounded-xl text-slate-400 gap-3">
          <CalendarX2 className="w-10 h-10 opacity-50" />
          <p className="text-sm font-black uppercase tracking-widest text-center px-4">
            NENHUM AGENDAMENTO ENCONTRADO PARA ESTA DATA.
          </p>
        </Card>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-[#1A233A] mb-2 px-2">
          {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </h3>
        {dayBookings.map((b) => (
          <div
            key={b.id}
            onClick={() => onBookingClick(b)}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-pink-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/20 w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-[#E11D48] group-hover:text-white transition-colors">
                <span className="text-[10px] font-black uppercase">
                  {format(new Date(b.booking_date.substring(0, 10) + 'T12:00:00'), 'MMM', {
                    locale: ptBR,
                  })}
                </span>
                <span className="text-lg font-black leading-none">
                  {format(new Date(b.booking_date.substring(0, 10) + 'T12:00:00'), 'dd')}
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

  if (view === 'month' && activeTab === 'VISÃO GERAL') {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })
    let currentDay = startDate
    const calendarDays = []
    while (currentDay <= endDate) {
      calendarDays.push(currentDay)
      currentDay = addDays(currentDay, 1)
    }

    return (
      <div className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full min-h-[500px]">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div
              key={d}
              className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[minmax(80px,1fr)] bg-slate-200 gap-px flex-1">
          {calendarDays.map((d) => {
            const dateStr = format(d, 'yyyy-MM-dd')
            const dayBookings = timelineBookings
              .filter((b) => b.booking_date.substring(0, 10) === dateStr)
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
            const isCurrentMonth = isSameMonth(d, currentDate)
            const isToday = isSameDay(d, new Date())

            return (
              <div
                key={dateStr}
                className={cn(
                  'bg-white p-1 sm:p-1.5 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-slate-50 group',
                  !isCurrentMonth && 'bg-slate-50/50 opacity-70',
                )}
              >
                <div className="flex items-center justify-between px-1 pt-1">
                  <span
                    className={cn(
                      'text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full',
                      isToday ? 'bg-[#E11D48] text-white' : 'text-slate-700',
                    )}
                  >
                    {format(d, 'd')}
                  </span>
                </div>
                <div className="flex flex-col gap-1 px-0.5 sm:px-1 overflow-y-auto no-scrollbar pb-1">
                  {dayBookings.map((b) => {
                    const isMine = b.dentist_id === currentUserId
                    const canViewDetails = isStaff || isMine

                    const colors = [
                      'bg-blue-100 text-blue-700 hover:bg-blue-200',
                      'bg-pink-100 text-pink-700 hover:bg-pink-200',
                      'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
                      'bg-amber-100 text-amber-700 hover:bg-amber-200',
                      'bg-purple-100 text-purple-700 hover:bg-purple-200',
                    ]
                    const charCode = b.id.charCodeAt(0) || 0
                    const colorClass = canViewDetails
                      ? colors[charCode % colors.length]
                      : 'bg-[#E11D48] text-white cursor-not-allowed border border-[#BE123C]'
                    return (
                      <div
                        key={b.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (canViewDetails) onBookingClick(b)
                        }}
                        className={cn(
                          'text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded truncate transition-colors shadow-sm',
                          canViewDetails ? 'cursor-pointer' : '',
                          colorClass,
                        )}
                        title={`${b.start_time.substring(0, 5)} - ${canViewDetails ? b.patient_name : 'INDISPONÍVEL'}`}
                      >
                        <span
                          className={cn(
                            'mr-1 font-semibold',
                            canViewDetails ? 'opacity-75' : 'opacity-90',
                          )}
                        >
                          {b.start_time.substring(0, 5)}
                        </span>
                        {canViewDetails ? b.patient_name : 'INDISPONÍVEL'}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const days = []
  if (view === 'day') {
    days.push(currentDate)
  } else if (view === 'week') {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 })
    for (let i = 0; i < 7; i++) days.push(addDays(start, i))
  }

  return (
    <div className="flex flex-col gap-6">
      {days.map((d) => {
        const dateStr = format(d, 'yyyy-MM-dd')
        const dayBookings = timelineBookings.filter(
          (b) => b.booking_date.substring(0, 10) === dateStr,
        )
        const setting = settings.find((s) => s.day_of_week === getDay(d))
        const slots = generateTimeSlots(setting)

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
                  const isTargetDentist =
                    isStaff && filters.dentistId && filters.dentistId !== 'all'
                      ? overlapBooking?.dentist_id === filters.dentistId
                      : true

                  const isVisibleForUser = isStaff ? isTargetDentist : isMine
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
                          <div className="bg-[#E11D48] border-[#BE123C] text-white shadow-sm h-10 px-4 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                            Indisponível
                          </div>
                        ) : overlapBooking ? (
                          <div
                            onClick={() => canViewDetails && onBookingClick(overlapBooking)}
                            className={cn(
                              'h-auto min-h-[40px] py-2 px-4 rounded-lg border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 transition-colors',
                              isVisibleForUser
                                ? 'bg-[#E11D48]/5 border-[#E11D48]/20 cursor-pointer hover:bg-[#E11D48]/10'
                                : canViewDetails
                                  ? 'bg-slate-100 border-slate-200 opacity-80 cursor-pointer hover:bg-slate-200'
                                  : 'bg-[#E11D48] border-[#BE123C] text-white cursor-not-allowed shadow-sm',
                            )}
                          >
                            <span
                              className={cn(
                                'font-bold text-sm truncate',
                                isVisibleForUser
                                  ? 'text-[#E11D48]'
                                  : canViewDetails
                                    ? 'text-slate-600'
                                    : 'text-white tracking-widest',
                              )}
                            >
                              {canViewDetails ? overlapBooking.patient_name : 'INDISPONÍVEL'}
                            </span>
                            {canViewDetails && (
                              <span
                                className={cn(
                                  'text-xs font-bold truncate',
                                  isVisibleForUser ? 'text-[#E11D48]/70' : 'text-slate-500',
                                )}
                              >
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
