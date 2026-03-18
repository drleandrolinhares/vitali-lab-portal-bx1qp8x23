import React, { useMemo } from 'react'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Booking, ScanFilters } from './types'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Props {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  onDateSelect: (date: Date) => void
  bookings: Booking[]
  isStaff: boolean
  currentUserId?: string
  filters: ScanFilters
}

export function ScanSidebar({
  currentDate,
  setCurrentDate,
  onDateSelect,
  bookings,
  isStaff,
  currentUserId,
  filters,
}: Props) {
  const visibleBookingsForDots = useMemo(() => {
    if (!filters.showBookings) return []
    return bookings
  }, [bookings, filters.showBookings])

  const CustomDayButton = useMemo(() => {
    const Component = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
      const { day, modifiers, className, ...rest } = props
      const dateStr = day.date ? format(day.date, 'yyyy-MM-dd') : ''
      const dayBookings = dateStr
        ? visibleBookingsForDots
            .filter((b) => b.booking_date.substring(0, 10) === dateStr)
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
        : []

      return (
        <CalendarDayButton
          ref={ref}
          day={day}
          modifiers={modifiers}
          className={cn(
            className,
            'relative overflow-hidden flex flex-col items-center justify-start h-10 pt-1.5 group',
          )}
          {...rest}
        >
          <span className="relative z-10 leading-none">{props.children}</span>
          {dayBookings.length > 0 && (
            <div className="mt-auto mb-1 flex gap-[3px] flex-wrap justify-center w-full px-1">
              {dayBookings.slice(0, 3).map((b) => {
                const isMine = b.dentist_id === currentUserId
                const canViewDetails = isStaff || isMine

                const colors = [
                  'bg-blue-400',
                  'bg-pink-400',
                  'bg-emerald-400',
                  'bg-amber-400',
                  'bg-purple-400',
                ]
                const charCode = b.id.charCodeAt(0) || 0
                const colorClass = canViewDetails
                  ? colors[charCode % colors.length]
                  : 'bg-slate-300'
                return (
                  <div
                    key={b.id}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full opacity-90 transition-colors',
                      colorClass,
                    )}
                  />
                )
              })}
              {dayBookings.length > 3 && (
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 opacity-90 transition-colors"></div>
              )}
            </div>
          )}
        </CalendarDayButton>
      )
    })
    Component.displayName = 'CustomDayButton'
    return Component
  }, [visibleBookingsForDots, currentUserId, isStaff])

  return (
    <Card className="w-full lg:w-[320px] shrink-0 h-max shadow-sm border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Navegação</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date()
            setCurrentDate(today)
            onDateSelect(today)
          }}
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
          onSelect={(d) => d && onDateSelect(d)}
          components={{ DayButton: CustomDayButton }}
          className="w-full flex justify-center [&_.rdp]:w-full [&_.rdp-month]:w-full [&_table]:w-full [&_td]:w-10 [&_td]:h-10 [&_.rdp-caption_label]:text-sm [&_.rdp-caption_label]:font-black [&_.rdp-caption_label]:uppercase [&_.rdp-caption_label]:tracking-wider [&_.rdp-head_cell]:text-[10px] [&_.rdp-head_cell]:font-bold [&_.rdp-head_cell]:text-slate-400 [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:w-8 [&_.rdp-day_selected]:bg-[#1A233A] [&_.rdp-day_selected]:text-white [&_.rdp-day_today]:font-black [&_.rdp-day_today]:border-b-2 [&_.rdp-day_today]:border-[#1A233A]"
        />
      </CardContent>
    </Card>
  )
}
