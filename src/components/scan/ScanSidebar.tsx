import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Booking, ScanFilters } from './types'
import { parseISO } from 'date-fns'

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
  const visibleBookings = bookings.filter((b) => {
    if (!isStaff && b.dentist_id !== currentUserId) return false
    if (isStaff && filters.dentistId && filters.dentistId !== 'all') {
      if (b.dentist_id !== filters.dentistId) return false
    }
    return true
  })

  const bookedDates = visibleBookings.map((b) => parseISO(b.booking_date))

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
          modifiers={{ booked: bookedDates }}
          modifiersClassNames={{
            booked:
              "relative after:content-[''] after:absolute after:bottom-[6px] after:left-1/2 after:-translate-x-1/2 after:w-3.5 after:h-1 after:bg-[#E11D48] after:rounded-full font-bold",
          }}
          className="w-full flex justify-center [&_.rdp]:w-full [&_.rdp-month]:w-full [&_table]:w-full [&_td]:w-10 [&_td]:h-10 [&_.rdp-caption_label]:text-sm [&_.rdp-caption_label]:font-black [&_.rdp-caption_label]:uppercase [&_.rdp-caption_label]:tracking-wider [&_.rdp-head_cell]:text-[10px] [&_.rdp-head_cell]:font-bold [&_.rdp-head_cell]:text-slate-400 [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:w-8 [&_.rdp-day_selected]:bg-[#1A233A] [&_.rdp-day_selected]:text-white [&_.rdp-day_today]:font-black [&_.rdp-day_today]:border-b-2 [&_.rdp-day_today]:border-[#1A233A]"
        />
      </CardContent>
    </Card>
  )
}
