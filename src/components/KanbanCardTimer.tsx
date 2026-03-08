import { useEffect, useState, useMemo } from 'react'
import { Clock } from 'lucide-react'
import { differenceInMinutes } from 'date-fns'
import { Order } from '@/lib/types'

interface KanbanCardTimerProps {
  order: Order
  currentStage: string
}

export function KanbanCardTimer({ order, currentStage }: KanbanCardTimerProps) {
  const [elapsed, setElapsed] = useState<string>('')

  const startTime = useMemo(() => {
    const stageHistory = order.history.find(
      (h) => h.note && h.note.toUpperCase().includes(`PARA ${currentStage.toUpperCase()}`),
    )
    if (stageHistory) return new Date(stageHistory.date)
    return new Date(order.createdAt)
  }, [order.history, order.createdAt, currentStage])

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const mins = Math.max(0, differenceInMinutes(now, startTime))

      if (mins < 60) {
        setElapsed(`${mins}m`)
      } else if (mins < 24 * 60) {
        const hrs = Math.floor(mins / 60)
        const remainingMins = mins % 60
        setElapsed(`${hrs}h ${remainingMins}m`)
      } else {
        const days = Math.floor(mins / (24 * 60))
        const hrs = Math.floor((mins % (24 * 60)) / 60)
        setElapsed(`${days}d ${hrs}h`)
      }
    }

    updateTimer()

    const now = new Date()
    const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())

    let interval: NodeJS.Timeout
    const timeout = setTimeout(() => {
      updateTimer()
      interval = setInterval(updateTimer, 60000)
    }, msUntilNextMinute)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [startTime])

  return (
    <div
      className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium shrink-0"
      title="Tempo na coluna atual"
    >
      <Clock className="w-3 h-3" />
      {elapsed}
    </div>
  )
}
