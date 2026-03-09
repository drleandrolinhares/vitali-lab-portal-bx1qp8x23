import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Stage, OrderHistory } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDuration(diffMs: number) {
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return '< 1 min'
  if (diffMins < 60) return `${diffMins} min`
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  const days = Math.floor(hours / 24)
  const remHours = hours % 24
  return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`
}

export function processOrderHistory(history: OrderHistory[], kanbanStages: Stage[]) {
  const historyAsc = [...(history || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  let previousIndex = -1
  return historyAsc
    .map((event, i) => {
      const nextEvent = historyAsc[i + 1]
      const startDate = new Date(event.date)
      const endDate = nextEvent ? new Date(nextEvent.date) : new Date()
      const diffMs = endDate.getTime() - startDate.getTime()

      let stageName = 'Criação'
      if (event.note?.startsWith('Movido para ')) {
        stageName = event.note.replace('Movido para ', '')
      } else if (event.note) {
        stageName = event.note
      } else if (i === 0) {
        stageName = kanbanStages[0]?.name || 'TRIAGEM'
      } else {
        stageName = 'Atualização de Status'
      }

      const stageObj = kanbanStages.find((s) => s.name.toUpperCase() === stageName.toUpperCase())
      const currentIndex = stageObj ? stageObj.orderIndex : -1

      let direction: 'forward' | 'backward' | 'none' = 'none'
      if (previousIndex !== -1 && currentIndex !== -1) {
        if (currentIndex > previousIndex) direction = 'forward'
        else if (currentIndex < previousIndex) direction = 'backward'
      }

      if (currentIndex !== -1) previousIndex = currentIndex

      return {
        ...event,
        stageName,
        durationStr: formatDuration(diffMs),
        direction,
        isCurrent: !nextEvent,
        durationMs: diffMs,
      }
    })
    .reverse()
}
