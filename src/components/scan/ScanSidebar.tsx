import React, { useMemo } from 'react'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Booking, ScanFilters } from './types'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'

interface Props {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  bookings: Booking[]
  isStaff: boolean
  currentUserId?: string
  filters: ScanFilters
}

export function ScanSidebar({
  currentDate,
  setCurrentDate,
  bookings,
  isStaff,
  currentUserId,
  filters,
}: Props) {
  const visibleBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!isStaff && b.dentist_id !== currentUserId) return false
      if (isStaff && filters.dentistId && filters.dentistId !== 'all') {
        if (b.dentist_id !== filters.dentistId) return false
      }
      return true
    })
  }, [bookings, isStaff, currentUserId, filters.dentistId])

  const CustomDayButton = useMemo(() => {
    const Component = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
      const { day, modifiers, className, ...rest } = props
      const dateStr = day.date ? format(day.date, 'yyyy-MM-dd') : ''
      const dayBookings = dateStr
        ? visibleBookings
            .filter((b) => b.booking_date === dateStr)
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
        : []

      return (
        <CalendarDayButton
          ref={ref}
          day={day}
          modifiers={modifiers}
          className={cn(className, 'relative overflow-hidden')}
          {...rest}
        >
          <span className="relative z-10">{props.children}</span>
          {dayBookings.length > 0 && (
            <div className="absolute bottom-1 left-0 right-0 flex flex-col gap-[2px] w-full px-1.5 z-0">
              {dayBookings.slice(0, 3).map((b) => {
                const colors = [
                  'bg-blue-400',
                  'bg-pink-400',
                  'bg-emerald-400',
                  'bg-amber-400',
                  'bg-purple-400',
                ]
                const charCode = b.id.charCodeAt(0) || 0
                const colorClass = colors[charCode % colors.length]
                return (
                  <div
                    key={b.id}
                    className={cn('h-[3px] w-full rounded-full opacity-90', colorClass)}
                  />
                )
              })}
              {dayBookings.length > 3 && (
                <div className="h-[3px] w-full rounded-full bg-slate-300 opacity-90 flex items-center justify-center text-[5px] leading-none text-slate-600 font-bold"></div>
              )}
            </div>
          )}
        </CalendarDayButton>
      )
    })
    Component.displayName = 'CustomDayButton'
    return Component
  }, [visibleBookings])

  return (
    <Card className="w-full lg:w-[320px] shrink-0 h-max shadow-sm border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Navegação</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(new Date())}
          className="h-7 px-3 text-[10px] font-bold uppercase border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          Hoje
        </Button>
      </div>
      <CardContent className="p-4 flex justify-center bg-white">
        <Calendar
          mode="single"
          selected={currentDate}
          month={currentDate}
          onMonthChange={setCurrentDate}
          onSelect={(d) => d && setCurrentDate(d)}
          components={{ DayButton: CustomDayButton }}
          className="w-full flex justify-center [&_.rdp]:w-full [&_.rdp-month]:w-full [&_table]:w-full [&_td]:w-10 [&_td]:h-10 [&_.rdp-caption_label]:text-sm [&_.rdp-caption_label]:font-black [&_.rdp-caption_label]:uppercase [&_.rdp-caption_label]:tracking-wider [&_.rdp-head_cell]:text-[10px] [&_.rdp-head_cell]:font-bold [&_.rdp-head_cell]:text-slate-400 [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:w-8 [&_.rdp-day_selected]:bg-[#1A233A] [&_.rdp-day_selected]:text-white [&_.rdp-day_today]:font-black [&_.rdp-day_today]:border-b-2 [&_.rdp-day_today]:border-[#1A233A]"
        />
      </CardContent>
    </Card>
  )
}
