import * as React from 'react'
import { addDays, format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  const handlePresetSelect = (value: string) => {
    const today = endOfDay(new Date())
    let start = startOfDay(new Date())

    switch (value) {
      case '7':
        start = subDays(today, 7)
        break
      case '30':
        start = subDays(today, 30)
        break
      case '90':
        start = subDays(today, 90)
        break
      case '180':
        start = subMonths(today, 6)
        break
      case '365':
        start = subMonths(today, 12)
        break
      case 'all':
        start = subMonths(today, 120)
        break // roughly 10 years for 'all'
    }

    setDate({ from: start, to: today })
  }

  return (
    <div className={cn('flex flex-col sm:flex-row items-start sm:items-center gap-2', className)}>
      <Select onValueChange={handlePresetSelect}>
        <SelectTrigger className="w-[140px] bg-white h-9">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Últimos 7 dias</SelectItem>
          <SelectItem value="30">Últimos 30 dias</SelectItem>
          <SelectItem value="90">Últimos 90 dias</SelectItem>
          <SelectItem value="180">Últimos 6 meses</SelectItem>
          <SelectItem value="365">Últimos 12 meses</SelectItem>
          <SelectItem value="all">Todo o período</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full sm:w-[260px] justify-start text-left font-normal bg-white h-9',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy')} - {format(date.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Selecione a data customizada</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
