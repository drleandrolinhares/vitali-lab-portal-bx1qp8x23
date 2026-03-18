import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScanFilters } from './types'

interface Props {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  filters: ScanFilters
  setFilters: (f: ScanFilters) => void
}

export function ScanSidebar({ currentDate, setCurrentDate, filters, setFilters }: Props) {
  return (
    <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-4">
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0 flex justify-center bg-background">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(d) => d && setCurrentDate(d)}
            className="pointer-events-auto w-full flex justify-center [&_.rdp]:w-full [&_.rdp-month]:w-full [&_table]:w-full [&_td]:w-10 [&_td]:h-10"
          />
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 pt-4 px-4 bg-muted/20 border-b border-border/50">
          <CardTitle className="text-sm uppercase font-bold text-muted-foreground">
            Visibilidade
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-3 bg-primary/5 p-3 rounded-md border border-primary/10">
            <Checkbox
              id="show-bookings"
              checked={filters.showBookings}
              onCheckedChange={(c) => setFilters({ ...filters, showBookings: !!c })}
            />
            <Label
              htmlFor="show-bookings"
              className="text-sm font-semibold cursor-pointer text-foreground flex-1"
            >
              Reservas Confirmadas
            </Label>
          </div>
          <div className="flex items-center space-x-3 bg-muted p-3 rounded-md border border-border">
            <Checkbox
              id="show-blocks"
              checked={filters.showBlocks}
              onCheckedChange={(c) => setFilters({ ...filters, showBlocks: !!c })}
            />
            <Label
              htmlFor="show-blocks"
              className="text-sm font-semibold cursor-pointer text-foreground flex-1"
            >
              Bloqueios Administrativos
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
