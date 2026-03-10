import { Stage } from '@/lib/types'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export type PriceStage = { id: string; name: string; price: number; kanban_stage: string }
export type PriceItem = {
  id: string
  work_type: string
  sector?: string
  price?: string | number
  price_stages?: PriceStage[]
}

export function getOrderFinancials(order: any, priceList?: PriceItem[], kanbanStages?: Stage[]) {
  const isFullyCompleted = order.status === 'completed' || order.status === 'delivered'
  const isCancelled = order.status === 'cancelled'

  const quantity = Math.max(1, (order.teeth?.length || 0) + (order.arches?.length || 0))
  let basePrice = order.basePrice || 0
  let unitPrice = order.unitPrice || 0

  // Dynamically calculate using Unit Price from Price List * Quantity (Elements count)
  if (priceList && priceList.length > 0) {
    const priceItem =
      priceList.find(
        (p) => p.work_type === order.workType && (!p.sector || p.sector === order.sector),
      ) || priceList.find((p) => p.work_type === order.workType)

    if (priceItem && priceItem.price != null) {
      const numericString = String(priceItem.price)
        .replace(/[^\d,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
      const parsed = parseFloat(numericString)
      if (!isNaN(parsed) && parsed > 0) {
        unitPrice = parsed
        // Applies multiplication rule globally to ensure financial accuracy
        basePrice = unitPrice * quantity
      }
    }
  }

  // Fallback
  if (unitPrice === 0) {
    unitPrice = quantity > 0 ? basePrice / quantity : 0
  }

  const completedCost = isFullyCompleted ? basePrice : 0
  const pipelineCost = !isFullyCompleted && !isCancelled ? basePrice : 0

  const clearedBalance = order.clearedBalance || 0
  const outstandingCost = Math.max(0, completedCost - clearedBalance)

  return {
    ...order,
    basePrice,
    unitPrice,
    quantity,
    mappedStages: [],
    completedCost,
    pendingCost: pipelineCost,
    pipelineCost,
    clearedBalance,
    outstandingCost,
    totalCost: completedCost + pipelineCost,
  }
}

export const formatBRL = (val: number) =>
  val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function getOrderCompletionDate(order: any): Date | null {
  if (order.status !== 'completed' && order.status !== 'delivered') return null

  if (order.history && order.history.length > 0) {
    const completionEvents = order.history.filter(
      (h: any) => h.status === 'completed' || h.status === 'delivered',
    )
    if (completionEvents.length > 0) {
      completionEvents.sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      return new Date(completionEvents[0].date)
    }
  }
  return new Date(order.createdAt)
}

export function generateMonthOptions() {
  return Array.from({ length: 13 }).map((_, i) => {
    const d = subMonths(new Date(), i)
    return {
      value: format(d, 'yyyy-MM'),
      label: format(d, 'MMMM yyyy', { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase()),
    }
  })
}

export function filterOrdersForFinancials(orders: any[], selectedMonth: string) {
  return orders.filter((o) => {
    if (o.status === 'cancelled') return false

    if (o.status === 'completed' || o.status === 'delivered') {
      const compDate = getOrderCompletionDate(o)
      return compDate && format(compDate, 'yyyy-MM') === selectedMonth
    } else {
      const createdStr = format(new Date(o.createdAt), 'yyyy-MM')
      return createdStr <= selectedMonth
    }
  })
}
